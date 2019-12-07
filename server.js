var express = require("express");
var path = require("path");
var fs = require("fs");
var util = require("util");

let writefileAsync = util.promisify(fs.writeFile);
let readFileAsync = util.promisify(fs.readFile);
let db;

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", function (req, res) {
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8").then(function (data) {
        return res.json(JSON.parse(data));
    })
});

app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8").then(function (data) {
        db = JSON.parse(data);
        if (newNote.id || newNote.id === 0) {
            let currNote = db[newNote.id];
            currNote.title = newNote.title;
            currNote.text = newNote.text;
        } else {
            db.push(newNote);
        }
        writefileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(db)).then(function () {
            console.log("You wrote a new note to db.json")
        })
    })
    res.json(newNote)
});

app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id;
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8").then(function (data) {
        db = JSON.parse(data);
        db.splice(id, 1);
        writefileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(db)).then(function () {
            console.log("Selected note was deleted from db.json")
        })
    });
    res.json(id)
})

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT)
})