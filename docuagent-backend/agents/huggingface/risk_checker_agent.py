from transformers import pipeline

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def run(document_text: str) -> str:
    labels = ["legal risk", "privacy violation", "ethical concern", "safe"]
    result = classifier(document_text, candidate_labels=labels)

    risks = [label for label, score in zip(result['labels'], result['scores']) if score > 0.4 and label != "safe"]

    return "- " + "\n- ".join(risks) if risks else "No issues found"
