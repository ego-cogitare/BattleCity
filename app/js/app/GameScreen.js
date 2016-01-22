var GameScreen = {
    gameScreen: 'MAIN_MENU',
    gameScreens: [
        'MAIN_MENU',
        'HIGH_SCORES',
        'PAUSE',
        'GAME',
        'GAME_OVER',
        'LEVEL_SELECT'
    ],
    init: function() {
        document.body.style.width = Math.max(screen.availWidth, screen.availHeight)  + 'px';
        document.body.style.height = Math.min(screen.availWidth, screen.availHeight) + 'px';
        this.show(this.gameScreen);
    },
    show: function(gameScreen) {
        try { document.getElementById(gameScreen).style.display = 'block'; } catch (e) {}
    },
    hideAll: function() {
        _.each(this.gameScreens, function(gameScreen) {
            try { document.getElementById(gameScreen).style.display = 'none'; } catch (e) {}
        }, this);
    },
    getGameScreen: function() {
        return this.gameScreen;
    },
    setGameScreen: function(gameScreen) {
        if (_.contains(this.gameScreens, gameScreen)) {
            this.hideAll();
            this.show(gameScreen);
            this.gameScreen = gameScreen;
        }
    }
};

