import { generateAuthUrl, getJwtToken, getUserProfile, oauth2Client, saveUser } from "../services/google/auth.service.js";

export const login = (req,res)=>{
    const url = generateAuthUrl();
    res.json({ Message: "Please visit url below to login", url });
};

