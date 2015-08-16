var PowerUp = function(type) {
    
//    if (!Utils.inArray(type, Game.types.powerUps)) {
//        return false;
//    }
    
    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    
    var _sprite = new PIXI.Sprite();
    var _textureRegion = {};
    var _duration = 300;
    
    switch (type) {
        case Game.types.powerUps.protectiveField:
            var _duration = 50;
            _textureRegion = { x: _tailWidth * 32, y: 0, width: _tailWidth * 4, height: _tailHeight * 2 };
        break;
        
        default: 
            _textureRegion = { x: _tailWidth * 32, y: _tailHeight * 4, width: _tailWidth * 14, height: _tailHeight * 2 };
        break;
    }

    var _frames = new TextureExploder(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                _textureRegion
            )
        ).explode(_tailWidth * 2, _tailHeight * 2);

    var _blank = new PIXI.Texture(
            Loader.resources.Atlas.texture,
            { x: _tailWidth * 34, y: _tailHeight * 22, width: _tailWidth * 2, height: _tailHeight * 2 }
        );

    var _animations = [];
    
    _animations[Game.types.powerUps.helmet] = 
        new Animation([ 
            _frames[0][0],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.clock] = 
        new Animation([ 
            _frames[0][1],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.shovel] = 
        new Animation([ 
            _frames[0][2],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.star] = 
        new Animation([ 
            _frames[0][3],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.grenade] = 
        new Animation([ 
            _frames[0][4],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.tank] = 
        new Animation([ 
            _frames[0][5],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.gun] = 
        new Animation([ 
            _frames[0][6],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.protectiveField] = 
        new Animation([ 
            _frames[0][0],
            _frames[0][1]
        ], _duration);
    
    _.extend(_sprite, {
        zIndex: 2,
        type: type,
        pivot: new PIXI.Point(_tailWidth, _tailHeight),
        attachedTo: null,
        
        setPosition: function(x, y) {
            this.position.x = x;
            this.position.y = y;
            return this;
        },
        attachTo: function(model) {
            this.attachedTo = model;
            return this;
        },
        getOwnerModel: function() {
            return this.attachedTo;
        },
        die: function() {
            Game.instance.removeModel(this);
        },
        getType: function() {
            return this.type;
        },
        render: function() {
            if (this.attachedTo !== null) {
                _sprite.position = this.attachedTo.position;
            }
            _sprite.texture = _animations[type].getFrame(Game.instance.getTimeDelta());
        }
    });
    
    return _sprite;
};
