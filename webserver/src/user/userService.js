const { MongoClient } = require('mongodb');

//verify user in database function
module.exports.verifyUser = async (email, password) => {
  const client = await MongoClient.connect('mongodb+srv://hai215:12345@cluster0.rplyggb.mongodb.net/ITC-data?retryWrites=true&w=majority');
  const db = client.db('ITC-data');
  const usersCollection = db.collection('users');
  
  
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      throw new Error('Email not found');
    }
  
    if (user.password !== password) {
      throw new Error('Password incorrect');
    }
  
    return user;
  }

  
  