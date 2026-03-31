import supabase from '../config/supabase.js';

export const verifyToken = async (req, res, next) => {
    // Get token from Authorization header (Format: Bearer <token>)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied: No token provided" });
    }

    try {
        // Validate the token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Attach user info to the request for use in controllers
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error during authentication" });
    }
};