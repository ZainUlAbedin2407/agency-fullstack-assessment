export const generateBrief = async (req, res) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
        const briefData = req.body;

        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        if (!GROQ_API_KEY) {
            return res.status(500).json({ error: "Groq API key not configured." });
        }

        // IMPROVED DYNAMIC PROMPT
        const prompt = `You are a Senior Creative Director at a top-tier advertising agency. 
        Create a high-impact, UNIQUE creative brief for the following client:
        
        Client Name: ${briefData.clientName || 'The Client'}
        Industry: ${briefData.industry || 'N/A'}
        Objective: ${briefData.objective || 'Brand Awareness'}
        Target Audience: ${briefData.targetAudience || 'General'}
        Tone/Style: ${briefData.tone || 'Modern'}
        Competitors: ${briefData.competitors || 'Market Leaders'}

        INSTRUCTIONS:
        1. Be specific to the ${briefData.industry} industry. 
        2. Do NOT use generic names like "Lumiere" unless specifically requested.
        3. Headlines must be catchy and unique to the client's objective: ${briefData.objective}.
        4. Allocate the channel split based on where a ${briefData.targetAudience} audience spends their time.

        Respond ONLY with a valid JSON file matching this exact schema:
        {
          "title": "A unique, context-aware campaign title",
          "headlines": ["Headline 1", "Headline 2", "Headline 3"],
          "tone_guide": "A descriptive guide based on the requested ${briefData.tone} tone.",
          "channels": [
            {"name": "Primary Channel", "split": 50},
            {"name": "Secondary Channel", "split": 30},
            {"name": "Tertiary Channel", "split": 20}
          ],
          "visual_direction": "Specific visual style instructions."
        }`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.8, // Increases creativity and variety
                top_p: 0.9
            })
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (data.error) {
            console.error("Groq API error:", data.error);
            return res.status(500).json({ error: data.error.message || "Failed to generate brief" });
        }

        const content = data.choices[0].message.content;
        const resultJson = JSON.parse(content);

        console.log("New Brief Generated:", resultJson.title);
        return res.status(200).json(resultJson);

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: "Connection to AI timed out." });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
