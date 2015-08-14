var PowerUp = function(type) {
    
    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    
    var _sprite = new PIXI.Sprite();

    var _frames = new TextureExploder(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                { x: _tailWidth * 32, y: _tailHeight * 4, width: _tailWidth * 14, height: _tailHeight * 2 }
            )
        ).explode(_tailWidth * 2, _tailHeight * 2);

    var _blank = new PIXI.Texture(
            Loader.resources.Atlas.texture,
            { x: _tailWidth * 34, y: _tailHeight * 22, width: _tailWidth * 2, height: _tailHeight * 2 }
        );

    var _duration = 300;

    var _animations = {
        helmet: new Animation([ 
            _frames[0][0],
            _blank
        ], _duration),
        
        clock: new Animation([ 
            _frames[0][1],
            _blank
        ], _duration),
        
        shovel: new Animation([ 
            _frames[0][2],
            _blank
        ], _duration),
        
        star: new Animation([ 
            _frames[0][3],
            _blank
        ], _duration),
        
        grenade: new Animation([ 
            _frames[0][4],
            _blank
        ], _duration),
        
        tank: new Animation([ 
            _frames[0][5],
            _blank
        ], _duration),
        
        gun: new Animation([ 
            _frames[0][6],
            _blank
        ], _duration)
    };
    
    _.extend(_sprite, {
        zIndex: 2,
        
        setPosition: function(x, y) {
            this.position.x = x;
            this.position.y = y;
        },
        die: function() {
            Game.instance.removeModel(this);
        },
        render: function() {
            _sprite.texture = _animations[type].getFrame(Game.instance.getTimeDelta());
        }
    });
    
    return _sprite;
};
