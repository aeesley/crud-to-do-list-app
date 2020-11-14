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

// ROUTES
// Route to show index.html file at /
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get all todos from collection and display them in an array on the page /getTodos
app.get('/getTodos',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
            else{
                console.log(documents);
                res.json(documents);
            }
    });
})

// Route to work with the primary key id
app.put('/:id',(req,res)=>{
    // defining the todoID variable from params
    const todoID = req.params.id;
    // defining the user input variable from body
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(todoID)},{$set : userInput.todo},{returnOriginal : false},(err,result)=>{
        if(err)
            console.log(err);
        else    
            res.json(result);
    });

});

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