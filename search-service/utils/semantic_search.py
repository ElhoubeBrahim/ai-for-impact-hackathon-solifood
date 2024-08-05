from langchain.retrievers import  EnsembleRetriever
from langchain_chroma import Chroma
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from langchain.schema import Document
from utils.preprocessing import preprocessing_pipeline
from utils.BM25RetrieverWithFiltering import BM25RetrieverWithFiltering
from dotenv import load_dotenv
from typing import List, Dict
import os
import time
load_dotenv()

COLLECTION_NAME = "Solifood_collection"
VECTOR_DB = "./search-service/vector_db"
EMBEDDING_MODEL = "nvidia/nv-embed-v1"


    
def get_vectorstore():

    embeddings = NVIDIAEmbeddings(
        api_key = os.getenv("NVIDIA_API_KEY"),
        model=EMBEDDING_MODEL
    )

    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        persist_directory=VECTOR_DB,
        embedding_function=embeddings,
    )

    return vector_store


def add_baskets(baskets: List[Dict]) -> bool:
    vector_store = get_vectorstore()
    ids, baskets = preprocessing_pipeline(baskets)
    try:
        vector_store.add_documents(ids=ids, documents=baskets)
        return True
    except Exception as e:
        return False
    
def edit_document(basket: List[Dict]) -> bool:
    ids, basket_doc = preprocessing_pipeline(basket)
    vector_store = get_vectorstore()
    vector_store.update_document(ids[0], basket_doc[0])
    return True


def delete_basket(id: int) -> bool:
    vectorstore = get_vectorstore()
    ids = [str(id)]
    try:
        vectorstore.delete(ids)
        return True
    except:
        return False


def search(query: str, k: int) -> List[id] | False:
    filter = {
        "$and": [
            {
                "blocked": {
                    "$eq": False
                }
            },
            {
                "availability": {
                    "$eq": True
                }
            },
            {
                "expired_at": {
                    "$gt": time.time()
                }
            },
            {
                "sold": {
                    "$eq": False
                }
            }
        ]
    }
    try:
        # get the dense retriever
        chroma_retriever = get_vectorstore().as_retriever(search_kwargs={'k':k, 'filter': filter})
        # get the data from loacl_docstore
        baskets = chroma_retriever.vectorstore.get()
        # store it in the bm25 retriever
        bm25_retriver = BM25RetrieverWithFiltering.from_texts(texts=baskets['documents'], metadatas=baskets['metadatas'])
        # assing the number of returned results: k
        bm25_retriver.k = k
        hybride_retriever = EnsembleRetriever(retrievers=[chroma_retriever, bm25_retriver], weights=[0.50, 0.50])
        # get the results
        res = hybride_retriever.invoke(query)
        # get the list of results' ids 
        ids = [int(res[i].metadata['id']) for i in range(k)]
        return ids
    except:
        return False

def recommendation(retriever, query):
    pass