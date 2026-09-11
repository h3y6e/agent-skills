---
name: building-wiki
description: Bootstraps and operates a wiki — cited pages compiled from sources by an agent, plus a short `AGENTS.md` schema for one domain. Use when asked to set up a knowledge base or wiki so findings compound instead of being re-derived per question, to write or audit its schema, or to ingest a source into an existing one, answer a question from it, lint it, or refresh it after a source changed.
license: MIT
metadata:
  author: h3y6e
  version: 2026.9.9
---

# Building a Wiki

Three layers: immutable **sources** the human picks, **pages** the agent writes and maintains, and a **schema** section in the repository's root `AGENTS.md` holding only what is specific to this domain. The human sources, explores, and asks; the agent does the bookkeeping — cross-references, freshness, contradictions.

The format is fixed; the amount of structure is not. Start with the least that answers the questions asked so far; add a page, a type, or a schema line only when its absence caused a wrong answer or a repeated lookup.

Sources sit upstream of the implementation: specifications, decisions, vendor documents, meeting notes. The repository's own code and pull requests are what the wiki informs, never a source — even when the wiki arrives after the code, a page states what the code should do, and a disagreement is a finding about the code.

## When Not To Use

- Retrieval over documents as they stand — RAG and full-text search complement a wiki rather than replace one.
- A single source summarized once, with nothing accumulating.
- Knowledge already held in a machine-readable schema (OpenAPI, Protobuf) — reference it instead.

## Operating an Existing Wiki

Read the repository's `AGENTS.md`, then run the operation — ingest, query, lint, or update — as [`references/operations.md`](references/operations.md) defines it.

## Bootstrapping a Wiki

Follow [`references/bootstrapping.md`](references/bootstrapping.md): interview, lay out the bundle, write the schema, pilot.
