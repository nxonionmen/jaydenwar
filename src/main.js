window.onload = () => {
    const game = new Game();
    game.start();

    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm("정말 모든 데이터를 삭제하고 처음부터 시작하시겠습니까?")) {
            localStorage.removeItem('jayden_war_save');
            location.reload();
        }
    });
    window.game = game; // Expose for debugging
};
