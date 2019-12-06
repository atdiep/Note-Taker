var fs = require("fs");
var db = require("../db.json")

module.exports = function (app) {
  app.get("/api/notes", function (req, res) {
    // fs.readFileSync("../db.json", "utf8")
    res.json(db)
  });

  app.post("/api/notes", function (req, res) {
    
  });

  app.delete("/api/notes/:id", function (req, res) {

  })
}