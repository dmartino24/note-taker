const fs = require("fs");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

let { notes } = require("./db/db.json");

const express = require("express");
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// links file resources to localhost
app.use(express.static("public"));

// HTTP GET Requests
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
// Routes the HTTP POST requests to the specified path
app.post("/api/notes", (req, res) => {
  if (typeof notes === "undefined") {
    notes = [];
  }
  // adds unique id
  req.body.id = uuidv4();
  const note = createNewNote(req.body, notes);
  res.json(note);
});

function createNewNote(body, noteArray) {
  const note = body;
  noteArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: noteArray }, null, 2)
  );
  console.log(__dirname);
  return note;
}
// deletes note using its id to identify it
app.delete("/api/notes/:id", (req, res) => {
  const index = notes.findIndex((note) => note.id === req.body.id);
  notes.splice(index, 1);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notes, null, 2)
  );
  res.json(true);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
