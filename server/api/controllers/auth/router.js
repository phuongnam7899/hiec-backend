<<<<<<< HEAD
import Controller from "./controller"
import * as express from "express";

export default express.Router()
                        .get("/",Controller.getOne)
=======
import Controller from './controller';
import * as express from 'express';

export default express
                .Router()
                .post("/sign-in", Controller.signIn)
                .get("/sign-out", Controller.signOut)
>>>>>>> 353eed7e8e00debfac8ca07d6985e5eb88aa3d7b
