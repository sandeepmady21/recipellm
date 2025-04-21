# RecipeLLM - AI Recipe & Nutrition Assistant

A full-stack application that connects to MongoDB and uses an LLM agent to answer natural language queries about recipes and nutrition.

## Prerequisites

1. MongoDB installed and running on your computer
2. Node.js and npm/pnpm for the frontend
3. Python 3.8+ for the backend

## Project Setup

### MongoDB Setup

1. Make sure MongoDB is running locally (`mongod` service should be active)
2. The application will automatically create a database called `recipe_chatbot`

### Import CSV Data to MongoDB

```bash
# Install required Python packages
pip3 install -r requirements.txt

# Import sample CSV data to MongoDB
python3 import_csv_to_mongodb.py
```

### Backend Setup

```bash
# Install dependencies
pip3 install -r requirements.txt

# Start the Flask API server
python3 app.py
```

The API will run on http://localhost:5000

### Frontend Setup

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm run dev
```

The frontend will run on http://localhost:5173

## Testing the Application

1. Start both the backend and frontend servers
2. Open your browser to http://localhost:5173
3. Use the chat interface to query your recipe database. Try prompts like:
   - "Show me all recipes with chicken"
   - "What's the nutritional value of avocado?"
   - "How many recipes are in the database?"

## Architecture

- **Frontend**: React/TypeScript with TailwindCSS
- **Backend**: Flask API that connects to:
  - MongoDB database for recipe and nutrition data
  - agent3.py to translate natural language to MongoDB queries
- **Database**: MongoDB with collections for recipes, nutrition, etc.

## File Structure and Purpose

### Backend Files
- `app.py`: Flask API server that handles requests from the frontend, connects to MongoDB, and processes queries.
- `agent3.py`: Main agent that processes natural language queries and translates them to MongoDB operations.
- `llm_wrapper.py`: Wrapper class for LLM integration that provides implementation for text generation.
- `mongo_utils.py`: Utilities for connecting to MongoDB and executing queries.
- `utils.py`: General utility functions for data formatting and text processing.
- `log_utils_mongo.py`: Utilities for logging MongoDB operations.
- `import_csv_to_mongodb.py`: Script to import sample recipe data from CSV into MongoDB.

### Configuration Files
- `requirements.txt`: Python package dependencies.
- `.env`: Environment variables for configuration.
- `llm_prompt_mongo.txt`: Text file with prompts for the LLM.
- `db_schema_context_mongo.txt`: Schema information for the LLM.
- `start.sh`: Shell script to start the application.

### Frontend Files
- `src/App.tsx`: Main React component that sets up theme and view modes.
- `src/main.tsx`: Entry point for the React application.
- `src/index.css`: CSS styles including Tailwind configurations.

### Components
- `src/components/Chat.tsx`: Chat interface with message handling and conversation management.
- `src/components/ChatMessage.tsx`: Component for rendering individual chat messages.
- `src/components/ChatHistory.tsx`: Component for displaying and managing conversation history.

### Services
- `src/services/api.ts`: Service for making API calls to the backend.

### Build Configuration
- `vite.config.ts`, `tsconfig.json`: Configuration files for TypeScript and Vite build system.
- `tailwind.config.js`: Tailwind CSS configuration.
- `eslint.config.js`: ESLint configuration.

## Troubleshooting

- If you can't connect to MongoDB, ensure the service is running: `mongod`
- Check that the MongoDB URI in the `.env` file is correct
- Make sure all required dependencies are installed

## License

MIT
