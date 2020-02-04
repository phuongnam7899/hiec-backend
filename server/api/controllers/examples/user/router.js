import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post("/sign-up",controller.create);