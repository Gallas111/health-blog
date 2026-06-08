#!/bin/bash
# health-blog 색인 가능한 모든 URL을 IndexNow에 일괄 제출 + GSC sitemap resubmit
# 노출/색인이 적은 페이지 회복 가속
set -euo pipefail

KEY="b3f8a2d1e5c94f7689012345abcdef67"
HOST="www.wellnesstodays.com"
SITEMAP="https://www.wellnesstodays.com/sitemap.xml"

# 1. 라이브 sitemap에서 모든 URL 추출
echo "─── 1. sitemap.xml에서 URL 추출 ───"
URLS=$(curl -s "$SITEMAP" | grep -oE "<loc>https://[^<]+</loc>" | sed 's|<loc>||;s|</loc>||')
COUNT=$(echo "$URLS" | wc -l)
echo "총 $COUNT URL"

# 2. IndexNow JSON payload 생성 (10000개까지 한 번에 OK)
echo "─── 2. IndexNow 일괄 제출 ───"
URL_JSON=$(echo "$URLS" | python -c "import sys,json;print(json.dumps([l.strip() for l in sys.stdin if l.strip()]))")
PAYLOAD=$(cat <<EOF
{
  "host": "$HOST",
  "key": "$KEY",
  "keyLocation": "https://$HOST/$KEY.txt",
  "urlList": $URL_JSON
}
EOF
)

resp=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "https://yandex.com/indexnow" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")
http_code=$(echo "$resp" | tail -1 | sed 's/HTTP_CODE://')
body=$(echo "$resp" | sed '$d')
echo "IndexNow HTTP: $http_code"
if [ -n "$body" ]; then echo "  body: $body" | head -c 200; echo ""; fi
if [ "$http_code" = "200" ] || [ "$http_code" = "202" ]; then
  echo "✅ IndexNow $COUNT URL 제출 성공"
else
  echo "⚠️  IndexNow 응답 비정상 (코드 $http_code)"
fi
