# 건강 블로그 (health-blog) — Claude 프로젝트 지침

## Writing Guide
See WRITING_GUIDE.md for 글 구조, 한국어 문체, 금지 패턴 가이드. 모든 포스트 작성 시 반드시 참고.

## 한글 자수 룰 (필수, 2026-05-11 추가)

- **최소 자수**: 한글 2500자+ (이 블로그 정책 컷)
- **검증 명령** (포스팅·보강 후 보고 직전 필수):
  ```
  bash ~/scripts/check-post-length.sh health-blog --today
  bash ~/scripts/check-post-length.sh health-blog "<slug1,slug2,...>"
  bash ~/scripts/check-post-length.sh health-blog --date YYYY-MM-DD
  ```
  exit 0 받을 때까지 보강 반복.
- ⚠️ **파일 KB ≠ 한글 자수**. KB는 영문·이모지·MDX 마크업 포함. KB로 보고 금지 (5/9·5/11 ai-blog/coinday/easy/baby/health KB 혼동 thin 누적 사고 학습)
- 사용자 보고 시 이 명령 출력값 그대로 사용
