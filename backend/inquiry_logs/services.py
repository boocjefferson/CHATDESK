"""
OpenAI-based intent classification against the tbl_faqs knowledge base.
Per claude/PROJECT CONTEXT.md, the AI is strictly an intent classifier and
router, not an open-ended conversational AI: the model only ever picks an
intent_keyword out of what's already in the database (or null), it never
writes the reply text itself - that's always the FAQ's own answer_content.
"""

import json

from django.conf import settings
from openai import OpenAI

from faqs.models import Faq

MODEL = "gpt-5.6-luna"

ESCALATION_REPLY = (
    "I'm sorry, I couldn't find the exact procedure for that. "
    "I have automatically created a support ticket for you. "
    "An OSA staff member will review your concern shortly."
)

ESCALATION_RESULT = {"detected_intent": "unresolved_complex_query", "reply": ESCALATION_REPLY}

SYSTEM_PROMPT_TEMPLATE = """You are an intent classification system for ChatDesk, an AI assistant for the \
University of Science and Technology of Southern Philippines (USTP) Office of Student Affairs (OSA).

Your ONLY job is to match a student's message to one of the FAQ intents listed below, or determine that \
none of them apply. You are strictly an intent classifier and router - never answer questions yourself, \
never hold an open-ended conversation, never explain anything beyond picking an intent.

Students may write in English, Tagalog, or Taglish (mixed Tagalog-English). Understand their intent \
regardless of language or spelling variations.

Available FAQ intents:
{faq_list}

Match the student's message to the single best-fitting intent_keyword ONLY if it clearly and confidently \
corresponds to what they're asking. If the message is ambiguous, unrelated to student affairs, or does not \
clearly match any listed intent, return null - never guess."""

_client = OpenAI(api_key=settings.OPENAI_API_KEY)


def classify_message(message: str) -> dict:
    faqs_by_keyword = {faq.intent_keyword: faq for faq in Faq.objects.all()}
    if not faqs_by_keyword:
        return ESCALATION_RESULT

    faq_list = "\n".join(
        f"- {faq.intent_keyword}: {faq.question_text} (category: {faq.category})"
        for faq in faqs_by_keyword.values()
    )

    try:
        response = _client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_TEMPLATE.format(faq_list=faq_list)},
                {"role": "user", "content": message},
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "faq_intent_match",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "matched_intent_keyword": {
                                "anyOf": [
                                    {"type": "string", "enum": list(faqs_by_keyword.keys())},
                                    {"type": "null"},
                                ]
                            }
                        },
                        "required": ["matched_intent_keyword"],
                        "additionalProperties": False,
                    },
                },
            },
        )
        matched_keyword = json.loads(response.choices[0].message.content)["matched_intent_keyword"]
    except Exception:
        # Any failure (network, auth, rate limit, malformed response) falls back to
        # escalation rather than 500ing - no student query should go unanswered.
        matched_keyword = None

    matched_faq = faqs_by_keyword.get(matched_keyword)
    if matched_faq is None:
        return ESCALATION_RESULT

    return {"detected_intent": matched_faq.intent_keyword, "reply": matched_faq.answer_content}
