var AI = function() {
    return {
        _AIPlayTimeDelta: 750,
        _AILastPlayTime: Game.instance.getTime(),
        
        _getRandomDirrection: function() {
            return [
                Game.types.tankDirrections.top,
                Game.types.tankDirrections.right,
                Game.types.tankDirrections.bottom,
                Game.types.tankDirrections.left
            ][Math.round(Math.random() * 3)];
        },
        
        AIPlay: function() {
            if (Game.instance.getTime() - this._AILastPlayTime > this._AIPlayTimeDelta) {
                this._AILastPlayTime = Game.instance.getTime();
                
                this.shot();
                this.setDirrection(this._getRandomDirrection());
                this.moveForward();
                
            }
        }
    };
}