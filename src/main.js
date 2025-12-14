window.onload = () => {
    const game = new Game();
    game.start();

    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm("정말 모든 데이터를 삭제하고 처음부터 시작하시겠습니까?")) {
            localStorage.removeItem('jayden_war_save');
            location.reload();
        }
    });

    // Mobile Controls
    document.querySelectorAll('.control-btn').forEach(btn => {
        const handleInput = (e) => {
            e.preventDefault(); // Prevent default behavior (scroll, zoom, double-tap zoom)
            const key = btn.getAttribute('data-key');
            if (key) {
                game.input({ key: key });
            }
        };

        // Use pointerdown for unified touch/mouse handling without duplicates
        btn.addEventListener('pointerdown', handleInput);
    });

    window.game = game; // Expose for debugging
};
