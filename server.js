// require allows a module to be available in the global scope.
const express = require('express');
const path = require('path');

// This creates an object to use the express module in.
const app = express();
// This is the port that is being used.
const port = 3000;

// This sets the view engine to ejs(embedded javascript) which transforms the file into an html.
app.set('view engine', 'ejs');
// This finds the "view" directory inside the main folder. 
app.set('views', path.join(process.cwd(), 'views/pages'));

// This connects the server to all static file (like imgs, videos, and othere) in the views folder.
app.use(express.static(path.join(__dirname, "views")));

// This request a certain path to callback a designated function.
app.get('/', (req, res) => {
    // This renders the index ejs file into an html website.
    res.render('index');
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/services', (req, res) => {
    res.render('services')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/location', (req, res) => {
    res.render('location')
})

// This listens for when the server/port is active.
app.listen(port, () => {
    // This creates a log inside the console to make it easier to run.
    console.log(`Server running at http://localHost:${port}`);
})
