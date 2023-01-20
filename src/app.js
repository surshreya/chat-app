//Importing core modules
const path = require("path");

//Importing external dependencies
const express = require("express");

const app = express();

const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

module.exports = app;
