const express = require("express");
const router = express.Router();
const Note = require("../model/note.model");

router.route("/")
.get(async (req, res) => {
    try {
        const { userId } = req;
        const allNotes = await Note.findById(userId);
        console.log(allNotes);

        if (allNotes === null) {
            return res.json({ success: true, message: "no notes", allNotes: [] });
        }
        
        res.json({ success:true, message: "notes", allNotes });
    } catch(error) {
        console.log(error);
    };
});

router.route("/new")
.post(async (req, res) => {
    try {
        const { userId } = req;
        const { noteTitle, noteBody, isPinned, bgColor } = req.body;

        const userNotes = await Note.findById(userId);
        console.log("userNotes", userNotes);

        if (userNotes === null) {
            const note = new Note({
                _id: userId,
                notes: [{
                    noteTitle,
                    noteBody,
                    isPinned,
                    bgColor
                }]
            });

            await note.save();

            return res.json({
                success: true,
                userNotes
            });
        };

        userNotes.notes.push({
            noteTitle,
            noteBody,
            isPinned,
            bgColor
        });

        await userNotes.save();

        res.json({ success: true, message: "Note added successfully", userNotes });

    } catch(error) {
        console.log(error);
        res.json({ success: false, message: "cannot add note", errorMessage: error.message })
    }
});

router.route("/:noteId")
.get(async (req, res) => {
    try {
        
        const { userId } = req;
        const { noteId } = req.params;
        
        const allNotes = await Note.findById(userId);

        const note = allNotes.notes.find((note) => {
            return String(note._id) === noteId
        });

        res.json({ success: true, note });

    } catch(error) {
        console.log(error);
        return res.json({
            success: false,
            message: "note not found",
            errorMessage: error.message
        })
    }
});

router.route("/edit/:noteId")
.post(async (req, res) => {
    try {
        const { noteId } = req.params;
        const { userId } = req;
        const { noteTitle, noteBody, isPinned, bgColor } = req.body;

        const allNotes = await Note.findById(userId);

        const note = allNotes.notes.find((note) => {
            return String(note._id) === noteId
        });

        note.noteTitle = noteTitle;
        note.noteBody = noteBody;
        note.isPinned = isPinned;
        note.bgColor = bgColor;

        await allNotes.save();

        res.json({
            suceess: true,
            allNotes
        });

    } catch(error) {
        console.log(error);
        res.json({
            success: false,
            message: "error",
            errorMessage: error.message
        });
    }
});

router.route("/delete/:noteId")
.delete(async (req, res) => {
    try {
        
        const { noteId } = req.params;
        const { userId } = req;

        const allNotes = await Note.findById(userId);

        const findIndex = allNotes.notes.findIndex((note) => {
            return String(note._id) === noteId
        });

        console.log(findIndex);
        

        allNotes.notes[findIndex].remove();
        await allNotes.save();

        res.json({
            suceess: true,
            allNotes
        });

    } catch(error) {
        console.log(error);
        res.json({
            success: false,
            message: "cannot delete",
            errorMessage: error.message
        });
    }
});

module.exports = router;