# 구현 계획 - 부활 시스템 (Revive System)

플레이어 사망 시 "새로고침" 대신 게임 내 기능을 통해 부활할 수 있도록 하며, 횟수에 따라 비용을 부과합니다.

## 변경 사항

### [수정] [src/game/Player.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Player.js)
- `reviveCount` 속성 추가 및 저장/로드 로직에 포함.

### [수정] [src/game/Game.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Game.js)
- **Game Over 상태 처리**:
    - 기존: "새로고침하여 다시 시작하세요" 표기.
    - 변경: "부활하려면 'R'을 누르세요. (남은 무료 부활: N회 / 비용: 50G)"
- **`input()`**: `GAMEOVER` 상태에서 'R' 키 입력 처리 -> `revive()` 호출.
- **`revive()` 메서드 구현**:
    - `reviveCount < 3`: 무료 부활. `reviveCount` 증가.
    - `reviveCount >= 3`: 50골드 소모. 골드 부족 시 부활 불가 메시지 출력.
    - 성공 시: HP 회복(최대치의 50%?), 상태를 `HOME`으로 변경, 게임 저장.

## 비용 정책
- 1~3회: 무료
- 4회 이상: 50 골드

## 검증 계획
- 일부러 사망(HP 0).
- R키로 3번 무료 부활 확인.
- 4번째 부활 시 골드 차감 확인.
- 골드 부족 시 부활 불가 확인.
