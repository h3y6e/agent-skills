# Boundary Defense with valibot

## Why Types Alone Are Not Enough

TypeScript's types are erased at compile time; the correctness of externally incoming data cannot be guaranteed by types alone. Structural subtyping also lets objects with extra properties pass narrower type checks — a source of unintended data leakage.

```typescript
type LogPayload = { id: string; role: string };
const user = { id: "1", role: "admin", email: "secret@example.com" };

// Passes type check, but email is included in the log
console.log(JSON.stringify(user satisfies LogPayload));
```

## Schema-Based Validation

At external boundaries (API requests, DB results, environment variables, file reads, queue messages), parse with a valibot schema at runtime.

```typescript
import * as v from "valibot";

const CreateRequestInput = v.object({
  passengerId: v.pipe(v.string(), v.uuid()),
  pickupLocation: v.object({
    lat: v.pipe(v.number(), v.minValue(-90), v.maxValue(90)),
    lng: v.pipe(v.number(), v.minValue(-180), v.maxValue(180)),
  }),
});

type CreateRequestInput = v.InferOutput<typeof CreateRequestInput>;
```

## Schema Factory: Validation → Result Conversion

`v.parse` throws; use `v.safeParse` and convert to `Result` for Railway Oriented Programming. Do not hand-write this conversion per schema — define one factory and reuse it project-wide.

```typescript
import * as v from "valibot";
import { Result, TaggedError } from "better-result";

export class ValidationError extends TaggedError("ValidationError")<{
  issues: ReadonlyArray<v.BaseIssue<unknown>>;
  message: string;
}> {
  constructor(issues: ReadonlyArray<v.BaseIssue<unknown>>) {
    super({ issues, message: "Input failed schema validation" });
  }
}

export const schemaResult =
  <T>(schema: v.GenericSchema<unknown, T>) =>
  (raw: unknown): Result<T, ValidationError> => {
    const parsed = v.safeParse(schema, raw);
    return parsed.success
      ? Result.ok(parsed.output)
      : Result.err(new ValidationError(parsed.issues));
  };
```

Combine with the companion object pattern to expose the schema and `parse` together:

```typescript
const RequestIdSchema = v.pipe(v.string(), v.uuid(), v.brand("RequestId"));
export type RequestId = v.InferOutput<typeof RequestIdSchema>;

export const RequestId = {
  schema: RequestIdSchema,
  parse: schemaResult(RequestIdSchema),
} as const;

// Usage
const id = RequestId.parse(raw); // Result<RequestId, ValidationError>
```

When a `Result` itself crosses a serialized or untrusted boundary (HTTP response envelope, queue payload, cache), define an explicit wire contract with `Result.codec`, passing valibot schemas for the four directions (`serialize`/`deserialize` × `ok`/`err`). Expose only stable public codes and safe fields in wire errors.

## Banning Type Assertions (`as`)

`as` bypasses type checking. The only permitted forms are `as const` and `as const satisfies T` — every other `as` is prohibited.

When the value's type is unknown to the compiler (external input, raw data, runtime-shaped objects), the answer is **always to parse it through a schema**. Asserting a type does not give you the guarantees the type claims; parsing does.

```typescript
// ❌ as bypasses validation — the type is a lie if data doesn't match
const user = data as User;

// ✅ Schema parse produces a real User
const user = v.parse(UserSchema, data);
```

For branded types, `v.brand()` inside `v.pipe()` makes the parse output automatically branded, eliminating the need for `as` entirely.

```typescript
// ❌ Manual brand + as cast
type ItemId = string & { readonly __brand: unique symbol };
const parse = (raw: string): ItemId => v.parse(v.string(), raw) as ItemId;

// ✅ v.brand() — parse output is already ItemId
const ItemIdSchema = v.pipe(v.string(), v.regex(/^item-\d+$/), v.brand("ItemId"));
type ItemId = v.InferOutput<typeof ItemIdSchema>;
```

## PII Protection with the Sensitive Type

TypeScript types are erased at runtime, so marking something as PII in the type system does not prevent leakage via `JSON.stringify` or `console.log`. Enclose the value in a closure and mask it during serialization.

```typescript
type Sensitive<T> = Readonly<{
  unwrap: () => T;
  toJSON: () => string;
  toString: () => string;
}>;

const Sensitive = {
  of: <T>(value: T): Sensitive<T> => ({
    unwrap: () => value,
    toJSON: () => "[REDACTED]",
    toString: () => "[REDACTED]",
    [Symbol.for("nodejs.util.inspect.custom")]: () => "[REDACTED]",
  }),
} as const;
```

Auto-wrap PII fields at parse time with `v.transform`:

```typescript
const sensitiveString = v.pipe(v.string(), v.transform(Sensitive.of));

const PatientSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: sensitiveString,
  email: sensitiveString,
  diagnosis: sensitiveString,
  role: v.string(), // not PII
});

const patient = v.parse(PatientSchema, rawData);
console.log(JSON.stringify(patient));
// {"id":"…","name":"[REDACTED]","email":"[REDACTED]","diagnosis":"[REDACTED]","role":"doctor"}

// Access the actual value only when explicitly needed
const actualEmail = patient.email.unwrap();
```

### Defense in Depth: Logger Redaction

As a backup for missed `Sensitive` applications, also configure redaction at the logger level.

```typescript
import pino from "pino";

const logger = pino({
  redact: {
    paths: ["email", "*.email", "password", "*.password", "name", "*.name"],
    censor: "[REDACTED]",
  },
});
```

## Do Not Over-Defend Inside the Domain

Data validated at the external boundary must not be re-validated inside the domain layer. Trust the types.

```typescript
// Bad: redundant checks — the types already guarantee these
const assignDriver = (waiting: Waiting, driverId: DriverId): EnRoute => {
  if (waiting.kind !== "Waiting") throw new Error("Invalid state");
  if (!driverId) throw new Error("Missing driverId");
  return { kind: "EnRoute", passengerId: waiting.passengerId, driverId };
};

// Good: trust the types
const assignDriver = (waiting: Waiting, driverId: DriverId): EnRoute => ({
  kind: "EnRoute",
  passengerId: waiting.passengerId,
  driverId,
});
```
