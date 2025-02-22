const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
// const logger = require("morgan");
const morgan = require('morgan');
const moment = require('moment-timezone');
const logs = require('./src/controller/loggerController.js');
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
require("./src/config/db");
// global.__basedir = __dirname;



const app = express();


// Custom token to log timestamp in IST
morgan.token('istDate', (req, res) => {
  return moment().tz('Asia/Kolkata').format('DD/MMM/YYYY:HH:mm:ss ZZ');
});

// Custom format string with the IST timestamp token
const morganFormat = '":method :url HTTP/:http-version" :status :res[content-length] ":referrer"';


// Middleware to log HTTP requests using morgan
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      logs.info(message.trim());
    }
  }
}));

// ========================= || Cors
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


// const allowedOrigins = [
//   'http://localhost:3000',

// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin, like mobile apps or curl requests
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true // Allow sending cookies or other credentials
// }));


// const corsOptions = { origin: process.env.ALLOW_ORIGIN };
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/src/views"));

// app.use(logger("dev"));
app.use(express.json());
// app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const globalErrorHandler = require("./src/utils/error/error.js");

app.disable('x-powered-by')
app.route('/').get(
  (req, res, next) => {
    res.send('server is running');
  }
)

app.use(express.static(path.join(`${__dirname}`, "src")));
app.use(require("./src/utils/response/responseHandler.js"));
app.use("/api/v1", require("./src/routes/index"));

app.use(globalErrorHandler)

module.exports = app;
