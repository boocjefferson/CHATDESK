"""
Placeholder for Jefferson's OpenAI intent classification
(feature/openai-intent-classification, feature/taglish-prompt-engineering).
Replace classify_message() with the real implementation - everything else
in this app is built against this return shape.
"""


def classify_message(message: str) -> dict:
    return {
        "detected_intent": "unresolved_complex_query",
        "reply": (
            "I'm sorry, I couldn't find the exact procedure for that. "
            "I have automatically created a support ticket for you. "
            "An OSA staff member will review your concern shortly."
        ),
    }