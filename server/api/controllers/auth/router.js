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
<<<<<<< HEAD
>>>>>>> 353eed7e8e00debfac8ca07d6985e5eb88aa3d7b
=======
                .post("/register", Controller.register)
>>>>>>> 2b062907b35ca265be97d29435110b0ef2a26e12
