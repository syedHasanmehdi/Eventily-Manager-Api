import {
  generateAuthUrl,
  getJwtToken,
  getUserProfile,
  oauth2Client,
  saveUser,
} from "../services/auth.service.js";

export const login = (req, res) => {
  const url = generateAuthUrl();
  res.json({ Message: "Please visit url below to login", url });
};

export const auth = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Received tokens:", tokens); // ✅ log here
    oauth2Client.setCredentials(tokens);

    let { email } = await getUserProfile();
    console.log("User profile:", email); // ✅ log here

    const user = await saveUser(email, tokens.refresh_token);

    const payload = { userId: user.id };
    console.log("payloadddddddd", payload);

    const token = getJwtToken(payload);
    console.log("tokekkkkk", token);

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
    console.error("Error in auth handler:", error); // ✅
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

export const updateDiscord = async (req, res) => {
  const { email, discordId } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.discordId = discordId;
    await user.save();

    res.json({ message: "Discord ID updated successfully" });
  } catch (error) {
    console.error("Error updating Discord ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
