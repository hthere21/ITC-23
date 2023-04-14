const ChatModel = require('./messageModel');
const UserModel = require('../user/userModel');

async function createChat(req, res) {
  const {roomId, sendername, receivername, sender_id, receiver_id, message} = req.body;

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
      });        
      await newChat.save();
    } else {
      chat.message.push(message);
      await chat.save();  
    }

    // add chat history for sender
    const sender = await UserModel.findById(sender_id);
    const receiver = await UserModel.findById(receiver_id);
    if (sender.chatHistory.indexOf(receiver_id) === -1 && chat.message !== null) {
      sender.chatHistory.push(receiver);
      await sender.save();
    }
    
    // add chat history for receiver
    
    if (receiver.chatHistory.indexOf(sender_id) === -1 && chat.message !== null) {
      receiver.chatHistory.push(sender);
      await receiver.save();
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

async function chatHistory(req,res) {

}

module.exports = { createChat, getChat, chatHistory };
