var express = require("express");
var router = express.Router();
const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");
const NoteController = require("../controller/note");

router.all("/api/*", userAuthenticated, userExists);
router.post("/api/addNotes", NoteController.addNote);
router.get("/api/notes", NoteController.getUserNotes);
router.post("/api/user_note", NoteController.getUserNote);
router.put("/api/updateNote", NoteController.updateNote);
router.post("/api/deleteNote", NoteController.deleteNote);

module.exports = router;
