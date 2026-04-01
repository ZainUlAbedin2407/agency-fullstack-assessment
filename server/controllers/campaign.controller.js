import supabase from '../config/supabase.js';

// GET /campaigns — list all (Filter out soft-deleted)
export const getCampaigns = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .is('deleted_at', null);

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

        const errors = [];
        if (!name || typeof name !== 'string') errors.push("Campaign name is required and must be text.");
        if (!client || typeof client !== 'string') errors.push("Client name is required.");
        if (budget === undefined || isNaN(budget) || budget <= 0) errors.push("Budget must be a positive number.");
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation Failed",
                errors: errors
            });
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

        // Use { count: 'exact' } to see if Supabase even sees the row
        const { data, error } = await supabase
            .from('campaigns')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: "Campaign not found",
                details: "The ID exists but the update returned no rows. Check if RLS is disabled in Supabase."
            });
        }

        res.status(200).json({ message: "Soft delete successful", data: data[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};