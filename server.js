const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization:"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"
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response from OpenAI.';
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Server error. Please try again.' });
  }
});

app.listen(3000, () => console.log('Backend listening on http://localhost:3000'));