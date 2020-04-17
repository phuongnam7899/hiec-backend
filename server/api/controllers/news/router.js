import * as express from "express"
import Controller from "./controller"

export default express.Router()
                        .post("/", Controller.createNewNews)
                        .get("/:id", Controller.getNewsByID)
                        .delete("/:id/:userID/:token", Controller.deleteNewsByID)
                        .put("/add-view", Controller.addView)
                        .get("/search/by-keyword", Controller.searchByKeyword)
                        .post("/search/by-tag", Controller.searchByTag)
                        .post("/search", Controller.search)
                        .post("/recent", Controller.getRecent)
                        .post("/hot", Controller.getHotNews)
                        .put("/ghim",Controller.ghimNews)
                        .get("/ghim/:category",Controller.getGhimNews)
