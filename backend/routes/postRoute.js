import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { addcomment, addNewPost, allPost, bookmarked, deletePost, dislikePost, getCommentOfPost, getUserPost, likePost } from "../controllers/postController.js";
import upload from "../middlewares/multer.js"
const router=express.Router();
router.post("/addnewpost",isAuthenticated,upload.single("image"),addNewPost)
router.get("/getallpost",isAuthenticated,allPost);
router.get("/getUserPost",isAuthenticated,getUserPost);
router.put("/like/:id",isAuthenticated,likePost);
router.put("/dislike/:id",isAuthenticated,dislikePost);
router.post("/addcomment/:id",isAuthenticated,addcomment);
router.get("/getCommentOfPost/:id",isAuthenticated,getCommentOfPost);
router.delete("/deletePost/:id",isAuthenticated,deletePost);
router.post("/bookmarked/:id",isAuthenticated,bookmarked)
export default router