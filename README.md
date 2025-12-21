# Chat Interface

A conversational AI interface with dual-input modalities (text and voice), featuring a futuristic glassmorphism design. Built with React, TypeScript, and Vite.

![Design Archetype: Glassmorphism / HUD](https://img.shields.io/badge/Design-Glassmorphism-8b5cf6)

## Features

- **Dual Input Modes**
  - Type messages with auto-expanding textarea (up to 4 lines)
  - Voice recording with real-time waveform visualization
  - Voice-to-text transcription via API integration

- **Rich Visual Feedback**
  - Recording state with pulsing red button and waveform
  - Transcribing state with loading animation
  - Thinking indicator during AI processing
  - Smooth typewriter effect for assistant responses
  - Message entrance animations with slide-up effect

- **Glassmorphism UI**
  - Deep space aesthetic with midnight blue gradients
  - Frosted glass message bubbles with backdrop blur
  - Glowing accents (cyan for interactions, violet for assistant)
  - Responsive layout with fixed input dock

- **Smart Error Handling**
  - Microphone permission detection and user notifications
  - API error handling with retry options
  - Inline error messages in chat thread

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Space Grotesk, JetBrains Mono

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- Microphone access for voice input

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

This project requires two environment variables for the transcription API:

- `VITE_VERA_API_URL` - Base URL for the API endpoint
- `VITE_VERA_API_KEY` - Authentication key for the API

Configure these in your project settings (not in `.env` files).

## Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx      # Main chat container
│   │   ├── MessageThread.tsx      # Message list with scroll
│   │   ├── MessageBubble.tsx      # Individual message component
│   │   ├── InputDock.tsx          # Text input + voice controls
│   │   ├── VoiceButton.tsx        # Mic button with recording logic
│   │   ├── AudioWaveform.tsx      # Real-time audio visualization
│   │   ├── ThinkingIndicator.tsx  # AI processing animation
│   │   └── types.ts               # TypeScript interfaces
│   └── ui/                        # shadcn/ui components
├── lib/
│   └── utils.ts                   # Utility functions
└── main.tsx                       # App entry point
```

## API Integration

## Endpoints

### 1. `POST /chat` — Text Chat

Send a text message to Vera and receive a response.

**Request Body:**

| Field        | Type   | Required | Description |
|-------------|--------|----------|-------------|
| `session_id` | string | No       | Optional session ID to continue a previous conversation. If omitted, a new session is created. |
| `message`    | string | Yes      | The user message or prompt for Vera. |

**Example Request (JSON):**

```json
{
  "session_id": "abc123",
  "message": "Hello Vera, how are you?"
}
```

**Reponse:**

| Field        | Type   | Required | Description |
|-------------|--------|----------|-------------|
| `session_id` | string | No       | The session ID (useful to continue the conversation). |
| `response`    | string | Yes      | Vera's generated response to the message. |

**Expected Response (JSON):**

```json
{
  "session_id": "abc123",
  "response": "Hello! I'm doing great. How can I assist you today?"
}
```

### `/transcribe` Endpoint

**Method**: POST  
**Content-Type**: multipart/form-data  
**Authentication**: Bearer token in Authorization header

**Request Body**:
```
file: audio/webm blob
```

**Expected Response (JSON):**

```json
{
  "transcript": "Hello Vera, can you tell me a fun fact?"
}
```

## Usage

1. **Text Input**: Type your message and press Enter or click the send button
2. **Voice Input**: 
   - Click the microphone button to start recording
   - Speak your message (waveform shows audio levels)
   - Click again to stop and transcribe
   - Edit the transcribed text if needed
   - Send the message

## Design System

### Colors
- **Background**: `#0a0e27`, `#1a1f3a` (deep navy tones)
- **Primary Accent**: `#00d9ff` (electric cyan)
- **Secondary Accent**: `#8b5cf6` (violet)
- **Error/Recording**: `#ef4444` (red)

### Typography
- **Headers**: Space Grotesk (700)
- **Message Content**: JetBrains Mono (400, 15px)
- **Timestamps**: JetBrains Mono (300, 11px, 60% opacity)

### Spacing
- Message gap: 24px (`space-y-6`)
- Horizontal padding: 24px
- Input dock padding: 20px vertical, 24px horizontal
- Element gap in input: 20px

## Browser Compatibility

- Modern browsers with `getUserMedia` support
- Chrome/Edge 53+
- Firefox 36+
- Safari 11+

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
