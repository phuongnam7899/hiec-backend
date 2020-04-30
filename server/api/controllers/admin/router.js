import Controller from './controller';
import * as express from 'express';

export default express
                .Router()
                .delete("/post/:postID/:userID/:token",Controller.deletePost)
                