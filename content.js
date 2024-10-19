// Get the stored spoilers list
chrome.storage.local.get(['spoilers'], (result) => {
  const spoilers = result.spoilers || [];

  // Function to check for spoilers and hide them
  function hideSpoilers(spoilerKeywords) {
    spoilerKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi'); // Case-insensitive, whole-word matching

      // Traverse through all text nodes in the document
      const textNodes = document.evaluate("//text()[normalize-space(.) != '']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i);
        if (regex.test(node.textContent)) {
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

  // Run the spoiler hiding function with stored spoilers
  hideSpoilers(spoilers);
});
