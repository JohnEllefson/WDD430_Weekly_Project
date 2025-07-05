const Sequence = require('../models/sequence');

let maxDocumentId;
let maxMessageId;
let maxContactId;
let sequenceId = null;

async function initializeSequence() {
  try {
    const sequence = await Sequence.findOne().exec();

    if (!sequence) {
      throw new Error('No sequence document found');
    }

    sequenceId = sequence._id;
    maxDocumentId = sequence.maxDocumentId;
    maxMessageId = sequence.maxMessageId;
    maxContactId = sequence.maxContactId;
  } catch (err) {
    console.error('Error initializing sequence generator:', err);
  }
}

initializeSequence(); // run on module load

function SequenceGenerator() {}

SequenceGenerator.prototype.nextId = function (collectionType) {
  let updateObject = {};
  let nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = { maxDocumentId };
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = { maxMessageId };
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = { maxContactId };
      nextId = maxContactId;
      break;
    default:
      throw new Error('Unknown collection type: ' + collectionType);
  }

  Sequence.updateOne({ _id: sequenceId }, { $set: updateObject }).exec()
    .catch(err => {
      console.error(`Error updating ${collectionType} sequence:`, err);
    });

  return nextId;
};

module.exports = new SequenceGenerator();
