import chromadb
from chromadb.utils import embedding_functions
import re
import time
import os

# Global constants
PATH = "./vectore_db"  # Path to the vector database
API_KEY = os.getenv("GOOGLE_GENERATIVE_API_KEY")  # API key for Google Generative AI
COLLECTION_NAME = "SoliFood-Embeddings"  # Name of the collection in the database

# Setting up the chromadb client
settings = chromadb.Settings()
settings.allow_reset = True  # Allow resetting the database

client = chromadb.PersistentClient(path=PATH, settings=settings)  # Create a persistent client
gemini_embed = embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key=API_KEY)  # Embedding function using Google Generative AI
collection = client.get_or_create_collection(
    name=COLLECTION_NAME, embedding_function=gemini_embed
)  # Get or create a collection in the database

# Function to add a collection of documents to the database
def add_collection(ids, documents, metadatas):
    collection.add(ids=ids, documents=documents, metadatas=metadatas)
    return collection.count()  # Return the number of documents in the collection

# Function to create a document string from a basket dictionary
def create_doc(basket):
    doc = f""" the title of the product: {basket['title']}.
    it's description: {basket["description"]}.
    it's ingredients: {','.join(basket['ingredients'])}.
    some tags: {','.join(basket['tags'])}.
    """
    return doc

# Function to clean a document string
def clean_doc(doc):
    doc = doc.lower()  # Convert to lowercase
    doc = re.sub("[^A-Za-z0-9]+", " ", doc)  # Remove non-alphanumeric characters
    return doc

# Function to process a single basket dictionary
def process_basket(basket):
    id = basket["id"]
    id = str(id)  # Convert ID to string
    metadata = {
        "available": str(basket["available"]),
        "expiredAt": basket["expiredAt"],
        "createdAt": basket["createdAt"],
        "lon": basket["location"]["lon"],
        "lat": basket["location"]["lat"],
    }  # Create metadata dictionary
    document = create_doc(basket)  # Create document string
    document = clean_doc(document)  # Clean the document string
    return id, document, metadata  # Return the processed data

# Function to process multiple basket dictionaries
def process_baskets(baskets):
    ids = []
    documents = []
    metadatas = []
    for basket in baskets:
        id, document, metadata = process_basket(basket)
        ids.append(id)
        documents.append(document)
        metadatas.append(metadata)
    return ids, documents, metadatas  # Return lists of processed data

# Function to add multiple baskets to the database
def add_baskets(baskets):
    ids, documents, metadatas = process_baskets(baskets)
    return add_collection(ids, documents, metadatas)

# Function to search the collection
def search(query, n_results=3):
    results = collection.query(
        query_texts=query,
        n_results=n_results,
        where={"available": "True"},  # Filter to only include available items
    )

    return results["ids"][0]  # Return the ID of the first result
