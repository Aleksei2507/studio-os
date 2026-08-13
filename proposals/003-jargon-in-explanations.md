# Proposal 003: less technical jargon in explanations to the user

Classification: **Personal** (for now)

## Problem

The user explicitly said dense technical language in explanations got in the way, and asked for simpler writing — clear enough that even a non-technical person could follow.

## Evidence

`.studio/runtime-retrospective.md` (User Feedback, question 2) — a single mention, from one retrospective. Per Evolution's own rule ("if a problem shows up once, it is an observation, not a proposal candidate"), this is not yet a confirmed recurring pattern, just direct feedback from one user.

## Affected Runtime Or Docs

Not the Runtime contracts themselves (`skill/*.md` files are written for an LLM host to consume, not for a non-technical person to read directly) — rather the assistant's communication style with the user in chat: statuses, summaries, explanations of decisions.

## Proposed Change

Do not change Runtime contracts. Recommendation — in communication with this user (and potentially by default), prefer plain wording for statuses/summaries, spell out terms on first use, avoid piling on technical detail where only the outcome matters.

## Expected Effect

Clearer explanations and statuses for the user (and potentially for non-technical colleagues reading the same material).

## Risk Of Change

Low, but there is a trade-off: over-simplifying can hide technical detail the user actually wants to see (for example, when walking through the real bugs found in this same session). Balance by context, not a rigid rule.

## Recommendation

Keep watching — a single data point, which by Evolution's own rules is not Core but one user's personal preference. Worth honoring in communication, but not worth turning into a hard Studio OS rule without confirmation from future retrospectives (including other users/projects).
