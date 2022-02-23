const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    notes: [{        
        noteTitle: {
            type: String,
        },

        noteBody: {
            type: String,
            required: "Please enter note body"
        },

        isPinned: {
            type: Boolean,
            required: "Please enter isPinned status"
        },

        bgColor: {
            type: String,
            required: "Please enter background color"
        },
    }]   
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;