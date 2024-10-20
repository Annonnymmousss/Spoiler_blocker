chrome.storage.local.get(['spoilers'], (result) => {
  const spoilers = result.spoilers || [];

  // Function to check for spoilers and hide them
  function hideSpoilers(spoilerKeywords) {
    const textNodes = [];
    const nodeElements = [];

    // Traverse through all text nodes in the document
    const nodes = document.evaluate("//text()[normalize-space(.) != '']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < nodes.snapshotLength; i++) {
      const node = nodes.snapshotItem(i);
      // Collect text content up to 200 characters
      textNodes.push(node.textContent.substring(0, 200)); 
      nodeElements.push(node); // Save the corresponding DOM node for future use
    }

    // Send the entire batch of text nodes and keywords in a single request
    checkSpoilersInBatch(textNodes, spoilerKeywords).then(indicesToCensor => {
      indicesToCensor.forEach(index => {
        // Ensure the index is within bounds before accessing the DOM node
        if (index >= 0 && index < nodeElements.length) {
          const parent = nodeElements[index].parentNode;
          // Apply censorship by hiding the text content
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
      });
    }).catch(error => {
      console.error("Error in checking spoilers:", error); // Log any errors
    });
  }

  // Send the batch of text nodes and keywords to the server
  async function checkSpoilersInBatch(texts, keywords) {

    const prompt = `
      You are an AI responsible for detecting **spoilers** in a set of sentences. A spoiler is defined as any sentence that reveals key information about the plot, characters, or events of a specific work of content, which would reduce the suspense, surprise, or emotional impact for someone who has not yet experienced that content.

      A sentence should be marked as a **spoiler** if it meets **all** of the following conditions:
      1. It reveals a **significant plot twist**, **character development**, **surprise**, or **resolution of a conflict** that has not yet been revealed to the viewer or reader.
      2. The sentence **explicitly** or **implicitly** provides information that fundamentally changes the viewer’s understanding of the plot or characters.
      3. It pertains to one of the **keywords** listed, which represent the content being evaluated.
      4. The information in the sentence would **diminish** the experience of watching or reading the content for the first time, due to the early revelation of important events.

      ### Consistency Instructions:
      - **Important**: If an identical sentence is repeated multiple times, you must ensure that the same judgment is applied each time. Sentences that are identical or nearly identical must be treated consistently. If one instance is a spoiler, all identical instances are spoilers.
      - When making the decision, ensure that each sentence is **evaluated independently** but consistently across the entire set of sentences.

      The content being evaluated is related to the following keywords: ${keywords.join(", ")}.

      ### Sentences:
      ${texts.map((text, index) => `${index}. ${text}`).join("\n")}

      Please return your response in the following format:
      - Provide a list of **indices** (starting from 0) corresponding to the sentences that are spoilers.
      - If none of the sentences are spoilers, return an empty list.

      ### Example output:
      - If sentences 2 and 4 are spoilers, return: [1, 3]
      - If none of the sentences are spoilers, return an empty list: []
    `;

    try {
      const response = await fetch('http://localhost:3000/is_spoiler_batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      const result = await response.json();
      return result.indices || [];  // Return the list of indices to censor
    } catch (error) {
      console.error("Failed to fetch from server:", error);
      return [];
    }
  }

  hideSpoilers(spoilers); // Trigger the spoiler check
});
