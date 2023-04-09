const ChatModel = require('./messageModel');
async function createChat(req, res) {
    const { userId, partnerId, message } = req.body;
  
    try {
      let chat = await ChatModel.findOne({
        $or: [
          { sender: userId, receiver: partnerId },
          { sender: partnerId, receiver: userId }
        ]
      });
  
      // If no chat exists, create a new one and save it to the collection
      if (!chat) {
        const newChat = new ChatModel({
          sender: userId,
          receiver: partnerId,
          message: message
        });
        await newChat.save();
        console.log(`New chat created between ${userId} and ${partnerId}`);
      } else {
        // If chat already exists, update the message and save the changes
        chat.message = message;
        await chat.save();
        console.log(`Existing chat updated between ${userId} and ${partnerId}`);
      }
  
      res.status(200).json({ message: 'Chat created/updated successfully' });
    } catch (err) {
      console.log('Error creating/updating chat:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getChat(req, res) {
    try {
      const chats = await ChatModel.find();
      res.status(200).json(chats);
    } catch (err) {
      console.log('Error getting chats:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  
  
module.exports = { createChat, getChat  };
