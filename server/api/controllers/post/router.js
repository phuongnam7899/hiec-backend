import * as express from "express"
import Controller from "./controller"
 
export default express.Router()
                        .post("/", Controller.createNewPost)
                        .get("/:id", Controller.getPostByID)
                        .post("/recent", Controller.getRecent)
                        .delete("/:id", Controller.deletePostByID)
                        .post("/by-user", Controller.getPostsByUser)
                        .put("/add-clap", Controller.addClap)
                        .put("/add-view", Controller.addView)
                        .put("/add-comment", Controller.addComment)
                        .put("/add-reply", Controller.addReplyToComment)
                        .get("/search/by-keyword", Controller.searchByKeyword)
                        .post("/search/by-tag", Controller.searchByTag)
                        .post("/search", Controller.search)
                        .post("/hot", Controller.getHotPost)
