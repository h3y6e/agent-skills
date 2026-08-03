# Type-Driven Domain Modeling

## Represent State with Discriminated Unions

Define domain entity states using discriminated unions instead of classes. Define each state as its own type and make state-specific properties required.

```typescript
// Good: each state is an independent type; state-specific properties are required
type Waiting = Readonly<{
  kind: "Waiting";
  passengerId: PassengerId;
}>;

type EnRoute = Readonly<{
  kind: "EnRoute";
  passengerId: PassengerId;
  driverId: DriverId;
}>;

type TaxiRequest = Waiting | EnRoute | InTrip | Completed | Cancelled;
```

```typescript
// Bad: cramming all states into one type with optional properties
type TaxiRequest = {
  state: string;
  passengerId: string;
  driverId?: string;    // unclear which state this exists in
  startTime?: Date;     // null checks required everywhere
  endTime?: Date;
};
```

**Rationale:** Optional properties cannot guarantee at compile time which properties exist in which state.

## Use `kind` as the unified discriminant

Use `kind` as the discriminant property name for domain states throughout the entire project. (Errors are the one exception: `TaggedError` discriminates on `_tag` — see [error-handling.md](error-handling.md).)

## Companion Object Pattern

Group a type definition and its related functions under an object of the same name. Branded-type schemas are exposed as a `schema` property on the companion object, not as standalone exports.

```typescript
import * as v from "valibot";

// ❌ Standalone schema export — leaks implementation details
export const ItemIdSchema = v.pipe(v.string(), v.regex(/^item-\d+$/), v.brand("ItemId"));

// ✅ Companion object owns the schema
const ItemIdSchema = v.pipe(v.string(), v.regex(/^item-\d+$/), v.brand("ItemId"));
export type ItemId = v.InferOutput<typeof ItemIdSchema>;

export const ItemId = {
  schema: ItemIdSchema,
  parse: schemaResult(ItemIdSchema), // see boundary-defense.md for schemaResult
} as const;
```

```typescript
type TaxiRequest = Waiting | EnRoute | InTrip | Completed | Cancelled;

const TaxiRequest = {
  assignDriver: (waiting: Waiting, driverId: DriverId): EnRoute => ({
    kind: "EnRoute",
    passengerId: waiting.passengerId,
    driverId,
  }),

  isActive: (request: TaxiRequest) =>
    request.kind !== "Completed" && request.kind !== "Cancelled",
} as const;
```

## Use `type` (not `interface`)

Define domain types with `type` — `interface` declaration merging lets another file silently change the type's shape.

```typescript
// Good
type User = Readonly<{
  id: UserId;
  name: string;
}>;

// Bad: if another file declares `interface User { hashedPassword?: string }`,
// the type changes without you noticing
interface User {
  id: string;
  name: string;
}
```

## Use function property notation (not method notation)

Write functions inside type definitions using function property notation — method notation makes parameter types bivariant.

```typescript
// Good: function property notation — parameters are contravariant
type TaskRepository = {
  save: (task: Task) => Promise<void>;
  findById: (id: TaskId) => Promise<Task | undefined>;
};

// Bad: method notation — parameters become bivariant,
// allowing a narrower implementation like save(task: DoingTask) to pass type checks
type TaskRepository = {
  save(task: Task): Promise<void>;
  findById(id: TaskId): Promise<Task | undefined>;
};
```

## Distinguish meaning with Branded Types

Due to structural subtyping, two `string` values are compatible. Apply branded types to IDs and values with different semantic meanings.

Define brands with `v.brand()` inside `v.pipe()`. The schema output type is automatically branded — `v.parse` / `v.safeParse` output needs no `as` cast.

```typescript
import * as v from "valibot";

const UserIdSchema = v.pipe(v.string(), v.uuid(), v.brand("UserId"));
type UserId = v.InferOutput<typeof UserIdSchema>;

const ProductIdSchema = v.pipe(v.string(), v.uuid(), v.brand("ProductId"));
type ProductId = v.InferOutput<typeof ProductIdSchema>;

// UserId and ProductId are now incompatible even though both wrap string
```

## Ensure immutability with `Readonly<>`

Define domain objects with `Readonly<>`. Express state changes by creating new objects.

## File structure: one concept per file

Place each domain concept (type + companion object) in its own dedicated file. Catch-all files like `types.ts` or `models.ts` are prohibited — they separate types from behavior and cause circular dependencies.

```text
// ❌ Types aggregated in types.ts, companions in separate files
// types.ts — ItemId, ItemType, Status, Priority, Item, Config, ...
// item-id.ts — ItemId companion object (imports type from types.ts)

// ✅ Split files per concept
// item-id.ts — type ItemId + const ItemId (companion)
// item-type.ts — type ItemType + const ItemType (companion)
// status.ts — type Status + const Status (companion)
```

Barrel files (`index.ts`) are for re-exports only.
