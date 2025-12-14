# 구현 계획 - 포션 사용 기능

지금은 포션을 구매만 할 수 있고 사용할 수 없습니다. 플레이어가 포션을 사용하여 체력을 회복하는 기능을 추가합니다.

## 변경 사항

### [수정] [src/game/Player.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Player.js)
- **`usePotion()` 메서드 추가**:
    - 포션 개수 확인 (`this.inventory.potions > 0`).
    - 체력 확인 (`this.hp < this.maxHp` - 체력이 꽉 찼으면 사용 불가).
    - 사용 시: `hp` 회복 (예: 5 또는 최대치), `potions` 감소.
    - 반환값: 성공 여부 (true/false).

### [수정] [src/game/Game.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Game.js)
- **`input()` 수정**:
    - 숫자 키 **'5'**를 눌러 포션 사용.
    - 전투 중(`BATTLE`)이나 집(`HOME`) 어디서든 사용 가능하게 함 (또는 전투 중 제약?). 일단 모든 상태에서 위급할 때 쓸 수 있게 허용.
- **UI 표시 (`draw`)**:
    - HUD에 현재 소지한 포션 개수 표시.

### [수정] [index.html](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/index.html)
- **모바일 컨트롤**:
    - 숫자 '5' 또는 '물약' 아이콘 버튼 추가.

## 사용 방법
- 키보드: **5번** 키
- 모바일: **물약(💊)** 버튼

## 검증 계획
- 상점에서 포션 구매.
- 체력 감소 상태에서 5번 키 입력.
- 체력 회복 및 포션 개수 감소 확인.
- 만피일 때 사용 안됨 확인.
- 포션 없을 때 사용 안됨 확인.
