# Studio Assessment

Read this reference before issuing a Studio Assessment outcome.

## Purpose

Decide whether available product evidence supports moving into Planning.

Studio Assessment is a recommendation, not an automatic product decision.

## Criteria

Assess only criteria relevant to the project:

- Problem Evidence: is the problem concrete and meaningful?
- Target User: is the primary user sufficiently defined?
- Product Value: does the proposed outcome improve the user's situation?
- Alternatives: what does the user do today?
- Differentiation: why might the product be chosen over alternatives?
- Constraints: are legal, domain, trust, data, or operational constraints understood?
- Product Feasibility: is there a plausible product boundary without selecting architecture?
- Evidence Quality: which claims are facts, inference, assumptions, or unknowns?

Do not invent a numeric score. Use Strong, Mixed, Weak, or Unknown evidence with explanation.

## Outcomes

### Go

Use when evidence supports a bounded product direction and remaining uncertainty can be handled during Planning or Architecture.

### Revise

Use when the problem remains meaningful but user, value, positioning, or scope should change before Planning.

### More Research

Use when a material decision depends on external evidence that is missing, stale, or contradictory.

State the exact Research Questions required.

### No-Go

Use when available evidence shows that the proposed direction does not solve the stated problem, violates a hard constraint, duplicates an adequate alternative without differentiation, or cannot responsibly proceed within accepted boundaries.

No-Go rejects the current direction, not the user or their ability to build another version.

## Brownfield Rule

For an operating product, assess the proposed change or development direction:

- Go: proceed with this development direction.
- Revise: change scope or expected behavior.
- More Research: investigate before changing the product.
- No-Go: do not pursue this change under current evidence or constraints.

Do not reframe Brownfield as a new MVP.

## Required Presentation

```md
## Studio Assessment

Outcome: Go | Revise | More Research | No-Go
Confidence: High | Medium | Low

### Evidence
- Strong:
- Mixed:
- Weak or Unknown:

### Recommendation

### What Would Change The Decision
```

## Scope Options

When outcome is Go or Revise, present at most three meaningful boundaries:

- Recommended boundary;
- Reduced boundary when it materially lowers risk;
- Deferred expansion.

Do not turn scope options into implementation estimates. Delivery estimation belongs to Architecture.
