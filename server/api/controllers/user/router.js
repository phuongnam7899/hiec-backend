import Controller from './controller';
import * as express from 'express';

export default express
                .Router()
                .get("/:id",Controller.getUserByID)
                // .delete("/:email",Controller.deleteUserByID)
                .put("/:id",Controller.updateInfo)
                .put("/:id/password",Controller.changePassword)
                