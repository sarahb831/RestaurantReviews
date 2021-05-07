// here we are connecting to DB and starting web server

import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();  // load in variables to configure dotenv
const MongoClient = mongodb.MongoClient; // get access to MongoClient from mongodb
const port = process.env.PORT || 8000; // create/set port number from environment variable
                                        // or set to 8000 if dotenv can't be accessed
MongoClient.connect(                    // connect to DB and pass in DB URI and
    process.env.RESTREVIEWS_DB_URI,     // options for accessing DB
    {
        poolSize: 50,                   // limiting so only 50 people can connect at a time (pool size)
        wtimeout: 2500,                 // request will time out after 2500 ms
        useNewUrlParse: true }          // flag for new connection string parser in mongodb
    )  
    .catch(err => {                        // catch any errors, logging the error
        console.error(err.stack)
        process.exit(1)                    // exit the process
    })
    .then(async client => {                // create ftn to start web server (app.listen())
        app.listen(port, () => {           // listening on port and log that activity
            console.log(`listening on port ${port}`)
        })
    });