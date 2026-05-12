# Adoption Rubric

Use this when evaluating external or reference skills before adoption, adaptation, or rejection.

## Gate

Adopt only for a recurring, near-term task. If an existing local/adopted skill already covers the need, prefer using or improving it. Record rejection reasons so the same candidate is not re-evaluated later.

## Axes

| Axis | Question |
| --- | --- |
| Fit | Does the description match the actual task and user intent? |
| Non-redundancy | Does it provide value not already covered by installed or repo-local skills? |
| Compatibility | Does it avoid unavailable tools, private conventions, fixed paths, or lifecycle assumptions? |
| Quality | Does it have clear when-not-to-use, concrete workflow, output contract, and validation story? |
| Footprint | Is the context cost justified, with heavy detail demand-loaded? |
| Maintenance | Is upstream recent enough or easy to fork safely? |
| License | Is reuse allowed for the target repository? |

## Process

1. Check existing catalog/adopted/repo-local skills first.
2. Evaluate candidates top-down from trusted or curated sources before broad search.
3. For close-but-not-quite candidates, prefer `absorb` or `adapt` over call-site workarounds.
4. Pin or snapshot the exact source evaluated when adopting externally.
5. Use empirical validation for high-impact or ambiguous candidates.

## Red Flags

- adopting because the title matches while the trigger does not
- "just in case" installation
- floating refs for production use
- no license or unclear provenance
- broad setup/router skill with little standalone value
- re-evaluating a previously rejected candidate without new evidence
