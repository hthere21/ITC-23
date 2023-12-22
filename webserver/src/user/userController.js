//function to create a new user
var userModel = require('./userModel');
//var chatModel = require('../src/message/messageModel');
var userService = require('./userService');
var userInfo = "";
let isLoggedIn = false;

async function checkName(req,res) {
  try {
    const name = req.query.username;
    console.log(name);
    const users = await userModel.find({name: name});

    if (users.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

const createUserControllerFn = async (req, res) => {
  try {
    const body = req.body;
    const userModelData = new userModel();

      userModelData.email = body.email;
      userModelData.zipcode = body.zipcode;
      userModelData.name = body.name;
      userModelData.password = body.password;
      userModelData.gender = body.gender;
      userModelData.university = body.university;
      userModelData.major = body.major;
      userModelData.bio = body.bio;
      userModelData.age = body.age;
      userModelData.sleep = body.sleep;
      userModelData.guests = body.guests;
      userModelData.smoking = body.smoking;
      userModelData.pets = body.pets;
      userModelData.lgbt = body.lgbt;
      userModelData.couples = body.couples;
      userModelData.budget = body.budget;
      userModelData.move_in_date = body.move_in_date;
      userModelData.min_length = body.min_length;
      userModelData.max_length = body.max_length;
      userModelData.amenities = {
        wifi: body.amenities.wifi,
        kitchen: body.amenities.kitchen,
        parking: body.amenities.parking
      }
      userModelData.size = body.size;
      userModelData.furnished = body.furnished;
      userModelData.occupancy = body.occupancy;
      userModelData.chatHistory = [];

      // Save user document
      userModelData.save()
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const loginUserControllerFn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.verifyUser(email, password);
    userInfo = user;
    isLoggedIn = true;
    let name = userInfo.name
    res.send({ status: true, message: 'Login successful', name });
  } catch (err) {
    console.error(err);
    res.send({ status: false, message: err.message });
  }
};

const logoutUserControllerFn = async (req, res) => {
  try {
    isLoggedIn = false;
    userInfo = "";
    res.send({ status: true, message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.send({ status: false, message: err.message });
  }
};

const getAllUsersControllerFn = async (req, res) => {
  try {
    const loggedInUserId = userInfo._id;
    if (!loggedInUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const users = await userModel.find({ _id: { $ne: loggedInUserId } }); // find all users except the logged-in user
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};


async function searchUser (req, res) {
  const { search } = req.query;
  console.log(req.query.search);
  try {
    const searchTerm = search;
    // Use a regular expression to search for matches in name, major, or university
    const users = await userModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { major: { $regex: searchTerm, $options: 'i' } },
        { university: { $regex: searchTerm, $options: 'i' } },
        { bio: { $regex: searchTerm, $options: 'i' } }
      ]
    });
    console.log(users);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const filterUser = async (req, res) => {
  const {
    zipcode,
    gender,
    age,
    sleep,
    guests,
    smoking,
    pets,
    budget,
    move_in_date,
    amenities,
    size,
  } = req.query;
  console.log(gender)
  console.log(age)
  console.log(pets)
  console.log(zipcode)
  
  try {
    const filters = {};
    if (zipcode !== undefined && zipcode !== '' && zipcode!== 'null') filters.zipcode = zipcode;
    if (gender !== undefined && gender !== '' && gender !== 'null') filters.gender = gender;
    if (age !== undefined && age !== ''&& age !== 'null') filters.age = age;
    if (sleep !== undefined && sleep !== '' && sleep !== 'null') filters.sleep = sleep;
    if (guests !== undefined && guests !== '' && guests !== 'null') filters.guests = guests;
    if (smoking !== undefined && smoking !== '' && smoking !== 'null') filters.smoking = smoking;
    if (pets !== undefined && pets !== '' && pets !== 'null') filters.pets = pets;
    if (budget !== undefined && budget !== '' && budget !== 'null') filters.budget = budget;
    if (move_in_date !== undefined && move_in_date !== ''&& move_in_date !== 'null') filters.move_in_date = move_in_date;
    if (amenities !== undefined &&   amenities.wifi || amenities.kitchen || amenities.parking) {
      filters['amenities.wifi'] = amenities.includes('wifi');
      filters['amenities.kitchen'] = amenities.includes('kitchen');
      filters['amenities.parking'] = amenities.includes('parking');
    }
    if (size !== undefined && size !== '' && size !== 'null') filters.size = size;
    
    console.log(filters);
    const users = await userModel.find({ _id: { $ne: userInfo._id }, ...filters });
    console.log(users);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = userInfo;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

const updateUserControllerFn = async (req, res) => {
  try {
    const userId = userInfo._id; // retrieve the user id from the request params
    const updateData = {};

    // Retrieve the properties to update from the request body
    ["name","zipcode","gender", "university", "major", "picture", "bio", "age", "sleep", "guests", "smoking", "pets", "lgbt", "couples", "budget", "move_in_date", "min_length", "max_length", "amenities", "size", "furnished", "occupancy"].forEach(key => {
      if (req.body[key]) {
        updateData[key] = req.body[key];
      }
    });

    // use the `findByIdAndUpdate` method of the userModel to update the user data
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) { // if the user is not found, return a 404 error
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // if the update is successful, return a 200 HTTP status code along with the updated user data
    res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// const isLogIn = async (req, res) => {
//   try {
//     res.send(isLoggedIn);
//   } catch (err) {
//     res.send(false);
//   }
// };

const saveUserControllerFn = async (req, res) => {
  try {
    const userId = req.body.userId;
    const loggedInUserId = userInfo._id;

    // Retrieve the user to be saved
    const userToSave = await userModel.findById(userId);

    // Check if the user is null or if the logged-in user has already saved the user
    if (!userToSave || userInfo.savedList.includes(loggedInUserId)) {
      return res.status(400).json({ success: false, message: 'Unable to save user' });
    }

    // Update the saved list of the user to be saved to include the ID of the logged-in user
    await userModel.findByIdAndUpdate(userId, { $addToSet: { savedList: loggedInUserId } });

    // Update the saved list of the logged-in user to include the ID of the user to be saved
    const updatedUser = await userModel.findByIdAndUpdate(loggedInUserId, { $addToSet: { savedList: userId } }, { new: true });

    // Return a success response
    res.status(200).json({ success: true, message: 'User saved successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getSavedUsers = async (req, res) => {
  try {
    const userId = userInfo._id;
    console.log(userId);
    // Retrieve the user's savedList
    const savedList = (await userModel.findById(userId)).savedList;

    // Retrieve the full user objects for each user in the savedList
    const savedUsers = await Promise.all(savedList.map((id) => userModel.findById(id)));

    // Return the saved users in the response
    res.status(200).json({ success: true, savedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const removeSavedUsers = async (req, res) => {
  try {
    const { savedUserId } = req.body;
    console.log(savedUserId);
    const user = await userModel.findById(userInfo._id); // find the logged-in user by id

  
    const savedUserIndex = user.savedList.findIndex((id) => id.toString() === savedUserId);// find the index of the saved user in the logged-in user's savedList array
    console.log(savedUserIndex);
    if (savedUserIndex === -1) {
      return res.status(404).json({ success: false, message: 'Saved user not found' });
    }
  
    user.savedList.splice(savedUserIndex, 1); // remove the saved user from the logged-in user's savedList array
    await user.save(); // save the updated user object to the database
  
    res.status(200).json({ success: true, message: 'Saved user removed successfully' });
  } 
   catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

async function getAllChatHistory(req, res) {
  try {
    const userId = userInfo._id;
    const user = (await userModel.findById(userId)).chatHistory;
    const savedUsers = await Promise.all(user.map((id) => userModel.findById(id)));

    res.send(savedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

async function getFirstUserId(req,res) {
  const userId = userInfo._id;
  const userChatHistory = (await userModel.findById(userId)).chatHistory;
  if (userChatHistory && userChatHistory.length > 0) {
    const userId = userChatHistory[0];
    const user = await userModel.findById(userId);
    res.send(user)
  } else {
    return null;
  }
}

module.exports = { checkName, createUserControllerFn ,updateUserControllerFn ,loginUserControllerFn, getAllUsersControllerFn, searchUser, getUser, saveUserControllerFn, getSavedUsers, logoutUserControllerFn, removeSavedUsers, getAllChatHistory, filterUser, getFirstUserId}


