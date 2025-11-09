// NVIDIA NIM Integration for Agent Intelligence

// IMPORTANT: Get your API key from https://build.nvidia.com/
// For hackathon: Use the free tier with meta/llama-3.1-8b-instruct or nvidia/nemotron-mini
const NVIDIA_API_KEY = 'nvapi-YOUR_KEY_HERE'; // TODO: Replace with your actual key
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

// Default model - fast and free tier available
const DEFAULT_MODEL = 'meta/llama-3.1-8b-instruct'; // or 'nvidia/llama-3.1-nemotron-70b-instruct'

/**
 * Call NVIDIA NIM API with a system prompt and user data
 * @param {string} systemPrompt - The agent's role and instructions
 * @param {string} userPrompt - The data to analyze
 * @param {number} timeout - Request timeout in milliseconds (default 30s)
 * @returns {Promise<object>} - Parsed JSON response from agent
 */
export const callAgent = async (systemPrompt, userPrompt, timeout = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.2, // Lower temperature for more deterministic results
        max_tokens: 1024,
        top_p: 0.9,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NVIDIA API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Try to parse as JSON
    try {
      // Extract JSON if wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.warn('Could not parse NVIDIA response as JSON, returning raw content', parseError);
      // Fallback: return structured object with raw content
      return {
        findings: [content],
        riskIndicators: [],
        score: 50,
        confidence: 'low',
        rawResponse: content
      };
    }

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('NVIDIA API request timeout - agent took too long to respond');
    }
    
    console.error('Error calling NVIDIA API:', error);
    throw error;
  }
};

/**
 * Test NVIDIA connection with a simple prompt
 * @returns {Promise<boolean>} - True if connection successful
 */
export const testConnection = async () => {
  try {
    const result = await callAgent(
      'You are a helpful assistant. Return JSON with a single field "status" set to "connected".',
      'Test connection',
      5000
    );
    return result.status === 'connected';
  } catch (error) {
    console.error('NVIDIA connection test failed:', error);
    return false;
  }
};

/**
 * Helper to format vendor data for agent prompts
 * @param {object} vendorData - Form data from vendor submission
 * @returns {string} - Formatted string for LLM consumption
 */
export const formatVendorData = (vendorData) => {
  return Object.entries(vendorData)
    .filter(([_, value]) => value && value.toString().trim() !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
};

