import { google } from "googleapis";
import { config } from "../config/index.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const { client_id, client_secret, redirect_uris } = config.google.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris
);

console.log(client_id, client_secret, redirect_uris);

const generateAuthUrl = () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "openid",
      "email",
      "profile",
    ],
  });

  return url;
};

const getUserProfile = async () => {
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();
  return userInfo.data;
};

async function saveUser(email, googleRefreshToken) {
  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      user.googleRefreshToken = googleRefreshToken;
      await user.save();
    } else {
      user = await User.create({ email, googleRefreshToken });
    }

    return user;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error; // ✅ ADD THIS LINE
  }
}

function getJwtToken(payload) {
  return jwt.sign(payload, config.jwt.JWT_SECRET, { expiresIn: "1d" });
}

export { generateAuthUrl, getUserProfile, saveUser, getJwtToken, oauth2Client };
