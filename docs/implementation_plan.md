# 구현 계획 - 휴식 횟수 제한 시스템

기존의 "체력 2 이하일 때만 휴식 가능" 조건을 제거하고, **휴식 횟수 제한(Rest Count)** 시스템을 도입합니다.

## 핵심 변경 사항

### 1. 플레이어 데이터 ([src/game/Player.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Player.js))
- **속성 추가**: `restCount` (기본값 5)
- **메서드 변경**: `heal()`
    - **변경 전**: `if (hp <= 2) { hp = maxHp; return true; }`
    - **변경 후**: `if (restCount > 0) { hp = maxHp; restCount--; return true; }`
- **저장/로드**: `saveData`/`loadData`에 `restCount` 포함. (기존 `reviveCount`와 혼동 주의. 이건 **휴식** 횟수)
    - *참고*: `reviveCount`는 '부활 횟수(사망 시)', `restCount`는 '휴식 횟수(집)'로 명확히 구분.

### 2. 게임 로직 및 UI ([src/game/Game.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Game.js))
- **`rest()` 메서드**: 메시지 업데이트 ("남은 휴식 횟수: X")
- **`draw()` 메서드 (HOME)**:
    - 집 화면 텍스트 변경: "잠기 (R)" -> "휴식하기 (R) - 남은 횟수: N"
    - HP 조건(<=2) 체크 로직 제거.

## 실행 계획
1.  **Player.js**: `restCount` 속성 추가 및 `heal`, `saveData`, `loadData` 수정.
2.  **Game.js**: `rest` 메서드 메시지 수정 및 `draw` 메서드 UI 업데이트.

### 3. 데이터 초기화 버튼 추가
- **UI**: 화면 우측 상단이나 하단에 "초기화" 버튼(HTML) 배치.
    - 게임 캔버스 밖에 배치하여 실수 방지.
- **기능**: 버튼 클릭 시 `confirm` 창으로 재확인 후 `localStorage` 클리어 및 `location.reload()`.
- **구현**: `index.html`에 버튼 추가, `style.css`로 스타일링, `main.js` 또는 `Game.js`에서 이벤트 바인딩.

## 실행 계획
1.  **Player.js**: `restCount` 로직 구현.
2.  **Game.js**: 휴식 UI 변경.
3.  **index.html/style.css**: 초기화 버튼 추가.
4.  **Game.js**: 초기화 로직 연결.
3.  **검증**: 체력이 가득 차 있어도 휴식 가능 확인, 횟수 차감 확인, 0회 시 휴식 불가 확인.
