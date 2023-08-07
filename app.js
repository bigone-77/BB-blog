const path = require('path');

const express = require('express');

const blogRoutes = require('./routes/blog');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); 


app.use(blogRoutes);


app.use(function (error, req, res, next) {
    // Default error handling function
    // Will become active whenever any route / middleware crashes
    console.log(error);
});

app.listen(3000);