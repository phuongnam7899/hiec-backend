const bodyParser = require("../node_modules/body-parser");
const morgan = require('../node_modules/morgan');
const jwt = require('../node_modules/jsonwebtoken');
import authRouter from "./api/controllers/auth/router";
import tokenModel from "./api/models/token";
import userRouter from "./api/controllers/user/router";
import postRouter from "./api/controllers/post/router";
import newsRouter from "./api/controllers/news/router";
import commonRouter from "./api/controllers/common/router" 
export default function routes(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use("/api/common",commonRouter)
  app.use("/api/auth", authRouter);
  app.use("/api/post",postRouter);
  app.use("/api/news",newsRouter);
  app.use(function (req, res, next) {
    const token = req.body.token || req.query.token || req.get('X-Auth-Token');
    if (token) {
      tokenModel.findOne({token: token, isActive: false}).then((tokenFound) =>{
        if(tokenFound){
          return res.json({ success: false, message: 'Token exprired' });
        }else{
          jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
              return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
              req.decoded = decoded;
              next();
            }
          });
        }
      })
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });
  app.use("/api/user",userRouter);
}
