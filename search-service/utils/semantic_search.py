from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.retrievers import ParentDocumentRetriever, EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain.storage._lc_store import create_kv_docstore
from langchain.storage import LocalFileStore
from langchain_chroma import Chroma
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from utils.preprocessing import preprocessing_pipeline
from dotenv import load_dotenv
from typing import List, Dict
import os

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
        print(e)
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
    # try:
        # get the dense retriever
        chroma_retriever = get_vectorstore().as_retriever(search_kwargs={'k':k})
        # get the data from loacl_docstore
        print(k//2)
        baskets = chroma_retriever.vectorstore.get()
        # store it in the bm25 retriever
        bm25_retriver = BM25Retriever.from_texts(texts=baskets['documents'], metadatas=baskets['metadatas'])
        bm25_retriver.k = k
        hybride_retriever = EnsembleRetriever(retrievers=[chroma_retriever, bm25_retriver], weights=[0.50, 0.50])
        res = hybride_retriever.invoke(query)
        # print(res)
        ids = [{"id": int(item.metadata['id']), "content": item.page_content} for item in res]
        # ids = [int(res[i].metadata['id']) for i in range(k)]
        return ids
    # except:
    #     return False
