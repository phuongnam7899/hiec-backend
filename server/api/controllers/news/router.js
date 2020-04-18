import * as express from "express"
import Controller from "./controller"

export default express.Router()
    .get("/:id", Controller.getNewsByID)
    .get("/search/by-keyword", Controller.searchByKeyword)
    .get("/ghim/:category", Controller.getGhimNews)
    .post("/", Controller.createNewNews)
    .post("/search/by-tag", Controller.searchByTag)
    .post("/search", Controller.search)
    .post("/recent", Controller.getRecent)
    .post("/hot", Controller.getHotNews)
    .put("/add-view", Controller.addView)
    .put("/ghim", Controller.ghimNews)
    .delete("/:id/:userID/:token", Controller.deleteNewsByID)
