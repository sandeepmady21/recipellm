from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Placeholder for database connection
# In a real app, you would use a proper DB connection
mock_database = {
    "recipes": [
        {"id": 1, "name": "Pasta Carbonara", "ingredients": ["pasta", "eggs", "bacon", "cheese"]},
        {"id": 2, "name": "Chicken Curry", "ingredients": ["chicken", "curry paste", "coconut milk"]},
        {"id": 3, "name": "Caesar Salad", "ingredients": ["lettuce", "croutons", "parmesan", "caesar dressing"]}
    ]
}

# Simple implementation - in production you would use a real LLM API
def llm_translate(user_query):
    """
    Simulate LLM translating user query to database operation
    In a real implementation, this would call an actual LLM API
    """
    lower_query = user_query.lower()
    
    if "show all recipes" in lower_query or "list recipes" in lower_query:
        return {"action": "list_all", "params": {}}
    
    elif "find recipe with" in lower_query or "recipe that has" in lower_query:
        # Extract ingredient from query
        ingredients = []
        common_ingredients = ["pasta", "chicken", "eggs", "bacon", "lettuce", "cheese"]
        for ingredient in common_ingredients:
            if ingredient in lower_query:
                ingredients.append(ingredient)
        return {"action": "find_by_ingredient", "params": {"ingredients": ingredients}}
    
    return {"action": "unknown", "params": {}}

@app.route('/api/query', methods=['POST'])
def process_query():
    data = request.json
    user_query = data.get('query', '')
    
    # Use LLM to translate user query to database operation
    translation = llm_translate(user_query)
    
    # Execute the database operation
    if translation["action"] == "list_all":
        result = mock_database["recipes"]
    
    elif translation["action"] == "find_by_ingredient":
        ingredients = translation["params"]["ingredients"]
        result = []
        for recipe in mock_database["recipes"]:
            if any(ingredient in recipe["ingredients"] for ingredient in ingredients):
                result.append(recipe)
    
    else:
        return jsonify({
            "success": False,
            "message": "I couldn't understand your query. Please try again.",
            "data": None
        })
    
    return jsonify({
        "success": True,
        "message": f"Found {len(result)} results",
        "data": result
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 