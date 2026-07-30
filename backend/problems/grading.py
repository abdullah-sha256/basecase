"""
AI-assisted attempt grading.

Sends the user's pasted solution to Claude and gets back a suggested
rubric outcome plus a short critique. The suggestion is advisory: the
final score is always computed server-side from the rubric the user
submits (see srs.compute_score), so the LLM never sits in the scoring
hot path.
"""
import os
from typing import Literal

from pydantic import BaseModel

from . import leetcode

GRADER_MODEL = os.environ.get('BASECASE_GRADER_MODEL', 'claude-haiku-4-5')

SYSTEM_PROMPT = (
    "You are a strict but encouraging technical-interview coach grading a "
    "user's LeetCode practice attempt. Evaluate the solution they pasted "
    "against the problem statement when it is provided (otherwise against "
    "the well-known problem of that name): correctness first — including "
    "the stated constraints and edge cases — then approach and time/space "
    "complexity relative to the optimal solution. Choose one outcome: "
    "'clean' (correct and a reasonable approach), 'hints' (mostly correct "
    "but with meaningful flaws, or it reads like it leaned on the "
    "editorial), 'partial' (incomplete or incorrect but real progress), "
    "'failed' (not a serious attempt or fundamentally wrong). Keep the "
    "feedback to 2-3 sentences: what's good, the main gap, and one "
    "concrete improvement. If the pasted text is not code or is unrelated "
    "to the problem, choose 'failed' and say why."
)


class GradeSuggestion(BaseModel):
    outcome: Literal['clean', 'hints', 'partial', 'failed']
    feedback: str


def is_available():
    """
    AI grading is enabled when Anthropic credentials are present in the
    backend environment.
    """
    return bool(
        os.environ.get('ANTHROPIC_API_KEY')
        or os.environ.get('ANTHROPIC_AUTH_TOKEN')
    )


def build_user_message(problem, code, notes='', statement=None):
    """
    Assemble the grading prompt for a problem and pasted solution.
    """
    user_message = (
        f"Problem: {problem.name} (LeetCode slug: {problem.lc_id})\n"
        f"Difficulty: {problem.difficulty}\n"
        f"Category: {problem.get_category_display()}\n"
    )
    if statement:
        user_message += f"\nProblem statement:\n{statement}\n"
    user_message += f"\nThe user's solution:\n```\n{code}\n```\n"
    if notes:
        user_message += f"\nThe user's notes about their attempt:\n{notes}\n"
    return user_message


def grade_solution(problem, code, notes=''):
    """
    Ask Claude to grade a pasted solution. Returns a GradeSuggestion.

    The problem's statement is fetched from LeetCode (and cached) so the
    grader judges against the real requirements; grading proceeds
    without it if the fetch fails.

    Raises anthropic errors on API failure; callers translate those into
    HTTP responses.
    """
    import anthropic

    client = anthropic.Anthropic()
    statement = leetcode.get_statement(problem)

    response = client.messages.parse(
        model=GRADER_MODEL,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": build_user_message(problem, code, notes, statement),
        }],
        output_format=GradeSuggestion,
    )
    return response.parsed_output
