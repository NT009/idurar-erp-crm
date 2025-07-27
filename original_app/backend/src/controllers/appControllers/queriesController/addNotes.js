const mongoose = require('mongoose');
const Model = mongoose.model('Queries');

const addNotes = async (req, res) => {
  try {
    // Find the document by ID and ensure it is not removed
    const document = await Model.findOne({
      _id: req.params.id,
      removed: false,
    }).populate('client');

    if (!document) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    }

    const { note } = req.body;

    if (!note || typeof note !== 'string' || note.trim() === '') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Note is required and must be a non-empty string',
      });
    }

    // Append the new note
    document.notes.push({ note });
    document.updated = new Date();

    await document.save();

    return res.status(200).json({
      success: true,
      result: document,
      message: 'Note added successfully',
    });
  } catch (error) {
    console.error('Add Note Error:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Server error while adding note',
    });
  }
};

module.exports = addNotes;
