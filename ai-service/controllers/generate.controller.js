import Groq from 'groq-sdk';

export const generateCopySSE = async (req, res) => {
    // strict SSE Streaming support instructions
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    res.write(': connected\n\n');

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        res.write(`data: ${JSON.stringify({ error: "Groq API key not configured." })}\n\n`);
        return res.end();
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const { prompt } = req.body;
    
    try {
        const stream = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt || "Write a highly engaging short ad copy." }],
            stream: true,
            temperature: 0.7,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error("SSE Streaming Error:", error);
        res.write(`data: ${JSON.stringify({ error: error.message || "Streaming failed" })}\n\n`);
        res.end();
    }
};

export const generateSocial = async (req, res) => {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) return res.status(500).json({ error: "Groq API key not configured." });
    
    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const { topic } = req.body;
    
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: `Write a social media post about this topic: ${topic || 'Marketing strategies'}` }],
            response_format: { type: "json_object" }
        });
        
        // Handle json response by wrapping it cleanly or expecting the LLM to format it
        return res.status(200).json({ post: completion.choices[0].message.content });
    } catch(err) {
        return res.status(500).json({ error: "Failed to generate social post" });
    }
};

export const generateHashtags = async (req, res) => {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) return res.status(500).json({ error: "Groq API key not configured." });
    
    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const { topic } = req.body;
    
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: `Generate 10 trending hashtags for: ${topic || 'Marketing strategies'}. ONLY RETURN THE HASHTAGS SEPARATED BY SPACES. No extra text.` }]
        });
        const tags = completion.choices[0].message.content.split(' ').map(tag => tag.trim());
        return res.status(200).json({ hashtags: tags });
    } catch(err) {
        return res.status(500).json({ error: "Failed to generate hashtags" });
    }
};
