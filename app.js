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

db.connect((err)=>{
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    } 
    else{
        app.listen(3000,()=>{
            console.log('connected to database, app listening on port 3000');
        });
    }  
})