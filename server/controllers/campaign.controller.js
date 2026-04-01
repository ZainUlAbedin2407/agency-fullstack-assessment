import supabase from '../config/supabase.js';

// GET /campaigns — list all (Filter out soft-deleted)
export const getCampaigns = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort_by = 'created_at',
            order = 'desc',
            status,
            client
        } = req.query;

        let query = supabase
            .from('campaigns')
            .select('*', { count: 'exact' })
            .is('deleted_at', null);

        // Filters
        if (status) query = query.eq('status', status);
        if (client) query = query.ilike('client', `%${client}%`);

        // Sorting
        query = query.order(sort_by, { ascending: order === 'asc' });

        // Pagination
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        const from = (parsedPage - 1) * parsedLimit;
        const to = from + parsedLimit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        res.status(200).json({
            data,
            pagination: {
                total: count,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(count / parsedLimit)
            }
        });
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

// GET /campaigns/:id — single campaign with full metrics
export const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error && error.code === 'PGRST116') {
             return res.status(404).json({ error: "Campaign not found" });
        }
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// PUT /campaigns/:id — update campaign
export const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Prevent protected system fields from being manually overridden
        delete updates.id;
        delete updates.created_at;
        delete updates.deleted_at;

        const { data, error } = await supabase
            .from('campaigns')
            .update(updates)
            .eq('id', id)
            .is('deleted_at', null)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ error: "Campaign not found" });

        res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};