const User= require ("../models/User");
const asyncHandler = require("express-async-handler");
const {generateToken}= require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
 const validateMongoDbId = require("../utils/validateMongoDbId");
 const jwt = require('jsonwebtoken');
const crypto = require("crypto");

// Create a User ----------------------------------------------

const createUser = asyncHandler(async (req, res) => {
    /**
     * TODO:Get the email from req.body
     */
    const email = req.body.email;
    /**
     * TODO:With the help of email find the user exists or not
     */
    const findUser = await User.findOne({ email: email });
  
    if (!findUser) {
      /**
       * TODO:if user not found user create a new user
       */
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      /**
       * TODO:if user found then thow an error: User already exists
       */
    //   res.json({
    //     msg:"User Already Exists",
    //     success: false,
    //   })
      throw new Error("User Already Exists");
    }
  });
   // Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken =  await generateRefreshToken(findUser?.id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id, 
        {
        refreshToken: refreshToken,
      },
      {
        new:true,
      });
      res.cookie("refreshToken", refreshToken,{
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
   
  
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });
//   const loginAdmin = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     // check if user exists or not
//     const findAdmin = await User.findOne({ email });
//     if (findAdmin.role !== "admin") throw new Error("Not Authorised");
//     if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
//       const refreshToken = await generateRefreshToken(findAdmin?._id);
//       const updateuser = await User.findByIdAndUpdate(
//         findAdmin.id,
//         {
//           refreshToken: refreshToken,
//         },
//         { new: true }
//       );
//       res.cookie("refreshToken", refreshToken, {
//         httpOnly: true,
//         maxAge: 72 * 60 * 60 * 1000,
//       });
//       res.json({
//         _id: findAdmin?._id,
//         firstname: findAdmin?.firstname,
//         lastname: findAdmin?.lastname,
//         email: findAdmin?.email,
//         mobile: findAdmin?.mobile,
//         token: generateToken(findAdmin?._id),
//       });
//     } else {
//       throw new Error("Invalid Credentials");
//     }
//   });
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
  
    if (!findAdmin) {
      throw new Error("User not found"); // Gérer le cas où l'utilisateur n'existe pas
    }
  
    if (findAdmin.role !== "admin") {
      throw new Error("Not Authorised");
    }
  
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      const updateuser = await User.findByIdAndUpdate(
        findAdmin.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        token: generateToken(findAdmin?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });
  
  module.exports={createUser, loginUserCtrl ,loginAdmin}