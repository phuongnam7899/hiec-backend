import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
const morgan = require('../node_modules/morgan');

import authRouter from "./api/controllers/auth/router"


import cookieParser from 'cookie-parser';
const mongoose = require("mongoose");
//npm i cors nhé
const cors = require('cors');

const app = new Express();


const root = path.normalize(`${__dirname}/../..`);
mongoose.connect('mongodb+srv://phuongnam7899:phuongnam7899@xtutor-tdorw.mongodb.net/test?retryWrites=true',
  {
    reconnectTries: 100,
    reconnectInterval: 500,
    autoReconnect: true,
    useNewUrlParser: true,
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
app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
//nhớ thêm dòng này để link vs frontend
app.use(cors({
  origin: ["http://localhost:3000","https://xtutor.herokuapp.com"],
  credentials: true
}));
app.use(cookieParser(process.env.SESSION_SECRET));
// app.use(Express.static(`${root}/public`));
app.
//api


app.use(morgan('dev'));
app.use("/api/auth", authRouter);



app.listen(process.env.PORT,(err) => {
  if (err) console.log(err);
  else console.log("server started");
})