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

  getUserNotes: async (req, res) => {
    try {
      let sort = {};
      if (req.body.order) {
        sort[req.body.field] = parseInt(req.body.order); //order=1  =>ASC
        // sort["title"]=1 //sorting by title in ASC order
      } else {
        sort.created_at = -1;
      }
      let search = { user_id: req.user._id };

      search.isActive = 1;
      if (req.body.isArchieved || req.body.isArchieved === false) {
        search.isArchieved = req.body.isArchieved;
      }

      if (req.body.search) {
        search = {
          ...search,
          $or: [
            { color: { $regex: req.body.search, $options: "i" } },
            { title: { $regex: req.body.search, $options: "i" } },
            { description: { $regex: req.body.search, $options: "i" } },
          ],
        };
      }

      if (req.body.pin || req.body.pin === false) {
        search.isPinned = req.body.pin;
      }

      // let totalRecords = await Note.count();
      let notes = await Note.find(search)
        .collation({ locale: "en_US", strength: 1 }) //letter casing
        .sort(sort);

      // console.log(totalRecords);
      res.json({
        status: "success",
        message: "User notes",
        data: notes,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get notes",
      });
    }
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

  archiveNote: async (req, res) => {
    try {
      if (!req.body.note_id) {
        throw { message: "Note id is required." };
      }

      let archiveNote = await Note.findByIdAndUpdate(req.body.note_id, {
        isArchieved: 1,
      });
      res.json({
        status: "success",
        message: "Note archieved successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "Note update failed",
      });
    }
  },
  unArchiveNote: async (req, res) => {
    try {
      if (!req.body.note_id) {
        throw { message: "Note id is required." };
      }

      let archiveNote = await Note.findByIdAndUpdate(req.body.note_id, {
        isArchieved: 0,
      });
      res.json({
        status: "success",
        message: "Note unarchieved successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "Note update failed",
      });
    }
  },

  deleteNote: async (req, res) => {
    try {
      if (!req.body.note_id) {
        throw { message: "Note id is required." };
      }

      let deleteNote = await Note.findByIdAndUpdate(req.body.note_id, {
        isActive: 0,
      });
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

  deletePermanentNote: async (req, res) => {
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

  getTrashNotes: async (req, res) => {
    try {
      let notes = await Note.find({ isActive: 0 });

      res.json({
        status: "success",
        message: "deleted notes",
        data: notes,
      });
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "Note update failed",
      });
    }
  },

  restoreNote: async (req, res) => {
    try {
      let notes = await Note.findByIdAndUpdate(
        req.body.note_id,
        { isActive: 1 },
        {
          new: true,
        }
      );

      res.json({
        status: "success",
        message: "deleted notes",
        data: notes,
      });
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "Note update failed",
      });
    }
  },
};
