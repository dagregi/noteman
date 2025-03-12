# Noteman

## Overview

This is a feature-rich note-taking application built with **SvelteKit** and **Tiptap**. It allows users to create, edit, and store notes using an intuitive rich-text editor. The app integrates **AI-powered text regeneration**, enabling users to refine selected text using custom prompts. Notes are stored in an **SQLite** database, making it efficient for both local and cloud-based deployments.

## Features

- **Rich-Text Editing**: Enjoy a seamless editing experience with Tiptap's robust rich-text capabilities.
- **AI-Powered Text Regeneration**: Select any text and invoke AI to generate refined or alternative versions based on your custom prompts.
- **Auto-Save**: Changes are automatically saved to the database without manual intervention.
- **SQLite Backend**: Lightweight and efficient storage for fast data retrieval.
- **Bubble Menu Toolbar**: A floating toolbar provides quick access to formatting options.
- **SvelteKit API Routes**: Efficient handling of note creation, updating, retrieval, and deletion via dedicated endpoints.

## Tech Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/), [Tiptap](https://tiptap.dev/)
- **Backend**: SvelteKit API routes
- **Database**: SQLite (with an option for MongoDB in the future)
- **AI Integration**: Custom AI logic for text regeneration

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/dagregi/noteman.git
    cd noteman
    ```
2. **Install Dependencies:**
    ```bash
    npm install
    ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory with you OpenAI API key. For example:
    ```env
    OPENAI_API_KEY=your_api_key_here
    ```
4. **Start the Development Server:**
    ```bash
    npm run dev
    ```
    Your app will be available at `http://localhost:5173`

## API Endpoints

The following endpoints are available for managing notes:

| Method | Endpoint       | Description                              |
| ------ | -------------- | ---------------------------------------- |
| POST   | /api/notes     | Create a note                            |
| GET    | /api/notes     | Retrieve all notes                       |
| GET    | /api/notes/:id | Retrieve a specific note                 |
| PATCH  | /api/notes/:id | Update a note (partial update supported) |
| DELETE | /api/notes/:id | Delete a note                            |

## Usage

- **Writing Notes:** Launch the app and start typing in the rich-text editor. Changes are auto-saved.
- **Formatting:** Use the floating bubble menu to format your text with options like bold, underline, and more.
- **AI Regeneration:** Highlight any text and trigger the AI feature to generate improved content based on your prompt.
- **Data Storage:** All notes are securely stored in an SQLite database for fast access and reliability.

## Roadmap

- **Per-user database**
- **Multi-device Syncing**
- **Tagging and Search Features**
- **Dark Mode**
- **MongoDB Support**

## License

This project is licensed under the GPL-3.0 License.

## Contributions

Pull requests are welcome! Feel free to open an issue for feature requests or bug reports.
