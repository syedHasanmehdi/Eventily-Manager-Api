import { User } from "../models/user.model.js";
import { logger } from "../utils/winston.js";
import jwt from 'jsonwebtoken';
import { oauth2Client } from "../services/google/auth.service.js";

export const isAuthenticated = async (req, res,next) => {
    try {
        const cookie=req.cookies;
        const token=cookie["auth-token"];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decodedToken.userId;

        if(!userId){
            return res.status(400).json({message: 'Invalid token: Email not found'})
        }

        const user = await User.findByPk(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });

        next();
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: "User not authenticated" });

    }
}