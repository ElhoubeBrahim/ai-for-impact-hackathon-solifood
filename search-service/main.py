from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return {
		"message": "Welcome to the SoliFood search API",
		"version": "1.0.0",
		"description": "Semantic search API for the SoliFood plarform",
	}


if __name__ == "__main__":
    app.run(debug=True, port=3000)
