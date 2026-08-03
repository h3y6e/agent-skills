# Declarative Style and Test Data

## Array Operations

Write array transformations declaratively using `filter` / `map` / `reduce`. Define predicate functions in the companion object.

```typescript
type Task = ActiveTask | CompletedTask;

const Task = {
  isActive: (task: Task) => task.kind === "Active",
} as const;

// Declarative: intent is clear
const activeTasks = tasks.filter(Task.isActive);

// Imperative: you have to read the loop body to understand the intent
const activeTasks: ActiveTask[] = [];
for (const task of tasks) {
  if (task.kind === "Active") activeTasks.push(task);
}
```

### Don't write redundant `x is Y` annotations

Predicate functions over a discriminated union don't need an explicit `: x is Y` return-type annotation. TypeScript 5.5+ infers the type predicate from any body that narrows on `kind`, and `Array.prototype.filter` consumes the inferred predicate.

```typescript
// ❌ Redundant — the inferred predicate already exists
isActive: (task: Task): task is ActiveTask => task.kind === "Active",

// ✅ Let the compiler infer
isActive: (task: Task) => task.kind === "Active",
```

The same applies to multi-state predicates: bodies built from `||` chains over `kind` or their `!== … && !== …` negation are all inferred correctly.

For partitioning a collection of `Result` values, use `Result.partition` instead of manual loops:

```typescript
const [parsed, invalid] = Result.partition(rows.map(OrderRow.parse));
```

## Type-Safe Test Fixtures with `as const satisfies`

Define test fixtures using `as const satisfies Type`: `as const` preserves discriminant literal types, `satisfies` verifies type compatibility.

```typescript
// ❌ No type checking — typos go unnoticed
const bad = {
  kind: "Waitng", // typo not caught
  // …
} as const;

// ✅ Type-checked + literal types preserved
const waitingRequest = {
  kind: "Waiting",
  requestId: v.parse(RequestId.schema, "550e8400-e29b-41d4-a716-446655440000"),
  passengerId: v.parse(PassengerId.schema, "650e8400-e29b-41d4-a716-446655440001"),
  createdAt: new Date("2026-01-01T00:00:00Z"),
} as const satisfies Waiting;

// waitingRequest.kind is the "Waiting" literal type (not string)
```

Build branded values in fixtures through the companion object's schema (`v.parse`) — the `as` ban applies to test code too, and parsing keeps fixtures honest about what the domain accepts.
