const Note = require("../models/note");
const moment = require("moment");
module.exports = {
  addNote: (req, res) => {
    if (!req.body.description) {
      return res.status(400).json({
        msg: "Descrption is required",
      });
    }

    req.body.user_id = req.user._id;
    const note = new Note(req.body);
    note.save((err, data) => {
      if (err) {
        return res.status(400).json({
          msg: "registration failed",
        });
      }
      res.json({
        status: "success",
        msg: "user registered!!!",
        data: data,
      });
    });
  },

  getUserNotes: (req, res) => {
    Note.find({ user_id: req.user._id }).then(function (users) {
      res.send(users);
    });
  },

  /**
   * get particular note details.
   * @param {note_id} req
   */
  getUserNote: async (req, res) => {
    try {
      if (!req.body.note_id) {
        throw { message: "Note id is required." };
      }
      let userNote = await Note.findById(req.body.note_id);

      res.json({
        status: "success",
        message: "User Note",
        data: userNote,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to find note",
      });
    }
  },

  updateNote: async (req, res) => {
    try {
      if (!req.body._id) {
        throw { message: "Note id is required." };
      }

      let userNote = await Note.findById(req.body._id);
      console.log(req.body);
      let updatedNote = await Note.findByIdAndUpdate(
        req.body._id,
        {
          title: req.body.title ? req.body.title : userNote.title,
          description: req.body.description
            ? req.body.description
            : userNote.description,
          color: req.body.color ? req.body.color : userNote.color,
          isPinned: req.body.isPinned ? true : false,
          tag: req.body.tag ? req.body.tag : userNote.tag,
          last_modified: moment().unix() * 1000,
        },
        { new: true }
      );
      console.log(updatedNote);
      res.json({
        status: "success",
        message: "Note updated successfully",
        data: updatedNote,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Note update failed",
      });
    }
  },

  deleteNote: async (req, res) => {
    try {
      if (!req.body.note_id) {
        throw { message: "Note id is required." };
      }

      let deleteNote = await Note.findByIdAndDelete(req.body.note_id);
      res.json({
        status: "success",
        message: "Note deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "Note update failed",
      });
    }
  },
};
