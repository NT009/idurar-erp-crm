const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Corrected initialization: Use GoogleGenerativeAI as a constructor
const ai = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

const notesSummary = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Model.findOne({
      _id: id,
      removed: false,
    }).populate('createdBy', 'name');

    if (!data) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    }
    if (!data?.isGenNotesSummaryAvail) {
      return res.status(200).json({
        success: true,
        result: {
          summary: data?.itemsNotesSummary,
        },
        message: 'Invoice notes summary already exists',
      });
    }
    if (!data?.items?.length) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No invoice items found',
      });
    }

    const notesArray = data.items.map((item) => item?.notes?.trim()).filter((note) => !!note);

    if (!notesArray.length) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No notes found in any invoice items.',
      });
    }

    const notesSummaryPrompt = notesArray.join(', ');
    const systemPostFixPrompt =
      'The above text consists of notes associated with individual invoice items. These notes may include special instructions, client preferences, product/service remarks, or conditions relevant to the invoice. Write a professional summary that captures the key points from these notes in the context of an invoice, suitable for including in an invoice summary section.the summary should be in Paragraph';

    const prompt = notesSummaryPrompt + ' ' + systemPostFixPrompt;
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = result.response;

    const summary = response?.text();
    data.itemsNotesSummary = summary;
    data.isGenNotesSummaryAvail = false;
    await data.save();

    return res.status(200).json({
      success: true,
      result: { summary },
      message: 'Invoice summary generated and saved successfully.',
    });
  } catch (error) {
    console.error('Error in notesSummary:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

module.exports = notesSummary;
