const bodyParser = require("../node_modules/body-parser");
const morgan = require('../node_modules/morgan');
const jwt = require('../node_modules/jsonwebtoken');
import authRouter from "./api/controllers/auth/router";
import tokenModel from "./api/models/token"

export default function routes(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use("/api/auth", authRouter)
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
}
