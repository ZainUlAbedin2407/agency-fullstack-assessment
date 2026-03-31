import supabase from '../config/supabase.js';

// Task 2.1 — Register Logic
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email for verification.",
            user: data.user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Task 2.1 — Login Logic (JWT Authentication)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // This token must be used by the frontend to access protected routes
        res.status(200).json({
            success: true,
            message: "Login successful",
            token: data.session.access_token,
            user: data.user
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};