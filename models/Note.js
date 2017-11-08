var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new NoteSchema object
var NoteSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }

});

// Create a model form the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
