// Requiring npm packages
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');

// Creating instance of express application
const app = express();

// Telling express application to use body parser module
app.use(bodyParser.json());

// Setting up database
const db = require("./db");
const collection = "todo";
