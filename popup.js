document.getElementById('addSpoiler').addEventListener('click', () => {
  const spoilerInput = document.getElementById('spoilerInput').value.trim();
  if (spoilerInput) {
    chrome.storage.local.get(['spoilers'], (result) => {
      const spoilers = result.spoilers || [];
      if (!spoilers.includes(spoilerInput)) {
        spoilers.push(spoilerInput);
        chrome.storage.local.set({ spoilers });
        updateSpoilerList(spoilers);
      }
    });
    document.getElementById('spoilerInput').value = '';
  }
});

function updateSpoilerList(spoilers) {
  const spoilerList = document.getElementById('spoilerList');
  spoilerList.innerHTML = ''; // Clear existing list

  spoilers.forEach(spoiler => {
    const listItem = document.createElement('li');
    listItem.textContent = spoiler;

    // Create a remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.style.marginLeft = '10px';

    // Add click event to remove the keyword
    removeButton.addEventListener('click', () => {
      removeSpoiler(spoiler);
    });

    listItem.appendChild(removeButton);
    spoilerList.appendChild(listItem);
  });
}

function removeSpoiler(spoiler) {
  chrome.storage.local.get(['spoilers'], (result) => {
    let spoilers = result.spoilers || [];
    spoilers = spoilers.filter(item => item !== spoiler); // Remove the selected spoiler
    chrome.storage.local.set({ spoilers }, () => {
      updateSpoilerList(spoilers); // Update the list after removal
    });
  });
}

// Populate the list when the popup opens
chrome.storage.local.get(['spoilers'], (result) => {
  const spoilers = result.spoilers || [];
  updateSpoilerList(spoilers);
});
