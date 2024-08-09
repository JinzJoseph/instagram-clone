import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";
import cloudinary from "../middlewares/cloudinary.js";
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const author = req.id;
    const image = req.file;
    if (!image) {
      return res.status(401).json({
        message: "All fileds are required..",
        success: false,
      });
    }
    // sharp the given image into common formats
    // const sharpedImage = await sharp(image.buffer)
    //   .resize({ width: 800, height: 800, fit: "inside" })
    //   .toFormat("jpeg", { quality: 80 })
    //   .toBuffer();
    //change it intp valid dataurl
    // const fileUri = `data:image/jpeg;base64,${sharpedImage.toString(
    //   "base64"
    // )}`;
    const fileUrl = getDataUri(image);
    const cloudResult = await cloudinary.uploader.upload(fileUrl);
    const post = new Post({
      caption,
      authorId: author,
      image: cloudResult.secure_url,
    });
    await post.save();

    // insert that new post id into user post array;
    const user = await UserActivation.findById(author);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    // populate the user details
    await post.populate({ path: "author", select: "-password" });
    return res.status(200).json({
      message: `New post added ${user.username}`,
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};
// get all post
export const allPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "Comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture ",
        },
      });
    return res.status(200).json({
      message: "successfull",
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};
//getuserpost

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: {
          createdAt: -1,
        },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      message: "successfully fetched data",
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(401).json({
        message: "There is no such post..",
        success: false,
      });
    }
    //build logic of like
    await Post.updateOne({ likes: { $push: userId } });
    await Post.save();
    //implement the socket io for notification

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(401).json({
        message: "There is no such post..",
        success: false,
      });
    }
    //build logic of dislike
    await Post.updateOne({ likes: { $pull: userId } });
    await Post.save();
    //implement the socket io for notification
    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};
export const addcomment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentUserId = req.id;
    const caption = req.body;
    const post = await Post.findById(postId);
    if (!caption) {
      return res.status(401).json({
        message: "text is required",
        success: false,
      });
    }
    const comment = new Comment({
      text: caption,
      author: commentUserId,
      post: postId,
    });
    await comment.save();
    //populate the username profilepic from comment model
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });
    post.Comments.push(comment._id);
    return res.status(200).json({
      message: "successfully added comment",
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

// get a particular post comment

export const getCommentOfPost = async (req, res) => {
  try {
    const postId = req.params;
    const comment = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });
    if (!comment) {
      return res.status(401).json({
        message: "There is no such comment",
        success: false,
      });
    }
    return res.status(200).json({
      message: "successfully fetched data",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// delete a post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params;
    const userId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(401).json({
        message: "there is no such post...",
        success: false,
      });
    }
    //check the post author id===userId + delete the details in the user.post + delete the whole comment in the post
    if (post.author.toString() === userId) {
      await Post.findByIdAndDelete(postId);
    } else {
      return res.status(200).json({
        message: "Unauthorized",
        success: false,
      });
    }
    let user = await User.findById(userId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //delete whole comment to post;
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({
      message: "All successfully deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarked = async (req, res) => {
  try {
    const postId = req.params;
    const authorId = req.id;
    const post = await Post.findById(postId);
    const user = await User.findById(authorId);
    if (!post) {
      return res.status(401).json({
        message: "There is no such Post..",
        success: false,
      });
    }
    if (user.bookmarks.includes(postId)) {
      //remove that that post
      await User.updateOne({ $pull: { postId } });
      await User.save();
      return res.status(200).json({
        message: "Removed that post from bookmark",
        success: true,
      });
    } else {
      // include that post in bookmark
      await User.updateOne({ $push: { postId } });
      await User.save();
      return res.status(200).json({
        message: "Added that post from bookmark",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
