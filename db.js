// Setting up database configuration
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Setting up database name
const dbname = "crud_mongodb";

// Default location where mongodb would be located on local machine
const url = "mongodb://localhost:27017";
const mongoOptions = {useNewUrlParser : true};

// Using db.js file to create connection between node.js and mongo server
const state = {
    db : null
};

// Setting up connection
const connect = (cb) =>{
    if(state.db)
        cb();
    else{
        MongoClient.connect(url,mongoOptions,(err,client)=>{
            if(err)
                cb(err);
            else{
                state.db = client.db(dbname);
                cb();
            }
        })
    }
}

// Returns primary key to query db
const getPrimaryKey = (_id)=>{
    return ObjectID(_id);
}

const getDB = ()=>{
    return state.db;
}

module.exports = {getDB,connect,getPrimaryKey};