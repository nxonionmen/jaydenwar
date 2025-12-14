window.onload = () => {
    const game = new Game();
    game.start();
    window.game = game; // Expose for debugging
};
