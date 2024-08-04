from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage._lc_store import create_kv_docstore
from langchain.storage import LocalFileStore
from langchain_chroma import Chroma
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from utils.preprocessing import preprocessing_pipeline, transform_basket
from dotenv import load_dotenv
from typing import List, Dict
import os

load_dotenv()

COLLECTION_NAME = "Solifood_collection"
LOCAL_STORE = "./search-service/loacal_docstore"
VECTOR_DB = "./search-service/vector_db"
EMBEDDING_MODEL = "NV-Embed-QA"


def get_retriever():
    local_store = LocalFileStore(LOCAL_STORE)
    store = create_kv_docstore(local_store)

    embeddings = NVIDIAEmbeddings(
        model=EMBEDDING_MODEL, nvidia_api_key=os.getenv("NVIDIA_API_KEY")
    )

    child_splitter = RecursiveCharacterTextSplitter(
        chunk_size=200, chunk_overlap=50, length_function=len
    )

    vectore_store = Chroma(
        collection_name=COLLECTION_NAME,
        persist_directory=VECTOR_DB,
        embedding_function=embeddings,
    )

    retiever = ParentDocumentRetriever(
        child_splitter=child_splitter, docstore=store, vectorstore=vectore_store, search_kwargs={"k": 20}
    )
    return retiever


def add_baskets(baskets: List[Dict]) -> bool:
    retriever = get_retriever()
    ids, baskets = preprocessing_pipeline(baskets)
    try:
        retriever.add_documents(ids=ids, documents=baskets)
        return True
    except:
        return False

def delete_basket(id: int) -> bool:
    retriver = get_retriever()
    ids = [str(id)]
    try:
        retriver.vectorstore.delete(ids)
        retriver.docstore.mdelete(ids)
        return True
    except:
        return False

def search(query: str) -> List[id] | False:
    try:
        retriever = get_retriever()
        res = retriever.invoke(query)
        ids = [int(item.metadata['id']) for item in res]
        return ids
    except:
        return None
