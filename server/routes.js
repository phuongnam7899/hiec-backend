const bodyParser = require("../node_modules/body-parser");
const morgan = require('../node_modules/morgan');
import * as express from 'express';
const jwt = require('../node_modules/jsonwebtoken');
import authRouter from "./api/controllers/auth/router";
import tokenModel from "./api/models/token";
import userRouter from "./api/controllers/user/router";
import postRouter from "./api/controllers/post/router";
import newsRouter from "./api/controllers/news/router";
import adminRouter from "./api/controllers/admin/router"
import commonRouter from "./api/controllers/common/router" 
export default function routes(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use("/api/common",commonRouter)
  app.use("/api/auth", authRouter);
  app.use("/api/news",newsRouter);
  app.use(function (req, res, next) {
    const token = req.body.token || req.query.token || req.get('X-Auth-Token');
    if (token) {
      tokenModel.findOne({token: token}).then((tokenFound) =>{
        if(!tokenFound){
          res.json({ success: false, message: 'Token exprired' });
        }else{
          jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
              res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
              req.decoded = decoded;
              next();
            }
          });
        }
      })
    } else {
      res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });
  app.use("/api/post",postRouter);
  app.use("/api/user",userRouter);
  app.use("/api/admin",adminRouter)
  // app.use("", express.Router().get("/loaderio-2e3f26955ceebd87d89876f3d7468762", (req,res) => {
  //   res.send("check")
  // }))
}
