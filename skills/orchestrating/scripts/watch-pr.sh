#!/bin/sh
gh event listen --resource "$1" --follow --event com.github.pull_request.state.changed.v1,com.github.pull_request.check_suite.status.changed.v1,com.github.pull_request.review.submitted.v1,com.github.pull_request.merge_conflict.v1,com.github.pull_request.head.changed.v1 2>&1 |
  while read -r line; do
    case $line in '{'*) ;; *) echo "$line" ;; esac
    gh pr view "$1" --json state,mergeStateStatus,reviewDecision --jq '"\(.state) \(.mergeStateStatus) \(.reviewDecision)"'
  done
