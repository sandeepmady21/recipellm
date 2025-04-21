import re
import json

def clean_query(query):
    """Clean user query by removing extraneous characters"""
    return query.strip()

def format_mongo_results(results):
    """Format MongoDB results for user-friendly display"""
    if isinstance(results, list):
        if not results:
            return "No results found."
        
        # Format list of results
        formatted = []
        for i, item in enumerate(results[:10], 1):  # Limit to 10 items
            if isinstance(item, dict):
                # Handle recipe documents
                if "name" in item:
                    ingredients = item.get("recipeingredientparts", [])
                    if isinstance(ingredients, list) and len(ingredients) > 0:
                        ingredients_str = ", ".join(ingredients[:3])
                        if len(ingredients) > 3:
                            ingredients_str += "..."
                    else:
                        ingredients_str = "No ingredients listed"
                    
                    formatted.append(f"{i}. {item['name']} - Ingredients: {ingredients_str}")
                
                # Handle nutrition documents
                elif "ingredient_name" in item:
                    nutrition_info = []
                    for key in ["protein_g", "fat_g", "carbohydrate_g", "energy_kcal"]:
                        if key in item and item[key] is not None:
                            nutrition_info.append(f"{key.replace('_', ' ')}: {item[key]}")
                    
                    formatted.append(f"{i}. {item['ingredient_name']} - {', '.join(nutrition_info)}")
                
                # Generic document formatting
                else:
                    formatted.append(f"{i}. " + ", ".join([f"{k}: {v}" for k, v in item.items() 
                                                      if k != "_id" and v is not None][:5]))
            else:
                formatted.append(f"{i}. {item}")
                
        return "\n".join(formatted)
    
    elif isinstance(results, dict):
        # Format count results
        if "count" in results:
            return f"Found {results['count']} items."
        # Format error message
        elif "error" in results:
            return f"Error: {results['error']}"
        # Format other dictionary results
        else:
            return "\n".join([f"{k}: {v}" for k, v in results.items()])
    
    return str(results)

def extract_json_block(text):
    """Extract a JSON block from text if present"""
    # Try to find content within triple backticks
    match = re.search(r"```(?:json)?\s*({.*?})\s*```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    
    # Try to find JSON-like content with curly braces
    match = re.search(r"({.*})", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    
    return None 