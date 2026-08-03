# State Modeling

## Designing State Transitions with Discriminated Unions

### Design Steps

1. Enumerate the possible states of the domain entity
2. Identify the properties needed in each state
3. Define a separate type for each state (using `kind` as the discriminant)
4. Combine them into a union type
5. Define valid transitions as pure functions
6. Group functions into a companion object

### From State Diagram to Code

```text
Waiting → EnRoute → InTrip → Completed
  ↓         ↓        ↓
Cancelled Cancelled Cancelled
```

```typescript
// 1. Types for each state
type Waiting = Readonly<{
  kind: "Waiting";
  requestId: RequestId;
  passengerId: PassengerId;
  createdAt: Date;
}>;

type EnRoute = Readonly<{
  kind: "EnRoute";
  requestId: RequestId;
  passengerId: PassengerId;
  driverId: DriverId;
  assignedAt: Date;
}>;

type InTrip = Readonly<{
  kind: "InTrip";
  requestId: RequestId;
  passengerId: PassengerId;
  driverId: DriverId;
  startedAt: Date;
}>;

type Completed = Readonly<{
  kind: "Completed";
  requestId: RequestId;
  passengerId: PassengerId;
  driverId: DriverId;
  startedAt: Date;
  completedAt: Date;
}>;

type Cancelled = Readonly<{
  kind: "Cancelled";
  requestId: RequestId;
  passengerId: PassengerId;
  cancelledAt: Date;
  reason: string;
}>;

// 2. Union type
type TaxiRequest = Waiting | EnRoute | InTrip | Completed | Cancelled;

// 3. Union of cancellable states (partial unions are also useful)
type CancellableRequest = Waiting | EnRoute | InTrip;

// 4. Transition functions
const TaxiRequest = {
  assignDriver: (waiting: Waiting, driverId: DriverId, now: Date): EnRoute => ({
    kind: "EnRoute",
    requestId: waiting.requestId,
    passengerId: waiting.passengerId,
    driverId,
    assignedAt: now,
  }),

  startTrip: (enRoute: EnRoute, now: Date): InTrip => ({
    kind: "InTrip",
    requestId: enRoute.requestId,
    passengerId: enRoute.passengerId,
    driverId: enRoute.driverId,
    startedAt: now,
  }),

  complete: (inTrip: InTrip, now: Date): Completed => ({
    kind: "Completed",
    requestId: inTrip.requestId,
    passengerId: inTrip.passengerId,
    driverId: inTrip.driverId,
    startedAt: inTrip.startedAt,
    completedAt: now,
  }),

  cancel: (request: CancellableRequest, reason: string, now: Date): Cancelled => ({
    kind: "Cancelled",
    requestId: request.requestId,
    passengerId: request.passengerId,
    cancelledAt: now,
    reason,
  }),

  isCancellable: (request: TaxiRequest) =>
    request.kind === "Waiting" ||
    request.kind === "EnRoute" ||
    request.kind === "InTrip",
} as const;
```

### Notes

**Handling shared properties:** Even when properties like `requestId` are common to all states, avoid inheriting from a base type via `extends`. Accept the redundancy of explicitly defining properties in each state as a trade-off for type safety.

**Generating timestamps:** Accept timestamps as arguments; never call `new Date()` inside domain functions or use cases. This lets tests pin time deterministically.

## Domain Events

Record business-significant occurrences that accompany state transitions as immutable domain events.

```typescript
type DomainEvent<TName extends string, TPayload> = Readonly<{
  eventId: string;
  eventAt: Date;
  eventName: TName;
  payload: TPayload;
  aggregateId: string;
  aggregateName: string;
}>;

type DriverAssignedEvent = DomainEvent<
  "DriverAssigned",
  { driverId: DriverId; passengerId: PassengerId }
>;
```

### Persist State and Events in the Same Transaction

The aggregate state and the events it emits must be persisted within the same transaction boundary. Writing them in two separate steps suffers from the dual-write problem: the moment one succeeds and the other fails, the system is inconsistent.

```typescript
// Bad — state and event are persisted in different transactions; a failure
// between them leaves the aggregate inconsistent.
await saveRequest(entity).then(Result.andThenAsync(() => saveEvent(event)));
```

The standard implementation is the **Outbox Pattern**: write the state row and the outbox row atomically in the same DB transaction, and let a separate process relay outbox rows to the broker. Express this atomicity in the interface as well. Read-side concerns are split out as `RequestResolver` (interface segregation).

```typescript
import { Result, TaggedError } from "better-result";

class RepositoryError extends TaggedError("RepositoryError")<{
  message: string;
  cause: unknown;
}> {}

type RequestResolver = Readonly<{
  findById: (id: RequestId) => Promise<Result<Waiting | undefined, RepositoryError>>;
}>;

type RequestStore = Readonly<{
  save: (
    state: EnRoute,
    events: readonly DriverAssignedEvent[],
  ) => Promise<Result<void, RepositoryError>>;
}>;
```

Closing `save` into a single method makes it structurally impossible for callers to produce a half-written aggregate where the state was updated but the event never fired.

### Event Generation Responsibility

The use case layer generates events and hands them to `RequestStore.save` together with the state. Letting the repository generate events internally bloats its responsibilities by mixing persistence with business rules.

```typescript
const buildDriverAssignedEvent =
  (now: Date) =>
  (enRoute: EnRoute): DriverAssignedEvent => ({
    eventId: crypto.randomUUID(),
    eventAt: now,
    eventName: "DriverAssigned",
    payload: { driverId: enRoute.driverId, passengerId: enRoute.passengerId },
    aggregateId: enRoute.requestId,
    aggregateName: "TaxiRequest",
  });

const assignDriverUseCase =
  (resolver: RequestResolver, store: RequestStore) =>
  (requestId: RequestId, driverId: DriverId, now: Date) =>
    Result.gen(async function* () {
      const found = yield* Result.await(resolver.findById(requestId));
      const waiting = yield* ensureFound(found, requestId); // see error-handling.md
      const enRoute = TaxiRequest.assignDriver(waiting, driverId, now);
      yield* Result.await(store.save(enRoute, [buildDriverAssignedEvent(now)(enRoute)]));
      return Result.ok(enRoute);
    });
```
