const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const oas3Tools = require('oas3-tools');
const path = require('path');


const serverPort = 3000;


const spec = path.join(__dirname, 'api', 'openapi.yaml');


const options = {
  routing: {
    controllers: path.join(__dirname, './controllers')
  }
};

const app = express();
app.use(bodyParser.json());


mongoose.connect("mongodb://127.0.0.1:27017/openapi_demo")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));


const expressApp = oas3Tools.expressAppConfig(spec, options).getApp();

expressApp.listen(serverPort, () => {
  console.log(`🚀 Server running at http://localhost:${serverPort}`);
  console.log(`📘 Swagger UI: http://localhost:${serverPort}/docs`);
});
