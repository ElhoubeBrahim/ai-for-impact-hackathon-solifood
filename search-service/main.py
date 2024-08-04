from flask import Flask, request  # Import Flask and request object for handling HTTP requests
from flask_cors import CORS  # Import CORS for handling cross-origin requests

from dotenv import load_dotenv  # Import load_dotenv to load environment variables from a .env file
load_dotenv()  # Load environment variables from a .env file

from utils.semantic_search import search, add_baskets, delete_basket, edit_document  # Import custom search and add_baskets functions
import os  # Import os for interacting with the operating system

app = Flask(__name__)  # Create a new Flask application instance
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) for the app

# Define the home route
@app.route("/")
def home():
    return {
        "message": "Welcome to the SoliFood search API",
        "version": "1.0.0",
        "description": "Semantic search API for the SoliFood platform",
    }  # Return a JSON response with a welcome message and API details

# Define the route for adding baskets
@app.route("/add-baskets", methods=["POST"])
def add_baskets_embed():
    baskets = request.json["baskets"]  # Get the list of baskets from the POST request JSON body
    return {"res": add_baskets(baskets)}  # Add baskets 

# Define the route for updating baskets
@app.route("/update-baskets", methods=["POST"])
def update_baskets():
    baskets = request.json["baskets"]  # Get the list of baskets from the POST request JSON body
    return {"res": edit_document(baskets)}  # update baskets

# Define the route for searching
@app.route("/search")
def query_search():
    data = request.get_json()
    k = data.get('k', 12)
    query = data.get('query', None)
    if query == None:
        raise Exception("You must send query in your json!!!")
    ids = search(query, k)
    return {"ids": ids}  # Perform a search with the query parameter and return the result IDs

@app.route("/delete")
def del_basket():
    data = request.get_json()
    id = data.get('id', None)
    if id == None:
        raise Exception("You must send an id!!!")
    return {"res": delete_basket(id)} # delete the basket


# Run the app if this script is executed directly
if __name__ == "__main__":
    app.run(debug=True, port=3000)  # Run the Flask app in debug mode on port 3000
