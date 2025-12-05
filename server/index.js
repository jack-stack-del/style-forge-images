require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Photorealistic enhancement prompt template
const createEnhancementPrompt = (userPrompt) => {
  return `You are an expert prompt engineer specializing in photorealistic image generation. Your task is to enhance the user's prompt to create highly detailed, photorealistic images.

Original prompt: "${userPrompt}"

Please enhance this prompt by adding:
- Specific lighting details (directional, intensity, color temperature)
- Camera settings (lens type, focal length, aperture)
- Material textures and surface details
- Composition and framing elements
- Professional photography techniques
- High-quality keywords for realism

Focus on making the prompt more descriptive and optimized for photorealistic AI image generation. Keep the core concept intact but make it much more detailed and professional.

Provide only the enhanced prompt, no explanations or additional text.`;
};

// POST /api/enhance
app.post('/api/enhance', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
    }

    // Use provided API key or fall back to environment variable
    const OPENROUTER_API_KEY = apiKey || process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return res.status(400).json({ error: 'OpenRouter API key is required. Please provide your API key.' });
    }

    const enhancementPrompt = createEnhancementPrompt(prompt.trim());

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000', // Optional, for rankings
        'X-Title': 'Prompt Enhancement Tool', // Optional, for rankings
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          {
            role: 'user',
            content: enhancementPrompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      return res.status(500).json({ error: 'Failed to enhance prompt' });
    }

    const data = await response.json();
    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
      return res.status(500).json({ error: 'No enhanced prompt received from API' });
    }

    res.json({ enhancedPrompt });
  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Prompt Enhancement Server running on port ${PORT}`);
});
