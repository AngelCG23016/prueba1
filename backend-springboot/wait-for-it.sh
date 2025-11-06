#!/usr/bin/env bash
# wait-for-it.sh - wait for host:port then exec command
set -e

TIMEOUT=30
if [ "$1" = "-t" ]; then
  TIMEOUT="$2"
  shift 2
fi

if [ -z "$1" ]; then
  echo "Usage: $0 host:port [-t seconds] -- command args..."
  exit 1
fi

HOSTPORT="$1"
shift

HOST="${HOSTPORT%%:*}"
PORT="${HOSTPORT##*:}"

CMD=( "$@" )

count=0
while ! nc -z "$HOST" "$PORT" 2>/dev/null; do
  count=$((count+1))
  if [ "$count" -ge "$TIMEOUT" ]; then
    echo "Timeout (${TIMEOUT}s) waiting for ${HOST}:${PORT}"
    exit 1
  fi
  echo "Waiting for ${HOST}:${PORT} (${count}/${TIMEOUT})..."
  sleep 1
done

echo "Connection to ${HOST}:${PORT} succeeded after ${count}s"

if [ "${#CMD[@]}" -gt 0 ]; then
  exec "${CMD[@]}"
else
  exit 0
fi
