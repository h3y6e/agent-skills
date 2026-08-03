# Mechanical Enforcement with oxlint

Type-aware rules require the `oxlint-tsgolint` package.

```jsonc
{
  "options": { "typeAware": true },
  "plugins": ["typescript", "import"],
  "rules": {
    "typescript/consistent-type-definitions": ["error", "type"],
    "typescript/method-signature-style": ["error", "property"],
    // bans every `as` except `as const` / `as const satisfies T`
    "typescript/consistent-type-assertions": ["error", { "assertionStyle": "never" }],
    // `!` and `any` bypass the type system the same way `as` does
    "typescript/no-non-null-assertion": "error",
    "typescript/no-explicit-any": "error",
    // without `props: true`, property mutation through parameters passes
    "no-param-reassign": ["error", { "props": true }],
    "import/no-cycle": "error",
    // every `kind` switch must cover all states
    "typescript/switch-exhaustiveness-check": "error",
    // a dropped Promise<Result<…>> silently loses its error channel
    "typescript/no-floating-promises": "error",
    // flags conditions the types already decide, e.g. re-checking `kind` inside the domain
    "typescript/no-unnecessary-condition": "error"
  }
}
```

Optional: `typescript/explicit-function-return-type` makes return types name transition targets, but fires on every function in the project.
