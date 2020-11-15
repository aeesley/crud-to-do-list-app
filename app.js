// Requiring npm packages
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const joi = require('joi');

// Creating instance of express application
const app = express();

// Telling express application to use body parser module
app.use(bodyParser.json());

// Setting up database
const db = require("./db");
const { nextTick } = require('process');
const collection = "todo";

// SCHEMA
const schema = Joi.object().keys({
    todo : Joi.string().require()
});

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

// Route to post user inputs
app.post('/',(req,res,next)=>{
    const userInput = req.body;

    // Validating user input sent from body
    Joi.validate(userInput,schema,(err,result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }
        else{
            db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
                if(err){
                    const error = new Error("Failed to insert Todo Document");
                    error.status = 400;
                    next(error);
                }else   
                    res.json({result : result, document : result.ops[0], msg : "Successfully inserted Todo!",error : null});
            });
        }
    })

});

// Route to delete to do list items
app.delete('/:id',(req,res)=>{
    const todoID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(todoID)},(err,results)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
    });
});

// Custom error handler
app.use((err,req,res,next)=>{
    res.status(err.status).json({
        error : {
            message : err.message
        }
    })
})

// Dabatase connection
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