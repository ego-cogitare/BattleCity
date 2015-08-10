var Tank = function(ID) {

    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    
    var _sprite = new PIXI.Sprite();
    var _frames = new TextureExploder(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                { x: 0, y: _tailHeight * 6, width: _tailWidth * 4, height: _tailHeight * 2 }
            )
        ).explode(_tailWidth * 2, _tailHeight * 2);
    
    var _animations = {
        stop: new Animation([ 
            _frames[0][0]
        ], 999),
        
        move: new Animation([ 
            _frames[0][0], 
            _frames[0][1] 
        ], 75)
    };
    
    var Methods = {

        id: ID,
        zIndex: 1,
        speed: 2,
        speedX: 0,
        speedY: 0,
        dirrection: Game.types.tankDirrections.top,
        curentState: Game.types.tankStates.stop,
        holder: [
            new Shell()
        ],
        cooldownTime: 100,
        lastShootTime: 0,
        pivot: new PIXI.Point(_tailWidth, _tailHeight),
        canMoveOn: [
            Game.types.mapTails.empty, 
            Game.types.mapTails.tree, 
            Game.types.mapTails.swamp
        ],

        render: function() {
            this.setSpeedX(0);
            this.setSpeedY(0);
            
            /* Process user input */
            this.handleInput();
            
            /* If speed not zero - model is in a move state */
            if (this.getSpeedX() !== 0 || this.getSpeedY() !== 0) {
                this.setState(Game.types.tankStates.move);
            } else {
                this.setState(Game.types.tankStates.stop);
            }
            
            this.texture = _animations[this.curentState].getFrame(Game.instance.getTimeDelta());
            
            // Absolute position to map position
            var mapPosition = this.mapCoords();
            
            switch (this.dirrection) {
                case Game.types.tankDirrections.top:
                    this.rotation = 0;
                    mapPosition.y -= 1;
                break;
                
                case Game.types.tankDirrections.right: 
                    this.rotation = 1.57;
                    mapPosition.x += 1;
                break;
                
                case Game.types.tankDirrections.bottom: 
                    this.rotation = 3.14;
                    mapPosition.y += 1;
                break;
                
                case Game.types.tankDirrections.left: 
                    this.rotation = -1.57;
                    mapPosition.x -= 1;
                break;
            }
            
            this.justifyCoordsToMap();
            
            if 
            (
                (
                    this.curentState === Game.types.tankStates.move
                ) && 
                (
                    this.position.x + this.speedX > Game.instance.screenSize().width - _tailWidth || 
                    this.position.x + this.speedX < _tailWidth || 
                    this.position.y + this.speedY > Game.instance.screenSize().height - _tailHeight || 
                    this.position.y + this.speedY < _tailHeight ||
                    !Utils.inArray(Game.instance.getMapCellAt(Math.floor(mapPosition.x), Math.floor(mapPosition.y)), this.canMoveOn) ||
                    (
                        Utils.inArray(this.dirrection, [Game.types.tankDirrections.top, Game.types.tankDirrections.bottom]) &&
                        !Utils.inArray(Game.instance.getMapCellAt(Math.floor(mapPosition.x - 1), Math.floor(mapPosition.y)), this.canMoveOn)
                    ) ||
                    (
                        Utils.inArray(this.dirrection, [Game.types.tankDirrections.left, Game.types.tankDirrections.right]) &&
                        !Utils.inArray(Game.instance.getMapCellAt(Math.floor(mapPosition.x), Math.floor(mapPosition.y - 1)), this.canMoveOn)
                    )
                )
            )
            {
                this.speedX = 0;
                this.speedY = 0;
            } else {
                this.moveXBy(this.speedX);
                this.moveYBy(this.speedY);
            }
        },
        mapCoords: function() {
            var mapX = this.position.x / _tailWidth;
            var mapY = this.position.y / _tailHeight;
            
            return { x: mapX, y: mapY };
        },
        justifyCoordsToMap: function() {
            switch (this.dirrection) {
                case Game.types.tankDirrections.top: case Game.types.tankDirrections.bottom:
                    this.position.x = Math.round(this.mapCoords().x) * _tailWidth;
                break;
                
                case Game.types.tankDirrections.left: case Game.types.tankDirrections.right:
                    this.position.y = Math.round(this.mapCoords().y) * _tailHeight;
                break;
            }
        },
        shot: function() {
            for (var i = 0; i < this.holder.length; i++) {
                if (this.holder[i].getState() === Game.types.shellStates.ready && Game.instance.getTime() - this.lastShootTime >= this.cooldownTime) {
                    this.holder[i].setDirrection(this.dirrection);
                    this.holder[i].setPosition(this.position.x, this.position.y);
                    this.holder[i].shot();
                    this.lastShootTime = Game.instance.getTime();
                }
            }
        },
        handleInput: function() {
        },
        increaseHolder: function() {
            this.holder.push(new Shell());
            Game.instance.addModel(this.holder[this.holder.length - 1]);
        },
        decreaseHolder: function() {
            Game.instance.removeModel(this.holder.pop());
        },
        getState: function() {
            return this.curentState;
        },
        setState: function(state) {
            if (typeof Game.types.tankStates[state] !== 'undefined') {
                this.curentState = state;
            }
        },
        setSpeed: function(speed) {
            this.speed = speed;
        },
        getSpeed: function() {
            return this.speed;
        },
        setSpeedX: function(speedX) {
            this.speedX = speedX;
        },
        getSpeedX: function() {
            return this.speedX;
        },
        setSpeedY: function(speedY) {
            this.speedY = speedY;
        },
        getSpeedY: function() {
            return this.speedY;
        },
        setScale: function(scale) {
            this.scale.x = this.scale.y = scale;
        },
        getId: function() {
            return this.id;
        },
        setId: function(id) {
            this.id = id;
        },
        getDirrection: function() {
            return this.dirrection;
        },
        setDirrection: function(dirrection) {
            this.dirrection = dirrection;
        },
        moveXBy: function(offsetX) {
            this.position.x += offsetX;
        },
        moveYBy: function(offsetY) {
            this.position.y += offsetY;
        },
        setXY: function(x, y) {
            this.position.x = x;
            this.position.y = y;
        }
    };
    _.extend(_sprite, Methods);

    for (var i = 0; i < Methods.holder.length; i++) {
        Game.instance.addModel(Methods.holder[i]);
    }
    
    return _sprite;
};