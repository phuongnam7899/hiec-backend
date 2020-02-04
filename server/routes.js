const bodyParser = require("../node_modules/body-parser");
const morgan = require('../node_modules/morgan');
const jwt = require('../node_modules/jsonwebtoken');
import authRouter from "./api/controllers/auth/router"

export default function routes(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use("/api/auth", authRouter)
}
