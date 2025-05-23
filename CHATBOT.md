# Portfolio QA Chatbot Implementation

This document outlines the implementation of the AI-powered QA chatbot for Qudus Abolade's portfolio website.

## Overview

The chatbot uses a serverless architecture with OpenAI's API to answer questions about Qudus's skills, experience, and projects. The implementation consists of:

1. A serverless function deployed on Vercel that handles API calls to OpenAI
2. A JavaScript client-side implementation for the chat interface
3. CSS styling for the chat UI with animations and responsive design

## Architecture

### Serverless Backend

The backend is a Python serverless function deployed on Vercel that:

- Receives queries from the frontend
- Forwards them to OpenAI's API with context about Qudus
- Returns the AI's responses to the frontend

The OpenAI API key is securely stored as an environment variable in Vercel, never exposed to the client.

### Frontend Implementation

The frontend consists of:

- A chat button with pulsating animation and tooltip to attract attention
- A chat interface that slides in when clicked
- A responsive design that works on both desktop and mobile devices
- Dark mode support that matches the portfolio's theme

## Files

- `api/chat.py`: Serverless function for handling OpenAI API requests
- `js/chatbot.js`: Client-side JavaScript for the chat interface
- `css/chatbot.css`: Styling for the chat UI
- `vercel.json`: Configuration for the Vercel deployment

## Setup Instructions

### 1. Deploy the Serverless Function

1. Create a Vercel account if you don't have one
2. Connect your GitHub repository to Vercel
3. Add your OpenAI API key as an environment variable named `OPENAI_API_KEY`
4. Deploy the project

### 2. Update the API URL

After deployment, update the `apiUrl` in `js/chatbot.js` with your Vercel deployment URL:

```javascript
this.apiUrl = 'https://your-vercel-deployment-url.vercel.app/api/chat';
```

## Features

- **Attention-grabbing UI**: Pulsating button with tooltip and occasional bounce animation
- **Contextual AI**: Responses based on information about Qudus's skills and experience
- **Responsive Design**: Works on all device sizes
- **Dark Mode Support**: Automatically adjusts to the site's theme
- **Accessible from Contact Section**: Additional entry point in the contact section

## Customization

You can customize the chatbot by:

1. Updating the system prompt in `api/chat.py` with more information about Qudus
2. Modifying the animations and styling in `css/chatbot.css`
3. Changing the chat button icon or tooltip text in `js/chatbot.js`

## Security Considerations

- The OpenAI API key is stored securely as an environment variable
- CORS headers are configured to restrict access to your domain
- Rate limiting can be implemented on the Vercel function if needed

## Future Enhancements

Potential improvements to consider:

1. Adding a vector database for more sophisticated RAG capabilities
2. Implementing conversation history storage
3. Adding analytics to track common questions
4. Enhancing the system prompt with more detailed information about projects 