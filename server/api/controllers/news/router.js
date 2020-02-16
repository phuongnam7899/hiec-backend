import * as express from "express"
import Controller from "./controller"

export default express.Router()
                        .post("/", Controller.createNewNews)
                        .get("/:id", Controller.getNewsByID)
                        .delete("/:id", Controller.deleteNewsByID)
                        .put("/add-clap", Controller.addClap)
                        .put("/add-view", Controller.addView)
                        .put("/add-comment", Controller.addComment)
                        .put("/add-reply", Controller.addReplyToComment)
                        .get("/search/by-keyword", Controller.searchByKeyword)
                        .post("/search/by-tag", Controller.searchByTag)
                        .post("/search", Controller.search)
                        .post("/recent", Controller.getRecent)
                        .post("/hot", Controller.getHotNews)
