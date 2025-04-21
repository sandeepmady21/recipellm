# RecipeLLM

A recipe application that uses an LLM as a translator between the user and a recipe database.

## Features

- Natural language interface for querying recipes
- Ask for recipes by ingredients, dietary restrictions, or meal types
- Developer mode to see the underlying LLM processing
- Flask backend that simulates an LLM translator for database queries

## Project Structure

```
recipellm/
├── app.py              # Flask backend
├── requirements.txt    # Python dependencies
├── src/                # React frontend
│   ├── components/     # React components
│   ├── services/       # API services
│   └── ...
└── ...
```

## Setup

### Backend Setup

1. Create a Python virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install backend dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask backend:
   ```
   python app.py
   ```
   The backend will run on http://localhost:5000

### Frontend Setup

1. Install frontend dependencies:
   ```
   pnpm install
   ```

2. Run the frontend development server:
   ```
   pnpm run dev
   ```
   The frontend will run on http://localhost:5174 (or another port if 5174 is in use)

## Usage

1. Start both the frontend and backend servers
2. Open your browser to http://localhost:5174
3. Try queries like:
   - "Show me all recipes"
   - "Find recipes with chicken"
   - "What can I make with pasta?"

## Development

- Toggle developer mode with the command line icon in the top-right corner
- The developer mode shows the raw LLM response and SQL query
- Edit `app.py` to customize the backend behavior
- Edit React components in `src/components/` to modify the frontend

## License

MIT
