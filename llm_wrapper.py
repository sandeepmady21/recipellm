import os
from dotenv import load_dotenv

# Mock LLM implementation for local testing
# In production, this would integrate with an actual LLM API
class Custom_GenAI:
    def __init__(self, api_key=None):
        self.api_key = api_key
        
    def generate_text(self, prompt, max_tokens=1000):
        """
        Generate text based on prompt
        This is a mock implementation for testing
        """
        # We'll implement a simple response model that looks for keywords
        prompt_lower = prompt.lower()
        
        # Simple pattern matching to mock LLM responses
        if "find" in prompt_lower and "recipe" in prompt_lower:
            if "ingredient" in prompt_lower:
                return """
                I'll search for recipes with those ingredients.
                
                MongoDB query:
                recipes find {"recipeingredientparts": {"$regex": "chicken|spinach", "$options": "i"}}
                """
            else:
                return """
                I'll search for recipes that match your criteria.
                
                MongoDB query:
                recipes find {}
                """
        
        elif "nutrition" in prompt_lower:
            return """
            I'll get the nutritional information for that food.
            
            MongoDB query:
            ingredient_nutrition find {"ingredient_name": {"$regex": "avocado", "$options": "i"}}
            """
        
        elif "count" in prompt_lower:
            return """
            I'll count how many recipes are in the database.
            
            MongoDB query:
            recipes count
            """
        
        # Default response
        return """
        I'm not sure how to process that request. Try asking about recipes or nutritional information.
        """
    
    def chat(self, messages):
        """Process chat-style messages and return a response"""
        prompt = "\n".join([msg.get("content", "") for msg in messages])
        return {"choices": [{"message": {"content": self.generate_text(prompt)}}]} 