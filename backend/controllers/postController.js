import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";
import getDataUri from "../middlewares/getDataurl.js";
import cloudinary from "../middlewares/cloudinary.js";
import { getReciverSocketId, io } from "../socket/soket.js";
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

    // console.log(caption,image,author)
    const fileUrl = getDataUri(image);
    const cloudResult = await cloudinary.uploader.upload(fileUrl);
    const post = new Post({
      caption,
      author: author,
      image: cloudResult.secure_url,
    });
    await post.save();

    // insert that new post id into user post array;
    const user = await User.findById(author);
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
        path: "Comments",
        sort: {
          createdAt: -1,
        },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    console.log(posts);
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
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "There is no such post.",
        success: false,
      });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({
        message: "You have already liked this post.",
        success: false,
      });
    }

    // Add the user's ID to the list of likes
    post.likes.push(userId);
    await post.save();

    // Implement socket.io for notifications (example)
    // io.emit('notification', {
    //   message: `${req.user.name} liked your post.`,
    //   userId,
    //   postId,
    // });
    const user = await User.findById(userId).select("username profilePicture");
    const ownwerId = post.author.toString();
    if (ownwerId !== userId) {
      const notification = {
        type: "Like",
        userId: userId,
        userDetails: user,
        postId,
        message: "Your post was Liked",
      };
      const postOwerSocketId = getReciverSocketId(ownwerId);
      io.to(postOwerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while liking the post.",
      success: false,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "There is no such post.",
        success: false,
      });
    }

    // Check if the user has already disliked the post (i.e., not in the likes array)
    if (!post.likes.includes(userId)) {
      return res.status(400).json({
        message: "You have not liked this post yet.",
        success: false,
      });
    }

    // Remove the user's ID from the list of likes
    post.likes.pull(userId);
    await post.save();

    // Implement socket.io for notifications (example)
    // io.emit('notification', {
    //   message: `${req.user.name} disliked your post.`,
    //   userId,
    //   postId,
    // });
    const user = await User.findById(userId).select("username profilePicture");
    const ownwerId = post.author.toString();
    if (ownwerId !== userId) {
      const notification = {
        type: "Disike",
        userId: userId,
        userDetails: user,
        postId,
        message: "Your post was DisLiked",
      };
      const postOwerSocketId = getReciverSocketId(ownwerId);
      io.to(postOwerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while disliking the post.",
      success: false,
    });
  }
};

export const addcomment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentUserId = req.id;
    const caption = req.body.text;
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
    await post.Comments.push(comment._id);
    await post.save();
    // console.log(comment)
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
    const postId = req.params.id;
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
    const postId = req.params.id;

    const authorId = req.id;

    const post = await Post.findById(postId);
    const user = await User.findById(authorId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
        success: false,
      });
    }

    if (user.bookmarks.includes(postId)) {
      // Remove the post from bookmarks
      await User.updateOne({ _id: authorId }, { $pull: { bookmarks: postId } });

      return res.status(200).json({
        message: "Post removed from bookmarks.",
        success: true,
        
      });
    } else {
      // Add the post to bookmarks
      await User.updateOne({ _id: authorId }, { $push: { bookmarks: postId } });

      return res.status(200).json({
        message: "Post added to bookmarks.",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating bookmarks.",
      success: false,
    });
  }
};
