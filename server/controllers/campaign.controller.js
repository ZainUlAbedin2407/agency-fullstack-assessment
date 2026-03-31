import supabase from '../config/supabase.js';

// GET /campaigns — list all (Filter out soft-deleted)
export const getCampaigns = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .is('deleted_at', null); // Requirement: Soft delete filter

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// POST /campaigns — create new (Validation required)
export const createCampaign = async (req, res) => {
    try {
        const { name, client, budget, status } = req.body;

        // Basic Validation (Requirement: reject invalid data)
        if (!name || !budget || !client) {
            return res.status(400).json({ error: "Name, Client, and Budget are required fields." });
        }

        const { data, error } = await supabase
            .from('campaigns')
            .insert([{ name, client, budget, status }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE /campaigns/:id — SOFT DELETE ONLY
export const softDeleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        // Requirement: Add deleted_at timestamp instead of actual deletion
        const { error } = await supabase
            .from('campaigns')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: "Campaign soft-deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};