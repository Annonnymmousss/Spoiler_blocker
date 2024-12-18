async function isSpoiler(text, keyword) {
    const response = await fetch('http://localhost:3000/is_spoiler', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, keyword })
    });

    const result = await response.json();
    console.log(result.result);
    return result.result;
}

isSpoiler('\"No, I am your father.\" – Darth Vader', '"star wars"')










const { GoogleGenerativeAI } = require("@google/generative-ai");
const key = "AIzaSyCu729E16dLk-K2h_MOK-D3HrSBWARNaBU";
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const cors = require('cors');

const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());


async function isSpoiler(text, keyword) {
    const prompt = "Your task is to identify whether the sentence S being passed to you can be perceived as a spoiler for someone that is yet to watch " + keyword + ". Remember that a spoiler is a statement that reveals information that is yet to be revealed to the user. If it can be perceived as a spoiler, return 'True'. If it cannot be perceived as a spoiler, return 'False'.\n\nS: " + text;

    const result = await model.generateContent(prompt);

    // console.log(result);

    if (result) {
        // console.log(result.response.text() +"aa");
        return result.response.text().toLowerCase().includes('true');
    }

    return false;
}

app.post('/is_spoiler', async (req, res) => {
    console.log("Received request: ", req.body.text, req.body.keyword);
    const text = req.body.text;
    const keyword = req.body.keyword;
    const result = await isSpoiler(text, keyword);
    res.json({ result: result });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});







// Get the stored spoilers list
chrome.storage.local.get(['spoilers'], (result) => {
    const spoilers = result.spoilers || [];
  
    // Function to check for spoilers and hide them
    function hideSpoilers(spoilerKeywords) {
      spoilerKeywords.forEach( async keyword => {
        // Traverse through all text nodes in the document
        const textNodes = document.evaluate("//text()[normalize-space(.) != '']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  
        for (let i = 0; i < textNodes.snapshotLength; i++) {
          const node = textNodes.snapshotItem(i);
          if (await isSpoiler(node.textContent, keyword)) {
            const parent = node.parentNode;
            parent.style.backgroundColor = 'black';
            parent.style.color = 'black';
            parent.style.cursor = 'pointer';
            parent.setAttribute('title', 'Spoiler detected! Click to reveal.');
  
            // Reveal on click
            parent.addEventListener('click', () => {
              parent.style.backgroundColor = '';
              parent.style.color = '';
            });
          }
        }
      });
    }
  
    async function isSpoiler(text, keyword) {
      content = JSON.stringify({ text, keyword });
      console.log(content);
      const response = await fetch('http://localhost:3000/is_spoiler', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: content,
          // mode: 'no-cors'
      });
  
      const result = await response.json();
      console.log(result.result);
      return result.result;
  }
  
    // Run the spoiler hiding function with stored spoilers
    hideSpoilers(spoilers);
  });
  