from langchain.schema import Document
from typing import List, Dict, Tuple

def transform_basket(i, basket: Dict) -> Document:
    page_content = f"The title of the basket is: {basket['title']}\n\n"
    page_content += f"The description of the basket is: {basket['description']}\n\n"
    page_content += f"The ingredients of the basket are: {", ".join(basket['ingredients'])}\n\n"
    page_content += f"The tags and keywords of the basket are: {", ".join(basket['tags'])}."
    new_basket = Document(page_content=page_content, metadata={"id": f"{i}"})
    return new_basket

def preprocessing_pipeline(baskets: List[Dict]) -> Tuple[List[str], List[Document]]:
    ids = []
    new_baskets = []
    for i, basket in enumerate(baskets):
        ids.append(str(i))
        new_baskets.append(transform_basket(i, basket))
    return ids, new_baskets