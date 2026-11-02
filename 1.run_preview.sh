#!/usr/bin/env bash
# 사이트를 빌드하고 미리보기 서버를 실행합니다 (기본 주소: http://localhost:3000).
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
exec npm run preview
