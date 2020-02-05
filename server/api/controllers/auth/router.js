import Controller from './controller';
import * as express from 'express';

export default express
                .Router()
                .get("/", Controller.getOne)