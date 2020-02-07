const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require("util");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 9090;
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(compression());

//api routes
app.get('/api/notes', function (req, res) {
    console.log('API GET ROUTE');
    readFileAsync('./db/db.json', 'utf8', function (err, jsonString) {
      if (err) {
          console.log(err);
      };
      console.log(jsonString);
      res.json(JSON.parse(jsonString));
    });
});

app.post('/api/notes', function ({ body }, res) {
    const dbData = fs.readFileSync('./db/db.json');
    const parseData = JSON.parse(dbData);
    const newObj = parseData.concat(body);
    const string = JSON.stringify(newObj);
    fs.writeFile('./db/db.json', string, function (err) {
        if (err) console.log(err);
        res.json(string);
    });
});

app.delete('/api/notes/:title', function (req, res) {
    console.log("delete console log: " + req.params.title);
    const dbData = fs.readFileSync('./db/db.json');
    const parseData = JSON.parse(dbData);
    const title = req.params.title;
    const newData = parseData.filter(o => o.title !== title);
    const string = JSON.stringify(newData);
    fs.writeFile('./db/db.json', string, function (err) {
        if (err) console.log(err);
        res.json(string);
    });
})

//html routes
app.get('/notes', function (req, res) {
    console.log("notes HTML route working");
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', function (req, res) {
    console.log("index HTML route working");
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});