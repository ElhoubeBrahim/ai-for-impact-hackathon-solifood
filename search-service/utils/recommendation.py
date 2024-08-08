from utils.semantic_search import get_vectorstore
from langchain.schema import Document
import time
import random

# assign to the basket with id the user_id that buys it, and make it as sold and update the vectordb
def buy_basket(id: int, user_id: int) -> bool:
    vector_store = get_vectorstore()
    doc = vector_store.get(str(id))
    page_content, metadata = doc['documents'][0], doc['metadatas']
    metadata[0]['user_id'], metadata[0]['sold'] = user_id, True
    updated_doc = Document(page_content=page_content, metadata=metadata[0])
    try:
        vector_store.update_document(str(id), updated_doc)
        return True
    except Exception as e:
        return False

#  Recommend a list of items for a given user based on their previous interactions.
def recommendation(user_id: int, k: int = 4):
    vector_store = get_vectorstore()
    user_docs = vector_store.get(where={"user_id": user_id})
    if len(user_docs['ids']) == 0:
        return False
    page_contents = [doc for doc in user_docs['documents']]
    ids = [int(id) for id in user_docs['ids']]
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
            },
            {
                "id": {
                    "$nin": ids
                }
            }
        ]
    }
    retriever = vector_store.as_retriever(search_kwargs={"k":k, "filter":filter})
    ids = []
    for page_content in page_contents:
        results = retriever.invoke(page_content)
        for doc in results:
            ids.append(doc.metadata['id'])
    ids = list(set(ids))
    random.shuffle(ids)
    return ids[:k]