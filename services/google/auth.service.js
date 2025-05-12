import { google } from "googleapis";
import { config } from "../../config/index.js";
import { User } from "../../models/user.model.js";

const { client_id, client_secret, redirect_uris } = config.google.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris
);

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



export { generateAuthUrl };
