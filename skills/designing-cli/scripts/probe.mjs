#!/usr/bin/env node
// Runs only help, version, and deliberately invalid invocations, so it is safe
// against a CLI that follows the checklist; one that acts on them may run.
// Each run has no TTY on stdin, NO_COLOR=1, and a 10s limit.
// With a usage spec, invalid invocations it rejects also run against commands
// declared effect="read", because a CLI that wrongly accepts one runs it; so
// does a typo of one, which tests "did you mean".

import { spawnSync } from "node:child_process";

const [bin, specFile] = process.argv.slice(2);
if (bin === undefined) {
  console.error("usage: probe.mjs <bin> [app.usage.kdl]");
  process.exit(2);
}

const env = { ...process.env, NO_COLOR: "1" };
delete env.CLICOLOR_FORCE;

function run(args) {
  const start = Date.now();
  const result = spawnSync(bin, args, {
    input: "",
    encoding: "utf8",
    timeout: 10_000,
    env,
  });
  return {
    ms: Date.now() - start,
    code: result.status,
    timedOut: result.error?.code === "ETIMEDOUT",
    out: result.stdout ?? "",
    err: result.stderr || (result.error?.message ?? ""),
  };
}

const help = run(["--help"]);
const version = run(["--version"]);
if (help.code !== 0 && version.code === help.code && version.err === help.err) {
  console.log(
    `BROKEN ${bin}: --help and --version both fail the same way; check that it is installed and runs:`,
  );
  console.log(help.err.split("\n").slice(0, 5).join("\n"));
  process.exit(2);
}

let fails = 0;

function fail(message) {
  console.log(`FAIL ${message}`);
  fails++;
}

const HELP_WHY =
  "users and agents try help first, and a nonzero exit makes `app --help | less` look like a failure";
const PROMPT_WHY = "a prompt without a TTY hangs scripts and agents";
const USAGE_WHY = "exit 2 tells misuse from failure, and help is the next step";

function expect(
  want,
  stream,
  args,
  { optional = false, sameAs, why, suggests } = {},
) {
  const result = run(args);
  const problems = [];
  if (result.timedOut) {
    problems.push(
      "no exit within 10s without a TTY (prompt or hang?)",
    );
  } else {
    if (result.code !== want) {
      problems.push(`exit ${result.code}, want ${want}`);
    }
    if (result[stream] === "") problems.push(`empty std${stream}`);
    if (stream === "err" && result.out.trim() !== "") {
      problems.push("error output on stdout");
    }
    if (want === 2 && !result.err.includes("--help")) {
      problems.push("no pointer to --help");
    }
    if (suggests !== undefined && !result.err.includes(suggests)) {
      problems.push(`no suggestion of ${suggests}`);
    }
    if ((result.out + result.err).includes("\x1b")) {
      problems.push("ANSI escapes despite NO_COLOR and no TTY");
    }
    if (sameAs !== undefined && result.out !== sameAs.result.out) {
      problems.push(`stdout differs from ${sameAs.label}`);
    }
  }
  const label = [bin, ...args].join(" ");
  if (problems.length === 0) {
    console.log(`PASS ${label}`);
  } else if (optional) {
    console.log(
      `NOTE ${label}: ${
        problems.join("; ")
      } (fine if the framework does not support this form)`,
    );
  } else {
    const reason = result.timedOut ? PROMPT_WHY : why;
    fail(`${label}: ${problems.join("; ")}${reason ? ` (${reason})` : ""}`);
  }
  return result;
}

expect(0, "out", [], {
  why: "a bare invocation that acts surprises someone who only wanted to look",
});
const rootHelp = {
  label: "--help",
  result: expect(0, "out", ["--help"], { why: HELP_WHY }),
};
const rootVersion = {
  label: "--version",
  result: expect(0, "out", ["--version"]),
};
if (rootVersion.result.ms > 500) {
  console.log(
    `NOTE ${bin} --version: took ${rootVersion.result.ms}ms, over 500ms`,
  );
}
if (specFile === undefined) {
  console.log(`NOTE ${bin}: no spec, so subcommands are not probed`);
}
expect(0, "out", ["-h"], { why: HELP_WHY });
expect(0, "out", ["help"], { optional: true, sameAs: rootHelp });
expect(0, "out", ["-V"], { optional: true, sameAs: rootVersion });
expect(0, "out", ["version"], { optional: true, sameAs: rootVersion });
expect(0, "out", ["-v"], {
  sameAs: rootVersion,
  why: "users and agents try -v for the version",
});
expect(2, "err", ["__probe_unknown_command__"], { why: USAGE_WHY });
expect(2, "err", ["--__probe-unknown-flag__"], { why: USAGE_WHY });

function specRoot() {
  const json = spawnSync("usage", ["generate", "json", "-f", specFile], {
    encoding: "utf8",
  });
  if (json.status !== 0) {
    console.error(json.stderr || json.error?.message);
    process.exit(2);
  }
  return JSON.parse(json.stdout).cmd;
}

function specCommands(root) {
  const commands = [];
  const walk = (cmd, path, globals) => {
    const inherited = [...globals, ...cmd.flags.filter((f) => f.global)];
    for (const [name, sub] of Object.entries(cmd.subcommands ?? {})) {
      if (sub.hide) continue;
      commands.push({ path: [...path, name], cmd: sub, inherited });
      walk(sub, [...path, name], inherited);
    }
  };
  walk(root, [], []);
  return commands;
}

function spelling(flag) {
  return flag.long.length > 0 ? `--${flag.long[0]}` : `-${flag.short[0]}`;
}

function specRejects(args) {
  const explain = spawnSync(
    "usage",
    ["explain", "-f", specFile, "--format", "json", "--", bin, ...args],
    { encoding: "utf8" },
  );
  if (explain.status !== 0) {
    console.error(explain.stderr || explain.error?.message);
    process.exit(2);
  }
  const report = JSON.parse(explain.stdout);
  return report.errors.length > 0 || report.refused !== null;
}

const root = specFile === undefined ? undefined : specRoot();
const commands = root === undefined ? [] : specCommands(root);
const topNames = Object.entries(root?.subcommands ?? {}).flatMap((
  [name, sub],
) => [name, ...(sub.aliases ?? []), ...(sub.hidden_aliases ?? [])]);
const typoOf = commands.find(({ path, cmd }) =>
  path.length === 1 && cmd.effect === "read" && path[0].length > 1 &&
  !topNames.some((n) => n !== path[0] && n.startsWith(path[0].slice(0, -1)))
)?.path[0];
if (typoOf !== undefined) {
  expect(2, "err", [typoOf.slice(0, -1)], {
    suggests: typoOf,
    why: "typos are the most common usage error",
  });
}

for (const { path, cmd, inherited } of commands) {
  const label = path.join(" ");
  const subHelp = {
    label: `${label} --help`,
    result: expect(0, "out", [...path, "--help"], { why: HELP_WHY }),
  };
  expect(0, "out", [...path, "-h"], { why: HELP_WHY });
  expect(0, "out", ["help", ...path], { optional: true, sameAs: subHelp });

  for (const flag of cmd.flags.filter((f) => !f.hide && f.long.length > 0)) {
    if (!new RegExp(`--${flag.long[0]}(?![\\w-])`).test(subHelp.result.out)) {
      fail(
        `${bin} ${label}: spec flag --${flag.long[0]} is missing from --help`,
      );
    }
    if (flag.required) {
      fail(
        `${bin} ${label}: flag ${
          spelling(flag)
        } is required (a required value names the target, so it is a positional; flags read env, and a stale variable must not pick the target)`,
      );
    }
  }
  const has = (name) =>
    [...cmd.flags, ...inherited].some((f) => f.long.includes(name));
  if (["write", "destructive"].includes(cmd.effect) && !has("dry-run")) {
    fail(
      `${bin} ${label}: ${cmd.effect} command has no --dry-run (a reviewer or agent sees the effect before approving it)`,
    );
  }
  if (cmd.effect === "destructive" && !has("yes")) {
    fail(
      `${bin} ${label}: destructive command has no --yes (scripts must opt in without a TTY)`,
    );
  }
  if (cmd.effect !== "read") {
    console.log(
      `NOTE ${bin} ${label}: effect is ${
        cmd.effect ?? "unknown"
      }, so rejected invocations are not run`,
    );
    continue;
  }
  const filled = [
    ...path,
    ...cmd.flags.filter((f) => f.required).flatMap((f) => [
      spelling(f),
      ...(f.arg ? [f.arg.choices?.choices[0] ?? "x"] : []),
    ]),
    ...cmd.args.filter((a) => a.required).map(() => "x"),
  ];
  const cases = [
    path,
    [...filled, "--__probe-unknown-flag__"],
    [...filled, "__probe_extra__"],
    ...cmd.flags.filter((f) => f.arg?.choices).map((
      f,
    ) => [...filled, spelling(f), "__probe_bad_choice__"]),
  ];
  for (const args of cases.filter(specRejects)) {
    expect(2, "err", args, { why: USAGE_WHY });
  }
}

console.log(`${fails} failure(s)`);
process.exitCode = fails === 0 ? 0 : 1;
