# Rationale

Each reason explains why an item holds; none marks when it may be skipped. Items not listed here have obvious reasons or a reason in `scripts/probe.mjs` output.

## Input

- **Spaces, not colons**: frameworks and usage specs nest commands as a tree, so help and completion work at every level.
- **Root-only version flags**: a subcommand may take its own `--version <v>`.
- **`-V` and `version` follow the framework**: help and completion then list them.
- **Env for flags**: CI and wrappers set env once instead of editing each call.

## Output

- **Final result record**: the last line tells a reader whether a stream finished.
- **Color order**: an explicit flag beats env; `CLICOLOR_FORCE` serves pagers and CI logs that render ANSI.
- **One entry per line, no borders**: `grep`, `wc -l`, and `sort` work on the default output, so no `--plain` mode is needed.

## Errors

- **Error fields; never hidden by `--quiet`**: callers branch on the code, agents run the fix, and a silenced error looks like success.
- **Traceback behind a flag, not `DEBUG`**: flags also read env, so CI can enable it without a global variable.
- **Re-raise signals**: callers see 130 or 143 and know the run was interrupted; remote jobs left running keep spending.

## Safety

- **`--dry-run` as the fix, not `--yes`**: an agent runs a suggested fix, so a fix with `--yes` skips the confirmation.
- **`--yes`, not `--force`**: it answers the confirmation instead of overriding checks.
- **No secrets in env vars**: env leaks through child processes, logs, `ps e`, and `docker inspect`.

## Release

- **packslip**: package managers verify binaries against one signed file, serve completions for the active version, and fetch that version's skills; a skill for another version describes commands that do not exist.
