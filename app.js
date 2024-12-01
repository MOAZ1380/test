const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()    // to use env(protected)
const cors = require('cors');      //  for fronted because port is different
// const path = require('path');

const taskRouter = require('./route/task_route')

// const http_status = require('./utils/http_status');




const app = express();
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));      // photo // http://localhost:6000/uploads/name.png 
// Image extension needs editing


const url = "mongodb+srv://moaz:12345678900@learn-mongo-db.jtmfs.mongodb.net/my_db?retryWrites=true&w=majority&appName=learn-mongo-db";
mongoose.connect(url)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

app.use(express.json())
app.use(cors());    

app.use("/api/task", taskRouter);

app.all('*', (req, res, next) => {       // if The page is not found in route.
    res.json({status : "Error", message : 'this resource is not available'});
});

// global error handler 
app.use((err, req, res, next) => {
    const statusCode = err.status_code || 500;
    const statusText = err.status_text || "Internal Server error"; 
    const message = err.message || "An unexpected error occurred.";

    res.status(statusCode).json({
        status: statusText,
        message: message
    });
});

app.listen(2000, () => {
    console.log(`listening on port ${process.env.PORT}`);
});

 //


//not found
// app.use(error.notfound);
// error handler
// app.use(error.errorhandler);
// db();
// module.exports = app;
