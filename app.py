from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from agent3 import process_query
from mongo_utils import connect_mongo
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/query', methods=['POST'])
def handle_query():
    data = request.json
    user_query = data.get('query', '')
    
    if not user_query:
        return jsonify({
            "success": False,
            "message": "No query provided",
            "data": None
        })
    
    try:
        # Process query using agent3's process_query function
        result = process_query(user_query)
        
        # Format the response for the frontend
        return jsonify({
            "success": True,
            "message": "Query processed successfully",
            "data": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error processing query: {str(e)}",
            "data": None
        })

@app.route('/api/collections', methods=['GET'])
def get_collections():
    """Return a list of available collections in MongoDB"""
    try:
        db = connect_mongo()
        collections = db.list_collection_names()
        
        # For each collection, get a sample document to display fields
        collection_details = []
        for coll in collections:
            sample = db[coll].find_one()
            fields = list(sample.keys()) if sample else []
            collection_details.append({
                "name": coll,
                "fields": fields
            })
        
        return jsonify({
            "success": True,
            "message": f"Found {len(collections)} collections",
            "data": collection_details
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching collections: {str(e)}",
            "data": None
        })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Check MongoDB connection
        db = connect_mongo()
        collections = db.list_collection_names()
        mongo_status = True
    except Exception:
        mongo_status = False
    
    return jsonify({
        "status": "ok",
        "mongodb": "connected" if mongo_status else "disconnected"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001) 