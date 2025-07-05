var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const Contact = require('../models/contact');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Message.find()
      .populate('sender')
      .then(messages => {
          res.status(200).json(messages);
      })
      .catch(err => {
          res.status(500).json({
              error: err.message || 'An error occurred while fetching messages.'
          });
      });
});

router.post('/', async (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId("messages");

  try {
    // Step 1: Get contact by custom ID field (not _id)
    const contact = await Contact.findOne({ id: req.body.sender.id });

    if (!contact) {
      return res.status(400).json({
        message: 'Contact not found for sender',
        senderId: req.body.sender.id
      });
    }

    // Step 2: Create message with the contact's Mongo _id as sender
    const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: contact._id
    });

    const createdMessage = await message.save();

    // repopulate sender before responding
    const populatedMessage = await Message.findById(createdMessage._id).populate('sender');

    res.status(201).json({
      message: 'Message added successfully',
      createdMessage: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error: error.message || error
    });
  }
});

router.put('/:id', (req, res, next) => {
    Message.findOne({ id: req.params.id })
        .then(message => {
            message.subject = req.body.subject;
            message.msgText = req.body.msgText;
            message.sender = req.body.sender;

            Message.updateOne({ id: req.params.id }, message)
                .then(result => {
                    res.status(204).json({
                        message: 'Message updated successfully'
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'An error occurred',
                        error: error
                    });
                });
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error occurred',
                error: error
            });
        });
});

router.delete('/:id', (req, res, next) => {
    Message.deleteOne({ id: req.params.id })
        .then(result => {
            res.status(204).json({
                message: 'Message deleted successfully'
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error occurred',
                error: error
            });
        });
});

module.exports = router;

