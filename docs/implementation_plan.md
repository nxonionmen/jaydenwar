# 구현 계획 - 아이템 업그레이드 (강화) 시스템

무기를 강화하여 공격력을 높이는 시스템을 추가합니다.

## 핵심 변경 사항

### 1. 데이터 구조 및 저장 방식 변경 ([src/game/Player.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Player.js))
- **현재**: `inventory.weapons`는 `ITEMS`의 객체를 참조하며, 저장 시 **이름 문자열 배열**(`['Sword', 'Gun']`)로 저장됨.
- **변경**:
    - `inventory.weapons`의 아이템들에 `level` (기본 0), `bonusDamage` 속성을 동적으로 추가.
    - **저장(saveData)**: 이름과 레벨을 함께 저장. 예: `[{ name: 'Sword', level: 1 }, { name: 'Gun', level: 0 }]`
    - **불러오기(loadData)**: 저장된 데이터를 읽어 `ITEMS`에서 기본 정보를 가져온 뒤, 저장된 `level`과 `bonusDamage`를 덮어씌움.
    - **하위 호환성**: 기존의 문자열 배열 저장 데이터도 읽을 수 있도록 처리 필요.

### 2. 강화 로직 구현 ([src/game/Player.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Player.js))
- **`upgradeWeapon(weaponIndex)` 메서드 추가**:
    - **비용**: `(현재 레벨 + 1) * 50` 골드.
    - **효과**: 레벨 +1, 데미지 +1 (또는 무기별 상이?). 일단 일괄 공격력 +1로 단순화.
    - **성공 조건**: 골드 충분 시 100% 성공.

### 3. 상점 UI 업데이트 ([src/game/Game.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Game.js))
- **상점 모드(SHOP)**에서 기능 추가:
    - **'U' 키**: 현재 장착 중인 무기 강화.
    - 화면 표시: "U: 현재 무기 강화 (+방망이 -> 공격력 2, 비용 50g)" 형태로 미리보기 표시.

### 4. HUD 및 아이템 표시 ([src/game/Game.js](file:///c:/Users/onionmen/OneDrive/Documents/Projects/jayden_war/src/game/Game.js))
- 무기 이름 표시 시 레벨 포함: `Sword` -> `Sword +1`
- 데미지 표시에 강화 수치 반영.

## 실행 계획
1.  **Player.js**: `saveData`, `loadData` 리팩토링 및 `upgradeWeapon` 메서드 추가.
2.  **Game.js**: 상점(`SHOP`) 상태에서 'U' 키 입력 처리 및 드로잉 로직 추가.
3.  **테스트**: 무기 구매 -> 골드 획득 -> 강화 시도 -> 새로고침 후 강화 상태 유지 확인.
