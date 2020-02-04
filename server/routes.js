const bodyParser = require("../node_modules/body-parser");
const morgan = require('../node_modules/morgan');
const jwt = require('../node_modules/jsonwebtoken');

export default function routes(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev'));
}
