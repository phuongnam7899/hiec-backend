import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import cookieParser from 'cookie-parser';
const serverless = require("serverless-http")
const mongoose = require("mongoose");

import swaggerify from './swagger';

import l from './logger';

//npm i cors nhé
const cors = require('cors');

const app =  new Express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    mongoose.connect('mongodb+srv://phuongnam7899:phuongnam7899@xtutor-tdorw.mongodb.net/test?retryWrites=true',
      {
        reconnectTries: 100,
        reconnectInterval: 500,
        autoReconnect: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'hiec-web'
      }
    )
      .then(
        () => {
          console.log('connected');
        }
      )
      .catch(
        (err) => {
          console.log(err);
        }
      );
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '50mb' }));
    //nhớ thêm dòng này để link vs frontend
    app.use(cors({
      origin: ["http://localhost:3000","https://hiec.netlify.com","http://hiec.vn","'https://www.hiec.vn","http://www.hiec.vn"],
      credentials: true
    }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));
  }

  router(routes) {

    swaggerify(app, routes);

    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = p => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${p}}`);
    http.createServer(app).listen(port, welcome(port));
    return serverless(app);
  }
}
