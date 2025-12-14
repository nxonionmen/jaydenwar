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
            e.preventDefault(); // Prevent double firing or scrolling
            const key = btn.getAttribute('data-key');
            if (key) {
                // Determine if key is upper or lower case based on game logic needs?
                // Game.js generally checks both (e.key === 'u' || e.key === 'U')
                // So passing the key directly is fine.
                game.input({ key: key });
            }
        };

        btn.addEventListener('touchstart', handleInput, { passive: false });
        btn.addEventListener('mousedown', handleInput);
    });

    window.game = game; // Expose for debugging
};
