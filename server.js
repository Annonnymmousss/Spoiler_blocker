
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const key = process.env.GEMINI_API; // Replace with your actual Google API key
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json({ limit: '1000mb' })); // Increase payload limit to handle large requests
app.use(cors());

// Handle the '/is_spoiler_batch' endpoint
app.post('/is_spoiler_batch', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    // Call the generative model with the batch prompt
    const result = await model.generateContent(prompt);
    
    if (result) {
      // Parse the response from the model to extract the list of indices
      const responseText = result.response.text();
      
      // Logic to parse the response and extract indices of the spoilers
      const spoilersIndices = parseIndices(responseText);
      
      res.json({ indices: spoilersIndices });
    } else {
      res.json({ indices: [] });
    }
  } catch (error) {
    console.error("Error in processing request:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Function to parse the API response and extract indices
function parseIndices(responseText) {
  const regex = /\d+/g; // Match all numeric values (indices)
  const matches = responseText.match(regex);
  return matches ? matches.map(match => parseInt(match, 10)) : [];
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
