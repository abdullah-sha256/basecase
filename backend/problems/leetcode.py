"""
Fetching problem statements from LeetCode.

LeetCode's public GraphQL endpoint returns a problem's statement (as
HTML) by title slug — which is exactly what Problem.lc_id holds. The
statement is fetched at most once per problem and cached on the model;
grading works without it, so every failure path degrades to None.
"""
import html
import logging
import re

import httpx
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

GRAPHQL_URL = 'https://leetcode.com/graphql'
GRAPHQL_QUERY = (
    'query question($slug: String!) '
    '{ question(titleSlug: $slug) { content } }'
)
FETCH_TIMEOUT_SECONDS = 10
# Statements are prompt context; keep them bounded.
MAX_STATEMENT_CHARS = 8000


def _html_to_text(content):
    """
    Reduce LeetCode's statement HTML to readable plain text.
    """
    # Keep line structure for paragraphs and examples before stripping.
    content = re.sub(r'</(p|pre|li|ul|ol)>', '\n', content)
    content = content.replace('<br>', '\n').replace('<br/>', '\n')
    text = html.unescape(strip_tags(content))
    # Collapse the blank-line runs the tag removal leaves behind.
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return text[:MAX_STATEMENT_CHARS]


def fetch_statement(slug):
    """
    Fetch a problem's statement text from LeetCode by title slug.

    Returns None when the problem is unavailable (paid-only problems
    return null content) or the request fails.
    """
    try:
        response = httpx.post(
            GRAPHQL_URL,
            json={'query': GRAPHQL_QUERY, 'variables': {'slug': slug}},
            timeout=FETCH_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        question = (response.json().get('data') or {}).get('question')
    except (httpx.HTTPError, ValueError):
        logger.warning('LeetCode statement fetch failed for %s', slug)
        return None

    if not question or not question.get('content'):
        return None
    return _html_to_text(question['content'])


def get_statement(problem):
    """
    Return the problem's statement, fetching and caching it on first use.

    Returns None (without caching) when the statement can't be fetched,
    so a later request can retry.
    """
    if problem.statement:
        return problem.statement

    statement = fetch_statement(problem.lc_id)
    if statement:
        problem.statement = statement
        problem.save(update_fields=['statement'])
    return statement
