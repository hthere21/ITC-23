const { MongoClient } = require('mongodb');

//verify user in database function
module.exports.verifyUser = async (name, password) => {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db('ITC-data');
    const usersCollection = db.collection('users');
  
    const user = await usersCollection.findOne({ name: name });
    if (!user) {
      throw new Error('User not found');
    }
  
    if (user.password !== password) {
      throw new Error('Password incorrect');
    }
  
    return user;
  }

  
  