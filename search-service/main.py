from flask import Flask, request  # Import Flask and request object for handling HTTP requests
from flask_cors import CORS  # Import CORS for handling cross-origin requests

from dotenv import load_dotenv  # Import load_dotenv to load environment variables from a .env file
load_dotenv()  # Load environment variables from a .env file

from utils.semantic_search import search, add_baskets, delete_basket, edit_document  # Import custom search and add_baskets functions
from utils.recommendation import buy_basket, recommendation
import os  # Import os for interacting with the operating system

app = Flask(__name__)  # Create a new Flask application instance
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) for the app

# Json format for add and edit baskets
# {
#     "baskets": [
        # id: int,
        # available: bool,
        # blocked: bool,
        # expiredAt: float,
        # createdAt: float,
        # location: List[fload],
        # title: string,
        # description: string,
        # ingredients: List[str],
        # tags: List[str],
#     ]
# }

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

@app.route("/delete", methods=['POST'])
def del_basket():
    data = request.get_json()
    id = data.get('id', None)
    if id == None:
        return {"res": False}
    return {"res": delete_basket(id)} # delete the basket

# Define the route for searching
@app.route("/search")
def query_search():
    data = request.get_json()
    k = data.get('k', 12)
    query = data.get('query', None)
    if query == None:
        return {"ids": False}
    ids = search(query, k)
    return {"ids": ids}  # Perform a search with the query parameter and return the result IDs

@app.route("/buy", methods=['POST'])
def user_buy_basket():
    data = request.get_json()
    id = data.get('id', None)
    user_id = data.get('user_id', None)
    if id == None or user_id == None:
        return {"res": False}
    return {"res": buy_basket(id, user_id)} # return true or false
    
@app.route("/recommend", methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = data.get('user_id', None)
    k = data.get('k', 4)
    if user_id == None:
        return {"res": False}
    return {"res": recommendation(user_id, k)}
# Run the app if this script is executed directly
if __name__ == "__main__":
    app.run(debug=True, port=3000)  # Run the Flask app in debug mode on port 3000


# recommendation: id_user
# buy: id_user, id_basket