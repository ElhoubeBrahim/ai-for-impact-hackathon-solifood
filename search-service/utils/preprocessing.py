from langchain.schema import Document
from typing import List, Dict, Tuple
import spacy
import re

def clean_text(text: str) -> str:
    # Replace newlines with a unique token
    text = text.replace('\n\n', ' doubleline ')
    # Remove punctuation, special characters
    cleaned_text = re.sub(r'[^\w\s]', " ", text)
    # Remove digits
    cleaned_text = re.sub(r'\d', " ", cleaned_text)
    # Convert to lowercase
    cleaned_text = cleaned_text.lower()
    # Remove extra white spaces
    cleaned_text = re.sub(r'\s+', " ", cleaned_text)

    nlp = spacy.load("en_core_web_sm")
    doc = nlp(cleaned_text)
    
    # Do lemmatization and remove stop words
    cleaned_text = " ".join([token.lemma_ for token in doc if not token.is_stop])

    # restore the double new line
    cleaned_text = cleaned_text.replace(' doubleline ', '\n\n')
    return cleaned_text

def transform_basket(i, basket: Dict) -> Document:
    page_content = f"The title of the basket is: {basket['title']}\n\n"
    page_content += f"The description of the basket is: {basket['description']}\n\n"
    page_content += f"The ingredients of the basket are: {", ".join(basket['ingredients'])}\n\n"
    page_content += f"The tags and keywords of the basket are: {", ".join(basket['tags'])}."
    cleaned_page_content = clean_text(page_content)
    new_basket = Document(page_content=cleaned_page_content, metadata={"id": f"{i}"})
    print(new_basket.page_content)
    return new_basket

def preprocessing_pipeline(baskets: List[Dict]) -> Tuple[List[str], List[Document]]:
    ids = []
    new_baskets = []
    for i, basket in enumerate(baskets):
        ids.append(str(i))
        new_baskets.append(transform_basket(i, basket))
    return ids, new_baskets
