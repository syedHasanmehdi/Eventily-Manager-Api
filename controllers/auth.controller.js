import { generateAuthUrl, getJwtToken, getUserProfile, oauth2Client, saveUser } from "../services/google/auth.service.js";

export const login = (req,res)=>{
    const url = generateAuthUrl();
    res.json({ Message: "Please visit url below to login", url });
};

export const auth = async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");
    try {
        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        let {email} = await getUserProfile();

        const user = await saveUser(email, tokens.refresh_token);

        const payload = { userId: user.id };

        const token = getJwtToken(payload);

        res.send(`
            <script>
              window.opener.postMessage({
                type: 'oauth-success',
                token: '${token}'
              }, 'http://localhost:5173'); 
              window.close();
            </script>
          `);
    } catch (error) {
        res.status(500).send("Authentication failed");
    }
};

export const setToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }

        res.cookie("auth-token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 36000000,
        });

        res.send({ message: "cookies set successfully" });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const logout = (req, res) => {
    res.send("To be done");
};

