var Shell = function() {
    
    var _sprite = new PIXI.Sprite(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                { x: 1288, y: 408, width: 16, height: 32 }
            )
        );
    
    _.extend(_sprite, {
        _speed: 10,
        _speedX: 0,
        _speedY: 0,
        _dirrection: null,
        pivot: new PIXI.Point(8, 16),
        state: Game.types.shellStates.ready,
        visible: false,
        
        setDirrection: function(dirrection) {
            if (typeof Game.types.tankDirrections[dirrection] !== 'undefined') {
                this._dirrection = dirrection;
            }
        },
        setPosition: function(x, y) {
            this.position.x = x;
            this.position.y = y;
        },
        setSpeed: function(speed) {
            this._speed = speed;
        },
        reset: function() {
            this.visible = false;
            this._speedX = this._speedY = 0;
            this.state = Game.types.shellStates.ready;
        },
        getState: function() {
            return this.state;
        },
        shot: function() {
            switch (this._dirrection) {
                case Game.types.tankDirrections.top:
                    this._speedX = 0;
                    this._speedY = -this._speed;
                    this.rotation = 0;
                break;
                
                case Game.types.tankDirrections.right: 
                    this._speedX = this._speed;
                    this._speedY = 0;
                    this.rotation = 1.57;
                break;
                
                case Game.types.tankDirrections.bottom: 
                    this._speedX = 0;
                    this._speedY = this._speed;
                    this.rotation = 3.14;
                break;
                
                case Game.types.tankDirrections.left: 
                    this._speedX = -this._speed;
                    this._speedY = 0;
                    this.rotation = -1.57;
                break;
            }
            this.visible = true;
            this.state = Game.types.shellStates.flying;
        },
        render: function() {
            this.position.x += this._speedX;
            this.position.y += this._speedY;
            
            if (this.position.x > Game.config.canvasSize.width || this.position.x < 0 || this.position.y > Game.config.canvasSize.height || this.position.y < 0) {
                this.reset();
            }
        }
    });
    
    _sprite.scale.x = 1;
    _sprite.scale.y = 1;

    return _sprite;
};