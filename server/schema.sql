-- server/schema.sql

CREATE TABLE campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    budget DECIMAL(12, 2) NOT NULL,
    status TEXT CHECK (status IN ('active', 'paused', 'completed')) DEFAULT 'active',
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- Mandatory for Task 2.1 Soft Delete
);