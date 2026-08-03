---
name: functional-domain-modeling
description: Functional domain modeling for server-side TypeScript with better-result and valibot — discriminated unions, pure state transitions, TaggedError-based Result handling, schema-validated boundaries, and PII protection. Use when writing TypeScript domain models, use cases, repositories, state transitions, error handling, boundary validation, or PII handling on the server side, or designing types for business logic. Skip for frontend components, build tooling, and code unrelated to domain logic.
license: MIT
metadata:
  author: h3y6e
  version: 2026.7.1
---

# Functional Domain Modeling in TypeScript

Robust server-side TypeScript design with [better-result](https://github.com/dmmulroy/better-result) (`Result`, `TaggedError`) and [valibot](https://valibot.dev) (schemas, branded types).

## Invariants

Apply these throughout:

- Model each entity state as its own `Readonly<>` type; discriminate with `kind` project-wide.
- Define domain types with `type`, never `interface`; write functions in type definitions with function property notation (`save: (t: Task) => Promise<void>`).
- Express state transitions as pure functions whose argument types constrain valid source states and whose return types name the target state. Invalid transitions must be compile errors.
- Errors are values: domain code returns `Result<T, E>` and never throws. Define each known failure as a `TaggedError` class; reserve `panic` for violated invariants and programmer mistakes.
- Compose fallible steps with `Result.gen` by default; use a lone combinator only for a single transform. Avoid long combinator chains.
- Validate every external input (API request, DB row, env var, file, queue message) with a valibot schema at the boundary; trust types inside the domain — do not re-validate.
- `as` is banned except `as const` and `as const satisfies T`. When a value's type is unknown, parse it through a schema. Brand IDs with `v.brand` so no cast is ever needed.

## Topics

Read only the reference file(s) relevant to the current task.

| Task involves | Read |
| --- | --- |
| Entity types, branded IDs, companion objects, file layout | [references/domain-modeling.md](references/domain-modeling.md) |
| State transitions, domain events, repository interfaces | [references/state-modeling.md](references/state-modeling.md) |
| TaggedError design, Result composition, HTTP error mapping | [references/error-handling.md](references/error-handling.md) |
| Parsing external input, schema→Result factory, PII protection | [references/boundary-defense.md](references/boundary-defense.md) |
| Collection operations, test fixtures | [references/style-and-testing.md](references/style-and-testing.md) |
| Setting up lint enforcement (oxlint) | [references/linting.md](references/linting.md) |
