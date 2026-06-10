#!/usr/bin/env bash
set -euo pipefail

status=0

fail() {
	printf 'ERROR: %s\n' "$*" >&2
	status=1
}

sha256_file() {
	shasum -a 256 "$1" | awk '{print $1}'
}

frontmatter_value() {
	local file=$1
	local key=$2

	awk -v key="$key" '
    NR == 1 && $0 == "---" { in_frontmatter = 1; next }
    in_frontmatter && $0 == "---" { exit }
    in_frontmatter && index($0, key ":") == 1 {
      sub("^[^:]+:[[:space:]]*", "")
      print
      exit
    }
  ' "$file"
}

doc_path_for_source() {
	local source=$1
	local rest skill ref

	case "$source" in
	skills/*/SKILL.md)
		rest=${source#skills/}
		skill=${rest%%/*}
		printf 'docs/%s/SKILL.ja.md\n' "$skill"
		;;
	skills/*/references/*.md)
		rest=${source#skills/}
		skill=${rest%%/*}
		ref=${source#"skills/$skill/references/"}
		printf 'docs/%s/references/%s.ja.md\n' "$skill" "${ref%.md}"
		;;
	*)
		return 1
		;;
	esac
}

check_doc_hash() {
	local doc=$1
	local source actual expected expected_doc

	source=$(frontmatter_value "$doc" source)
	actual=$(frontmatter_value "$doc" source_sha256)

	if [[ -z "$source" ]]; then
		fail "$doc is missing frontmatter source"
		return
	fi
	if [[ -z "$actual" ]]; then
		fail "$doc is missing frontmatter source_sha256"
		return
	fi
	if [[ ! -f "$source" ]]; then
		fail "$doc points to missing source: $source"
		return
	fi

	expected_doc=$(doc_path_for_source "$source") || {
		fail "$doc points to unsupported source path: $source"
		return
	}
	if [[ "$doc" != "$expected_doc" ]]; then
		fail "$doc should be $expected_doc for source $source"
	fi

	expected=$(sha256_file "$source")
	if [[ "$actual" != "$expected" ]]; then
		fail "$doc is stale for $source: expected $expected, got $actual"
	fi
}

while IFS= read -r source; do
	doc=$(doc_path_for_source "$source")
	if [[ ! -f "$doc" ]]; then
		fail "missing Japanese doc for $source: expected $doc"
		continue
	fi
	check_doc_hash "$doc"
done < <(find skills -type f \( -name 'SKILL.md' -o -path '*/references/*.md' \) | sort)

if [[ -d docs ]]; then
	while IFS= read -r doc; do
		check_doc_hash "$doc"
	done < <(find docs -type f -name '*.ja.md' | sort)

	while IFS= read -r runtime_doc; do
		fail "docs must not contain runtime SKILL.md files: $runtime_doc"
	done < <(find docs -type f -name 'SKILL.md' | sort)
fi

while IFS= read -r installed_doc; do
	fail "Japanese docs must stay out of installable skills: $installed_doc"
done < <(find skills -type f -name '*.ja.md' | sort)

exit "$status"
