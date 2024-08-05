from langchain_community.retrievers import BM25Retriever
from langchain.schema import Document
from typing import List, Tuple
import time

# Create a custom BM25 Retriever,
# in this class we can do search with filtering
class BM25RetrieverWithFiltering(BM25Retriever):
    def _get_relevant_documents(self, query: str):
        # process the query using the implemented preprocess_func by langchain
        processed_query = self.preprocess_func(query)
        # get a list of scores of docs (already stored in self.docs)
        # for example we have 5 docs so scores will be a list of 5 float, len(score) = 5 
        # and the first score is the score of the first doc in self.docs and so on
        scores = self.vectorizer.get_scores(processed_query)
        # zip each doc with it's score in a tuple (doc, score) and store all the tuples in a list
        docs_and_scores = [(doc, score) for doc, score in zip(self.docs, scores)]
        # sort the list by the second item which is the score.
        sorted_docs_and_scores = sorted(docs_and_scores, key=lambda x: x[1], reverse=True)
        # apply the filters on the sorted results and return the k results (k is stored in self.k)
        return self.filter_k_docs(sorted_docs_and_scores)
    
    def filter_k_docs(self, sorted_docs_and_scores: List[Tuple[Document, float]]) -> List[Document]:
        results = []
        # loop over the sorted docs
        for doc_and_score in sorted_docs_and_scores:
            # get only the doc
            doc, _ = doc_and_score
            # apply filtering in the doc
            if self.check_filter(doc):
                results.append(doc)
                # if we have k results exit from the loop
                if len(results) >= self.k:
                    break
        return results
    
    def check_filter(self, doc: Document) -> bool:
        # check if it's available otherwise return false
        if not doc.metadata['availability'] == True:
            return False
        # check if it's blocked otherwise return false
        if not doc.metadata['blocked'] == False:
            return False
        # check if it's soled otherwise return false
        if not doc.metadata['sold'] == False:
            return False
        # check if it's not expired otherwise return false
        if not doc.metadata['expired_at'] > time.time():
            return False
        # it passed all tests (filters) so return true
        return True
