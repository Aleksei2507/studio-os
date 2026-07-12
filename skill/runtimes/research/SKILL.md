---
name: research
description: Investigate current market, competitor, domain, regulatory, monetization, or technical evidence that may change a Studio OS product decision. Use conditionally from Greenfield or Brownfield workflows, or as the execution stage of a Research Work Item.
---

# Research Runtime

> Runtime for turning bounded external questions into decision-ready evidence.

## Metadata

Stage: Research

Version: 1.0

Optional: Conditional in product workflows, required in `work-item-research`

Requires Confirmation: Yes before applying findings to accepted product decisions

Creates:

- `docs/research-summary.md` for project research;
- `work-items/<id>/research-summary.md` for a bounded Research Work Item.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage: Briefing or the Runtime that requested research

## Goal

Answer external questions that materially affect whether, what, or how the product should be built.

Research must produce evidence, uncertainty, and decision impact. It must not produce a decorative competitor list or repeat model memory as current fact.

## Required Capabilities

- `external-research`

Load `skill/capabilities/external-research.md` before gathering external evidence.

If current external sources cannot be accessed, stop or explicitly limit the output to project evidence. Do not fabricate current research.

## Inputs

Read:

- selected workflow;
- `.studio/project-state.md`;
- `.studio/active-context.md`;
- `docs/discovery-summary.md` when available;
- active Brief path when research is requested after Briefing;
- Work Item request when running `work-item-research`;
- explicit Research Questions from the requesting Runtime.

## Entry Gate

Before researching, define:

- the decision research should influence;
- one or more bounded questions;
- what evidence could change the decision;
- relevant geography, audience, time horizon, and constraints;
- stop condition for sufficient evidence.

If no product decision can change, do not run Research. Return the question to the requesting Runtime.

Ask one focused clarification question only when missing scope would materially change sources or conclusions.

## Research Scope

Select only relevant research modes:

- Market and target segment;
- Competitors, substitutes, and current alternatives;
- Domain practices and standards;
- Legal or regulatory constraints;
- Pricing or monetization assumptions;
- Technical feasibility or ecosystem evidence.

Do not expand into unrelated modes merely to make the report look complete.

## Procedure

1. Convert each Research Question into an evidence requirement.
2. Identify appropriate primary and independent sources.
3. Gather current evidence and record access dates.
4. Triangulate material claims when practical.
5. Compare source publication date with the date the data or event applies to.
6. Classify each conclusion as Fact, Inference, Assumption, or Unknown.
7. Analyze contradictions and evidence gaps.
8. Explain how findings affect the pending product decision.
9. Recommend Confirm, Revise, More Research, or Reject Assumption.

## Competitor And Alternative Analysis

Consider:

- direct competitors solving the same problem for the same segment;
- indirect competitors solving the problem differently;
- substitutes, including manual work, spreadsheets, agencies, and doing nothing;
- adjacent products that may shape user expectations.

Compare only dimensions relevant to the product problem. Do not rank competitors from unsupported popularity assumptions.

## Market And Niche Analysis

Describe:

- target segment;
- observable problem evidence;
- current alternatives;
- switching barriers;
- possible differentiation;
- evidence strength.

Do not invent market size, growth rate, pricing, or demand. Use ranges only when supported and cite the underlying methodology.

## Conditional References

Read `references/source-quality.md` when selecting or reconciling sources.

Read `references/patterns.md` for competitor, niche, and decision-impact structures.

Read `references/anti-patterns.md` when evidence is sparse, contradictory, or likely to encourage unsupported conclusions.

## Conversation Rules

- Explain the bounded research plan briefly before a broad investigation.
- Do not ask the user to perform research that available capabilities can perform.
- Ask the user for domain evidence only when they are the source or owner of that evidence.
- Make reasoning visible through evidence and criteria, not hidden chain-of-thought.
- Preserve Project Language in the artifact.

## Output

Create the appropriate Research Summary with:

- Decision Context;
- Research Scope;
- Research Questions;
- Method and Limitations;
- Sources and Access Dates;
- Findings;
- Competitors and Alternatives when relevant;
- Target Segment and Niche when relevant;
- Domain, Regulatory, Pricing, or Technical Findings when relevant;
- Facts;
- Inferences;
- Assumptions;
- Unknowns and Contradictions;
- Decision Impact;
- Recommendation;
- Confidence.

Use `templates/research-summary.md` as the output structure.

Use direct links near material claims and a compact source list. Do not pad the report with irrelevant sources.

## Recommendation Outcomes

- Confirm: evidence supports the current assumption or direction.
- Revise: evidence supports a materially different direction.
- More Research: evidence is insufficient for a responsible decision.
- Reject Assumption: available evidence contradicts the assumption.

Research recommends. The user confirms product changes through Briefing or the requesting Runtime.

## Project Memory Update

Update Active Context with:

- reference to the Research Summary;
- decision affected;
- strongest findings;
- important uncertainty;
- recommended next Runtime.

Do not copy the full report into Active Context.

Preserve Mode, Workflow, Work Type, and Project Language.

## Handoff

Pass:

- answered and unanswered questions;
- material evidence;
- contradictions;
- recommendation and confidence;
- product decisions that require confirmation.

## Forbidden

Research must not:

- present model memory as current external evidence;
- fabricate competitors, citations, market size, pricing, or regulation;
- use language-specific phrase matching as evidence;
- choose product scope or architecture by itself;
- hide weak or contradictory evidence;
- start Development from a research recommendation;
- change accepted artifacts without confirmation.

## Completion Checklist

- decision context explicit;
- questions bounded;
- current sources cited;
- facts separated from inference and assumptions;
- alternatives considered where relevant;
- limitations recorded;
- decision impact explained;
- artifact and Project Memory updated.

## Stop Condition

Stop after the Research Summary and memory update are complete. Recommend the requesting Runtime and wait for confirmation before applying product changes.
