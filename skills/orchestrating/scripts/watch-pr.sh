#!/bin/sh
url=$1
events=com.github.pull_request.state.changed.v1,com.github.pull_request.check_suite.status.changed.v1,com.github.pull_request.review.submitted.v1,com.github.pull_request.merge_conflict.v1,com.github.pull_request.head.changed.v1
while :; do
  sh -c 'echo $$; exec gh event listen --resource "$1" --follow --event "$2"' sh "$url" "$events" 2>&1 | {
    read -r pid
    attached=
    while read -r line; do
      case $line in
        'Listening for events.') attached=1 ;;
        '{'*) ;;
        *) echo "$line" >&2; continue ;;
      esac
      state=$(gh pr view "$url" --json state,mergeStateStatus,statusCheckRollup,reviewDecision --jq '
        [.statusCheckRollup[] | if .__typename == "StatusContext" then .state elif .status != "COMPLETED" then "PENDING" else .conclusion end
          | if IN("SUCCESS", "NEUTRAL", "SKIPPED") then "pass" elif IN("PENDING", "EXPECTED") then "pending" else "fail" end] as $c
        | "\(.state) \(.mergeStateStatus) pass=\($c | map(select(. == "pass")) | length) fail=\($c | map(select(. == "fail")) | length) pending=\($c | map(select(. == "pending")) | length) \(.reviewDecision | select(. != "") // "NONE")"') || { kill "$pid"; exit 1; }
      echo "$url $state"
      case $state in MERGED* | CLOSED*) kill "$pid"; exit 0 ;; esac
    done
    [ "$attached" ] && exit 2
    exit 1
  }
  case $? in
    0) exit 0 ;;
    2) ;;
    *) exit 1 ;;
  esac
done
