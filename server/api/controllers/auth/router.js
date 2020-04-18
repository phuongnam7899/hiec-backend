import Controller from './controller';
import * as express from 'express';

export default express
                .Router()
                .post("/sign-in", Controller.signIn)
                .delete("/sign-out", Controller.signOut)
                .post("/register", Controller.register)
