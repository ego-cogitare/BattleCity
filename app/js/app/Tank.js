var Tank = function(model) {

    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    var _tailRegion = {};
    var ID = new Date().getTime().toString();
    
    switch (model) {
        case Game.types.tankModels.player1:
            _tailRegion = { x: 0, y: 0, width: _tailWidth * 4, height: _tailHeight * 8 };
        break;
        
        case Game.types.tankModels.player2:
            _tailRegion = { x: 0, y: _tailHeight * 16, width: _tailWidth * 2 + 1, height: _tailHeight * 8 };
        break;
        
        default:
            _tailRegion = { x: _tailWidth * 16, y: _tailHeight * (model - 2) * 2, width: _tailWidth * 4, height: _tailHeight * 2 };
        break;
    }
    
    var _frames = new TextureExploder(
        new PIXI.Texture(
            Loader.resources.Atlas.texture,
            _tailRegion
        )
    ).explode(_tailWidth * 2, _tailHeight * 2);
    
    var _explosion = new TextureExploder(
        new PIXI.Texture(
            Loader.resources.Atlas.texture,
            { x: _tailWidth * 32, y: _tailHeight * 11, width: _tailWidth * 12, height: _tailHeight * 8 }
        )
    ).explode(_tailWidth * 4, _tailHeight * 4);
    
    var _animations = {
        explosion: new Animation([ 
            _explosion[0][0], 
            _explosion[0][1],
            _explosion[0][2],
            _explosion[1][0],
            _explosion[1][1],
            _explosion[1][0],
            _explosion[0][2]
        ], 
        60, 
        function() {
            Game.instance.getTankById(ID).reset();
        })
    };
    
    return _.extend(
        new PIXI.Sprite(), 
        {
            id: ID,
            type: 'tank',
            model: model,
            bodyType: 0,
            zIndex: 1,
            speed: 2,
            speedX: 0,
            speedY: 0,
            dirrection: Game.types.tankDirrections.top,
            curentState: Game.types.tankStates.stop,
            holder: [],
            holderSize: Game.modelParams[model].holderSize,
            cooldownTime: Game.modelParams[model].cooldownTime,
            lastShootTime: 0,
            pivot: new PIXI.Point(_tailWidth, _tailHeight),
            canMoveOn: [
                Game.types.mapTails.empty, 
                Game.types.mapTails.tree, 
                Game.types.mapTails.swamp
            ],
            canDestroy: [
                Game.types.mapTails.brick, 
                Game.types.mapTails.rightBrick, 
                Game.types.mapTails.bottomBrick,
                Game.types.mapTails.leftBrick,
                Game.types.mapTails.topBrick,
                Game.types.mapTails.flagAliveTopLeft,
                Game.types.mapTails.flagAliveTopRight,
                Game.types.mapTails.flagAliveBottomLeft,
                Game.types.mapTails.flagAliveBottomRight
            ],
            powerUps: [],

            isHuman: function() {
                return Utils.inArray(this.model, [Game.types.tankModels.player1, Game.types.tankModels.player2]);
            },
            isBot: function() {
                return !this.isHuman();
            },
            isCanDestroy: function(tailType) {
                return Utils.inArray(tailType, this.canDestroy);
            },
            improveDestroyAbility: function(tailType) {
                if (typeof Game.types.mapTails[tailType] !== 'undefined') {
                    this.canDestroy.push(tailType);
                }
            },
            getBodyType: function() {
                return this.bodyType;
            },
            setBodyType: function(level) {
                this.bodyType = level;
                
                _.extend(
                    _animations, 
                    {
                        stop: new Animation([ 
                            _frames[this.bodyType][0]
                        ], 999),

                        move: new Animation([ 
                            _frames[this.bodyType][0], 
                            _frames[this.bodyType][1] 
                        ], 75)
                    }
                );
            },
            improveBodyType: function() {
                this.setBodyType(++this.bodyType);
                return this.bodyType;
            },
            worsenBodyType: function() {
                this.setBodyType(--this.bodyType);
                return this.bodyType;
            },
            die: function() {
                this.clearPowerUps();
                this.updateZIndex(5);
                this.setState(Game.types.tankStates.explosion);
                _animations.explosion.reset();
            },
            updateState: function() {
                /* If speed not zero - model is in a move state */
                if ((this.speedX !== 0 || this.speedY !== 0) && this.canMove()) {
                    this.curentState = Game.types.tankStates.move;
                } 
                else if (this.curentState === Game.types.tankStates.move && this.speedX === 0 && this.speedY === 0) {
                    this.curentState = Game.types.tankStates.stop;
                }
            },
            applyPowerUp: function(powerUp) {
                if (!powerUp.applyable) {
                    return false;
                }
                var powerUpId = powerUp.id;
                Game.instance.removeModel(powerUp);
                delete powerUp;
                
                switch (powerUpId) {
                    case Game.types.powerUps.helmet.id:
                        var protectiveField = new PowerUp(Game.types.powerUps.protectiveField.id); 
                        protectiveField.attachTo(this);
                        Game.instance.addModel(protectiveField);
                        this.powerUps.push(protectiveField);
                    break;
                    
                    case Game.types.powerUps.grenade.id: 
                        this.die();
                    break;
                    
                    case Game.types.powerUps.star.id: 
                        if (this.bodyType < 3) {
                            switch (this.bodyType) {
                                case 0: 
                                    this.holder[0].setSpeed(15);
                                break;
                                case 1: 
                                    this.increaseHolder().setSpeed(15);
                                break;
                                case 2: 
                                    this.increaseHolder().setSpeed(15);
                                break;
                            }
                            this.improveBodyType();
                            this.powerUps.push(powerUp);
                        }
                    break;
                    
                    case Game.types.powerUps.gun.id: 
                        this.holder[0].setSpeed(15);
                        for (var i = this.holderSize; i < 3; i++) {
                            this.increaseHolder().setSpeed(15);
                        }
                        this.setBodyType(3);
                    break;
                }
                
                Game.instance.throwPowerUp();
            },
            removePowerUp: function(powerUpType) {
                _.each(this.powerUps, function(powerUp, index) {
                    if (powerUp.getId() === powerUpType) {
                        Game.instance.removeModel(powerUp);
                        delete powerUp;
                        delete this.powerUps[index];
                        if (this.powerUps.length === 1) {
                            this.powerUps = [];
                        }
                    }
                }, this);
            },
            render: function() {
                if (this.isHuman()) {
                    this.setSpeedX(0);
                    this.setSpeedY(0);
                }

                /* Process user input */
                this.handleInput();

                /* Check model state */
                this.updateState();

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
                        ) ||
                        this.collisionDetected()
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
            getShape: function() {
                return [
                    {
                        x: this.position.x - _tailWidth + this.speedX,
                        y: this.position.y - _tailHeight + this.speedY
                    },
                    {
                        x: this.position.x + _tailWidth + this.speedX,
                        y: this.position.y + _tailHeight + this.speedY
                    }
                ];
            },
            collisionDetected: function() {
                var children = Game.instance.getChildrenByType([this.type, 'powerUp']);
                
                for (var i = 0; i < children.length; i++) {
                    if ((children[i].getId() !== this.id || children[i].type !== this.type) &&
                        Utils.rectIntersect(
                            this.getShape()[0], 
                            this.getShape()[1],
                            children[i].getShape()[0],
                            children[i].getShape()[1]
                        )) 
                    {
                        // If detected colision with powerUp we should apply it to player
                        if (children[i].type === 'powerUp') {
                            this.applyPowerUp(children[i]);
                        }
                        else {
                            return children[i];
                        }
                    } 
                }
                return false;
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
            getHolder: function() {
                return this.holder;
            },
            getHolderSize: function() {
                return this.holderSize.length;
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
                this.holder[this.holder.length - 1].setOwner(this);
                Game.instance.addModel(this.holder[this.holder.length - 1]);
                return this.holder[this.holderSize++];
            },
            decreaseHolder: function() {
                Game.instance.removeModel(this.holder.pop());
                if (this.holderSize > 0) {
                    this.holderSize--;
                }
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
            },
            canMove: function() {
                return Utils.inArray(this.curentState, [Game.types.tankStates.stop, Game.types.tankStates.move]);
            },
            moveUp: function() {
                if (this.canMove()) {
                    this.setDirrection(Game.types.tankDirrections.top);
                    this.setSpeedY(-this.getSpeed());
                }
            },
            moveRight: function() {
                if (this.canMove()) {
                    this.setDirrection(Game.types.tankDirrections.right);
                    this.setSpeedX(this.getSpeed());
                }
            },
            moveDown: function() {
                if (this.canMove()) {
                    this.setDirrection(Game.types.tankDirrections.bottom);
                    this.setSpeedY(this.getSpeed());
                }
            },
            moveLeft: function() {
                if (this.canMove()) {
                    this.setDirrection(Game.types.tankDirrections.left);
                    this.setSpeedX(-this.getSpeed());
                }
            },
            updateZIndex: function(zIndex) {
                this.zIndex = zIndex;
                Game.instance.zIndexReorder();
            },
            clearPowerUps: function() {
                for (var i = 0; i < this.powerUps.length; i++) {
                    Game.instance.removeModel(this.powerUps[i]);
                    delete this.powerUps[i];
                }
                this.powerUps = [];
            },
            reset: function() {
                this.setState(Game.types.tankStates.stop);
                
                this.updateZIndex(1);
                
                // Disapply all powerUps
                this.clearPowerUps();
                
                // Initialize holder
                this.holder = [];
                this.holderSize = Game.modelParams[this.model].holderSize;
                for (var i = 0; i < this.holderSize; i++) {
                    this.holder.push(new Shell());
                    this.holder[i].setOwner(this);
                    Game.instance.addModel(this.holder[i]);
                }
                
                // Default body type
                this.setBodyType(0);
                
                // Default dirrection
                this.setDirrection(Game.types.tankDirrections.top);
                
                // Player speed / scale etc
                this.setScale(Game.modelParams[this.model].scale);
                this.setSpeed(Game.modelParams[this.model].speed);
                this.setXY(Game.modelParams[this.model].initX, Game.modelParams[this.model].initY);
            },

            initialize: function() {
                // Initialize tank body type
                this.reset();
                
                // If player type equals to bot
                if (this.isBot()) {
                    _.extend(this, new AI());
                }

                return this;
            }
        }).initialize();
};