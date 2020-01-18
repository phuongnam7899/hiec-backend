import authRouter from './api/controllers/auth/router';
import classRouter from './api/controllers/class/router';
const bodyParser = require("../node_modules/body-parser");
import userRouter from './api/controllers/user/router';
import DisabledTokenModel from './api/models/disabled_token';
const morgan = require('../node_modules/morgan');
const jwt = require('../node_modules/jsonwebtoken');

export default function routes(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev'));
}
