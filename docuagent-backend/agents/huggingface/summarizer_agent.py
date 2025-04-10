from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def run(document_text: str) -> str:
    chunks = [document_text[i:i+1024] for i in range(0, len(document_text), 1024)]
    summaries = [summarizer(chunk, max_length=130, min_length=30, do_sample=False)[0]['summary_text'] for chunk in chunks]
    return "\n".join(summaries)
