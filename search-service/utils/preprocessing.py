from langchain.schema import Document
from typing import List, Dict, Tuple
import re

def clean_text(text: str) -> str:
    # Replace newlines with a unique token
    # text = text.replace('\n\n', ' doubleline ')
    # Remove punctuation, special characters
    cleaned_text = re.sub(r'[^\w\s]', " ", text)
    # Remove digits
    cleaned_text = re.sub(r'\d', " ", cleaned_text)
    # Convert to lowercase
    cleaned_text = cleaned_text.lower()
    # Remove extra white spaces
    cleaned_text = re.sub(r'\s+', " ", cleaned_text)
    # # restore the double new line
    # cleaned_text = cleaned_text.replace(' doubleline ', '\n\n')
    return cleaned_text

def transform_basket(basket: Dict) -> Document:
    page_content = f"The title of the basket is: {basket['title']}\n\n"
    page_content += f"The description of the basket is: {basket['description']}\n\n"
    page_content += f"The ingredients of the basket are: {", ".join(basket['ingredients'])}\n\n"
    page_content += f"The tags and keywords of the basket are: {", ".join(basket['tags'])}."
    cleaned_page_content = clean_text(page_content)
    metadata = {
        "id": basket['id'],
        "user_id": basket.get('user_id', False),
        "availability": basket.get('available', True),
        "blocked": basket.get('blocked', False),
        "expired_at": basket.get('expiredAt', 0),
        "sold": basket.get('sold', False)
    }
    new_basket = Document(page_content=cleaned_page_content, metadata=metadata)
    return new_basket

def preprocessing_pipeline(baskets: List[Dict]) -> Tuple[List[str], List[Document]]:
    ids = []
    cleaned_baskets = []
    for basket in baskets:
        ids.append(str(basket['id']))
        cleaned_baskets.append(transform_basket(basket))
    return ids, cleaned_baskets
