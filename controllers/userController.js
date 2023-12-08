import  jwt  from "jsonwebtoken";
import db from '../models/index.js'
import fs from "fs";
import { generateToken } from "../utils/jwt.js";
const {UserModel,WalletModel} = db

const register = async (request, response) => {
  let { userName, email, password, role} = request.body;

  try {
    const verifyEmail = await UserModel.findOne({ where: { email } });

    if (verifyEmail) {
      return response.status(403).json({
        message: "Email already used"
      });
    }

    // Check if the userName is already in use
    const existingUserName = await UserModel.findOne({ where: { userName } });
      if (existingUserName) {
        return response.status(403).json({
          message: "Username already used",
        });
    }

    email = email.toLowerCase()
    const newUser = await UserModel.create({
      userName,
      email,
      password,
      role
    });

    const newWallet = await WalletModel.create({
      UserId: newUser.id, 
    });

    return response.status(201).json({
      message: 'User successfully created!',
      user: newUser,
      wallet : newWallet,
      success: true
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message
    });
  }
}


const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    // Find the user by email
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      return response.status(401).json({ message: "Email not found" });
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const jwtToken = generateToken(user)

    response.cookie('accessToken', jwtToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // Set to true in production (requires HTTPS)
    });

    return response.status(200).json({
      message:'user log in'
    });
  } catch (err) {
    return response.status(401).json({ message: err.message, success: false });
  }
};


const getUsers = async (request, response) => {
  try {
    const { page = 1, limit = 10 } = request.query;
    const offset = (page - 1) * limit;
    // Fetching all users from the database
    const users = await UserModel.findAll({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    return response.status(200).json({
      data: users,
      success: true,
      message: "Users list"
    });
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: error.message
    });
  }
};


const getUser = async (request, response) => {
  const { id } = request.params

  try {
    // Fetching all users from the database
    const user = await UserModel.findOne({ where: { id } });

    if (!user) {
      return response.status(401).json({ message: "user not found" });
    }

    return response.status(200).json({
      data: user,
      success: true,
      message: "User found"
    });
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const updateProfile = async (request, response) => {
  try {
    const id = request.params.id; 

    const user = await UserModel.findByPk(id);

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    user.userName = request.body.userName;

    let imagePath = null; 

    if (request.file) {
      imagePath = request.file.path; 
    }

    await user.save();

    // If everything is successful, save the image path
    if (imagePath) {
      fs.unlink(user.image, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
      user.image = imagePath;
      await user.save();
    }

    return response.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    // If there's an error, delete the uploaded file (if it exists) to avoid saving incomplete data
    if (request.file) {
      fs.unlink(request.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    return response.status(500).json({ message: error.message });
  }
};
const deleteUser = async (request, response) => {
  try {
    const id = request.params.id;
    const user = await UserModel.findByPk(id);
    if (!user) {
      // Handle case where user is not found
      return { success: false, message: 'User not found' };
    }
    // Delete the user
    await user.destroy();
    return response.status(200).json({ message: "user deleted" });
  } catch (error) {
    // Handle errors during deletion
    return response.status(500).json({ message: error.message });
  }
};
 const logout = async (request, response) => {
  try{
    response.clearCookie('accessToken');
    response.status(200).json({message:'Logged out'});
  } catch{
    return response.status(401).json({
      success: false,
      message: error.message
    });
  }

}
 
  export { register, login, getUsers, getUser, updateProfile, deleteUser,logout };
