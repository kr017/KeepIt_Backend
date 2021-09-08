var express = require("express");
var router = express.Router();
const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");
const NoteController = require("../controller/note");

router.all("/api/*", userAuthenticated, userExists);
router.post("/api/addNotes", NoteController.addNote);
router.post("/api/notes", NoteController.getUserNotes);
router.post("/api/user_note", NoteController.getUserNote);
router.put("/api/updateNote", NoteController.updateNote);
router.post("/api/archieveNote", NoteController.archiveNote);
router.post("/api/unArchieveNote", NoteController.unArchiveNote);
router.post("/api/deleteNote", NoteController.deleteNote);
router.post("/api/deletePermanentNote", NoteController.deletePermanentNote);
router.get("/api/trashNotes", NoteController.getTrashNotes);
router.post("/api/restoreNote", NoteController.restoreNote);

module.exports = router;
