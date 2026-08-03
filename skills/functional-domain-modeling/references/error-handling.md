# Error Handling with better-result

## Railway Oriented Programming

Represent success and failure in the type system with `Result<T, E>`. Do not throw exceptions in the domain layer.

```typescript
import { Result, TaggedError, Panic, panic } from "better-result";
```

Core API (verify against the installed version before relying on an example):

| API | Purpose |
| --- | --- |
| `Result.ok(v)` / `Result.err(e)` | Constructors |
| `Result.try(fn)` / `Result.tryPromise({ try, catch })` | Wrap throwing/rejecting code at infrastructure boundaries |
| `Result.gen(function* () { … })` + `yield*` / `Result.await(p)` | Generator composition (sync and async) |
| `.map` / `.mapError` / `.andThen` / `.andThenAsync` / `.tryRecover` | Instance combinators |
| `.match({ ok, err })` / `error.match({ Tag: … })` | Exhaustive pattern matching |
| `.isOk()` / `.isErr()` / `.unwrapOr(fallback)` | Narrowing and extraction |
| `Result.all` / `Result.allAsync` / `Result.partition` | Collections |

## Error Type Design with TaggedError

Define each known failure as a `TaggedError` class. The tag names the failed domain operation or condition — not the underlying library's error name. Expose contextual data as **typed fields**; a `message` is for logging/display only and must never be the only place context lives.

```typescript
// Good: context available as typed fields
class RequestNotFound extends TaggedError("RequestNotFound")<{
  requestId: RequestId;
  message: string;
}> {
  constructor(args: { requestId: RequestId }) {
    super({ ...args, message: `Request ${args.requestId} not found` });
  }
}

class InvalidState extends TaggedError("InvalidState")<{
  currentKind: string;
  expectedKind: "Waiting";
  message: string;
}> {
  constructor(args: { currentKind: string; expectedKind: "Waiting" }) {
    super({ ...args, message: `Expected ${args.expectedKind}, got ${args.currentKind}` });
  }
}

// Bad: driverId exists only inside message — callers must parse a string to branch
class DriverNotAvailable extends TaggedError("DriverNotAvailable")<{
  message: string; // "Driver drv-123 is not available in zone zone-A"
}> {}
```

When wrapping another failure, carry the original as a `cause` field. Exclude credentials, tokens, raw personal data, and SQL from error fields.

### Error Type Granularity

The error union returned by each use case should be specific to that use case. Stuffing everything into a common `AppError` makes it impossible for callers to determine from the type which errors can actually occur.

```typescript
// Good: use-case-specific error unions
type AssignDriverError = RequestNotFound | InvalidState | DriverNotAvailable;
type StartTripError = RequestNotFound | InvalidState;

// Bad: one union for the whole app
type AppError = RequestNotFound | InvalidState | DriverNotAvailable | /* … */;
```

## Never Assume a Promise Cannot Reject

Wrap every fallible promise (database query, HTTP call, file I/O) with `Result.tryPromise` and an explicit `catch` mapper. A rejection escaping the Result channel is a defect and surfaces as `Panic`.

```typescript
const getDriver = (driverId: DriverId) =>
  Result.tryPromise({
    try: () => db.drivers.findById(driverId),
    catch: (cause) => new RepositoryError({ message: "driver lookup failed", cause }),
  });
```

## Composing Operations

Each step returns a `Result`; on error, subsequent steps are skipped. **Default to `Result.gen`** for composing fallible steps, sync or async: intermediate values get names, the flow reads top-to-bottom like async/await, and `yield*` marks each early exit — readability does not degrade as steps grow. Use `Result.await` for `Promise<Result<…>>` steps and `yield*` a sync `Result` directly.

Fall back only when `Result.gen` would be pure boilerplate:

- A single transform → one combinator (`.map`, `.andThen`, `.then(Result.map(…))`).
- `await` the promise, then branch with `.isOk()` / `.isErr()` — when ordinary control-flow narrowing is genuinely clearer.

Avoid long combinator chains (`.andThen().map().…`): they cannot name intermediate values, force curried helpers that exist only to thread arguments, and require the reader to know each combinator's semantics.

```typescript
const assignDriver = (requestId: RequestId, driverId: DriverId, now: Date) =>
  Result.gen(async function* () {
    const found = yield* Result.await(resolver.findById(requestId));
    const waiting = yield* ensureFound(found, requestId);
    const stillWaiting = yield* ensureWaiting(waiting);
    const enRoute = TaxiRequest.assignDriver(stillWaiting, driverId, now);
    yield* Result.await(store.save(enRoute, []));
    return Result.ok(enRoute);
  });
```

### Helper Functions

Extract common validation into small functions used as composition steps.

```typescript
const ensureFound = <T>(value: T | undefined, id: RequestId): Result<T, RequestNotFound> =>
  value !== undefined ? Result.ok(value) : Result.err(new RequestNotFound({ requestId: id }));

const ensureWaiting = (request: TaxiRequest): Result<Waiting, InvalidState> =>
  request.kind === "Waiting"
    ? Result.ok(request)
    : Result.err(new InvalidState({ currentKind: request.kind, expectedKind: "Waiting" }));
```

## Error Conversion in the Controller Layer

Converting domain errors to HTTP responses is the Controller layer's responsibility. Match exhaustively on the tag with `error.match` — TypeScript enforces that every variant is handled, so no `default` branch is needed.

```typescript
const response = result.match({
  ok: (enRoute) => ({ status: 200, body: toDto(enRoute) }),
  err: (error) =>
    error.match({
      RequestNotFound: (e) => ({ status: 404, body: { code: "not_found", requestId: e.requestId } }),
      InvalidState: (e) => ({ status: 409, body: { code: "conflict" } }),
      DriverNotAvailable: (e) => ({ status: 422, body: { code: "driver_unavailable" } }),
    }),
});
```

Keep the detailed internal `message` on the tagged error; create user-safe wording at this presentation boundary so internal details never leak.

## Recoverable Failures vs Defects

- **Recoverable:** a known failure callers can report, retry, or compensate for → return a `TaggedError`.
- **Defect:** a violated invariant, impossible state, or programmer mistake → `panic(message, cause)`. Make panic messages state the invariant, observed state, and operation in progress. Let panics reach the outermost telemetry/crash boundary.
- Unexpected infrastructure failures (e.g., DB connection loss) with no meaningful caller response → delegate to the framework's error handler.

A callback that throws inside `.map` / `.match` / a gen body is treated as a defect and surfaces as `Panic` with the original exception as `cause`.
