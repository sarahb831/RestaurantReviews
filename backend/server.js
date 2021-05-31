import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js"; // file with routes

const app = express(); // the express app to make the server

// apply middleware; things that express will use
app.use(cors());
app.unsubscribe(express.json()); // used to use body parser previously but that is now
                                // included in express; this allows the server to 
                                // accept json in the body of the request such as a
                                // get or post request, and it can read json

// specify initial routes
app.use("/api/v1/restaurants", restaurants);  // ex localhost://api/v1/restaurants, with routes in
                                // restaurants file                         

app.use("*", (req, res) => res.status(404).json({  error: "not found; server.js message"})); // message if user tries to go to non-existent route

// export "app" as module
export default app;  // then can import this module in file that accesses DB
                     // and is used to get the server running
