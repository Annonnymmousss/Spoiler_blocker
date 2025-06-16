# Spoiler Detector Chrome Extension

A Chrome browser extension that automatically detects and hides spoilers on web pages using AI-powered content analysis. The extension allows users to specify keywords for content they want to avoid spoilers for, and automatically censors potentially spoiling text.

## Features

- **AI-Powered Detection**: Uses Google's Gemini AI to intelligently identify spoilers
- **Customizable Keywords**: Add/remove keywords for content you want to protect from spoilers
- **Batch Processing**: Efficiently processes multiple text nodes simultaneously
- **Click-to-Reveal**: Censored spoilers can be revealed by clicking on them
- **Real-time Protection**: Automatically scans and censors content as pages load
- **User-Friendly Interface**: Simple popup interface for managing spoiler keywords

## Architecture

The extension consists of several components:

### Chrome Extension Components
- **Content Script**: Scans web pages for spoilers and applies censorship
- **Popup Interface**: Allows users to manage spoiler keywords
- **Background Script**: Handles extension initialization
- **Storage**: Persists user's spoiler keyword preferences

### Backend Server
- **Express.js API**: Processes spoiler detection requests
- **Google Gemini Integration**: Uses AI to determine if text contains spoilers
- **Batch Processing**: Handles multiple text analysis requests efficiently

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Chrome browser
- Google Generative AI API key

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spoiler-detector
   ```

2. **Install dependencies**
   ```bash
   npm install express cors @google/generative-ai
   ```

3. **Configure API Key**
   - Get a Google Generative AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Replace the empty `key` variable in the server files with your API key:
   ```javascript
   const key = "YOUR_GOOGLE_API_KEY_HERE";
   ```

4. **Start the server**
   ```bash
   node server.js
   ```
   The server will run on `http://localhost:3000`

### Chrome Extension Setup

1. **Load the extension**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension directory

2. **Verify installation**
   - The extension icon should appear in your browser toolbar
   - Click the icon to access the popup interface

## Usage

### Adding Spoiler Keywords

1. Click the extension icon in your browser toolbar
2. Enter a keyword for content you want to avoid spoilers for (e.g., "Star Wars", "Game of Thrones")
3. Click "Add Spoiler" to save the keyword
4. The keyword will appear in your list of protected content

### Removing Keywords

1. Open the extension popup
2. Find the keyword you want to remove in the list
3. Click the "Remove" button next to it

### Browsing with Protection

- Navigate to any website normally
- The extension automatically scans text content for potential spoilers
- Spoilers are hidden with black highlighting and a "Spoiler detected!" tooltip
- Click on censored text to reveal the content

## API Endpoints

### POST /is_spoiler_batch
Processes multiple text snippets for spoiler detection.

**Request Body:**
```json
{
  "prompt": "AI prompt containing text snippets and keywords"
}
```

**Response:**
```json
{
  "indices": [0, 2, 5]
}
```

## Configuration

### Server Configuration
- **Port**: Default is 3000, can be modified in server.js
- **CORS**: Configured to allow requests from Chrome extensions
- **Payload Limit**: Set to 1000mb to handle large batch requests

### Extension Configuration
- **Storage**: Uses Chrome's local storage API
- **Permissions**: Requires access to all websites for content scanning

## Technical Details

### Spoiler Detection Algorithm
The extension uses a sophisticated AI prompt that evaluates text based on:
1. Whether it reveals significant plot twists or character developments
2. If it provides information that changes understanding of the story
3. Whether it pertains to the specified keywords
4. If the information would diminish the first-time experience

### Performance Optimization
- **Batch Processing**: Groups multiple text nodes into single API requests
- **Text Limiting**: Processes only the first 200 characters of each text node
- **Efficient DOM Traversal**: Uses XPath for fast text node discovery

### Security Features
- **Input Validation**: Sanitizes user input for keywords
- **Error Handling**: Graceful degradation if API requests fail
- **Cross-Origin Restrictions**: Properly configured CORS headers

## File Structure

```
spoiler-detector/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── popup.css              # Popup styling
├── content.js             # Main content script
├── background.js          # Background script
├── server.js              # Express server
└── README.md              # This file
```

## Development

### Content Script Flow
1. Retrieves stored spoiler keywords from Chrome storage
2. Scans all text nodes on the page using XPath
3. Batches text content and sends to API for analysis
4. Applies censorship styling to detected spoilers
5. Adds click listeners for spoiler revelation

### API Integration
The extension communicates with a local Express server that interfaces with Google's Gemini AI model for intelligent spoiler detection.

## Troubleshooting

### Common Issues

**Extension not working:**
- Ensure the backend server is running on port 3000
- Check that your Google API key is valid and properly configured
- Verify the extension is loaded in Chrome and has necessary permissions

**No spoilers being detected:**
- Confirm keywords are added correctly in the popup
- Check browser console for any error messages
- Ensure the API server is responding to requests

**Performance issues:**
- The extension processes text in batches to minimize API calls
- Large pages may take a moment to fully process
- Consider reducing the number of active keywords if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with various websites and spoiler scenarios
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This extension uses AI to detect spoilers, which may not be 100% accurate. Some spoilers might not be detected, and some non-spoiler content might be incorrectly flagged. Users should use their discretion when relying on this tool for spoiler protection.

## Support

For issues, feature requests, or questions, please open an issue on the project repository.