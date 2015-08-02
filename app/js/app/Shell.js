var Shell = function() {
    
    var _sprite = new PIXI.Sprite(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                { x: 322, y: 102, width: 4, height: 8 }
            )
        );
    
    _.extend(_sprite, {
        _speed: 10,
        _speedX: 0,
        _speedY: 0,
        _dirrection: null,
        pivot: new PIXI.Point(2, 4),
        state: ShellStates.ready,
        visible: false,
        
        setDirrection: function(dirrection) {
            if (typeof Dirrections[dirrection] !== 'undefined') {
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
            this.state = ShellStates.ready;
        },
        getState: function() {
            return this.state;
        },
        shot: function() {
            switch (this._dirrection) {
                case Dirrections.top:
                    this._speedX = 0;
                    this._speedY = -this._speed;
                    this.rotation = 0;
                break;
                
                case Dirrections.right: 
                    this._speedX = this._speed;
                    this._speedY = 0;
                    this.rotation = 1.57;
                break;
                
                case Dirrections.bottom: 
                    this._speedX = 0;
                    this._speedY = this._speed;
                    this.rotation = 3.14;
                break;
                
                case Dirrections.left: 
                    this._speedX = -this._speed;
                    this._speedY = 0;
                    this.rotation = -1.57;
                break;
            }
            this.visible = true;
            this.state = ShellStates.flying;
        },
        render: function() {
            this.position.x += this._speedX;
            this.position.y += this._speedY;
            
            if (this.position.x > Game.instance.screenWidth || this.position.x < 0 || this.position.y > Game.instance.screenHeight || this.position.y < 0) {
                this.reset();
            }
        }
    });
    
    _sprite.scale.x = 2;
    _sprite.scale.y = 2;

    return _sprite;
};