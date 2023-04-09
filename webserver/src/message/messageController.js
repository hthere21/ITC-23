const ChatModel = require('./messageModel');

async function createChat(req, res) {
  const {roomId, userId, partnerId, message} = req.body;
  console.log(req.body);

  try {
    let chat = await ChatModel.findOne({
      $or: [
        { roomId: roomId }
      ]
    });

    // If no chat exists, create a new one and save it to the collection
    if (!chat) {
      const newChat = new ChatModel({
        roomId: roomId,
        message: message
      });        
      await newChat.save();
      console.log(`New chat created between ${userId} and ${partnerId}`);
    } else {
      chat.message.push(message);
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
    const { roomId } = req.query; // assuming roomId is passed in the request body
    const chats = await ChatModel.find({ roomId: roomId });
    res.status(200).json(chats);
  } catch (err) {
    console.log('Error getting chats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { createChat, getChat };
