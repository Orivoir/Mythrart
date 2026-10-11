#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(
  cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1
  pwd -P
)"

PACKAGE_DIR="$(
  cd -- "$SCRIPT_DIR/../.." >/dev/null 2>&1
  pwd -P
)"

COMPOSE_FILE="$PACKAGE_DIR/docker-compose.yml"

usage() {
  cat <<'EOF'
Usage:
  ./tools/epubcheck/validate-epub.sh <fichier.epub> [options EPUBCheck]

Exemples:
  ./tools/epubcheck/validate-epub.sh /tmp/book.epub
  ./tools/epubcheck/validate-epub.sh /tmp/book.epub --failonwarnings
  ./tools/epubcheck/validate-epub.sh /tmp/book.epub --json report.json

Le fichier EPUB doit exister sur l'hôte.
Les options supplémentaires sont transmises à EPUBCheck.
EOF
}

if [[ $# -lt 1 ]]; then
  usage >&2
  exit 2
fi

EPUB_PATH="$1"
shift

if [[ ! -f "$EPUB_PATH" ]]; then
  printf 'Erreur : fichier introuvable : %s\n' "$EPUB_PATH" >&2
  exit 2
fi

if [[ "${EPUB_PATH##*.}" != "epub" ]]; then
  printf 'Erreur : le fichier doit avoir l’extension .epub\n' >&2
  exit 2
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  printf 'Erreur : fichier Compose introuvable : %s\n' "$COMPOSE_FILE" >&2
  exit 2
fi

EPUB_DIR="$(
  cd -- "$(dirname -- "$EPUB_PATH")" >/dev/null 2>&1
  pwd -P
)"

EPUB_FILENAME="$(basename -- "$EPUB_PATH")"

if ! command -v docker >/dev/null 2>&1; then
  printf 'Erreur : Docker est introuvable.\n' >&2
  exit 2
fi

if ! docker compose version >/dev/null 2>&1; then
  printf 'Erreur : Docker Compose v2 est requis.\n' >&2
  exit 2
fi

printf 'EPUBCheck %s — validation de %s\n' \
  "5.4.0" "$EPUB_FILENAME"

docker compose \
  --file "$COMPOSE_FILE" \
  run \
  --build \
  --rm \
  --no-deps \
  --interactive=false \
  --volume "$EPUB_DIR:/data:ro" \
  epubcheck \
  "$EPUB_FILENAME" \
  "$@"
