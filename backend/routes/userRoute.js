import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {editprofile, followOrUnfollow, getMyProfile, login, logout, otherUsers, register} from "../controllers/usercontoller.js";
import upload from "../middlewares/multer.js"
const router=express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/logout",logout);
router.get("/getProfile/:id",isAuthenticated,getMyProfile)
router.put("/editprofile",isAuthenticated,upload.single('profilephoto'),editprofile)
router.get("/otherusers",isAuthenticated,otherUsers);
router.post("/followOrUnfollow/:id",isAuthenticated,followOrUnfollow)
export default router