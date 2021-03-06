var Tank = function(modelName) {

    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    var ID = BattleCity.getTime() + BattleCity.getChildrenByType(['tank']).length;
    var model = BattleCity.getTankModelByName(modelName);
    var _tailRegion = _.extend(
        {
            player1 : { x: 0,               y: 0,                width: _tailWidth * 4, height: _tailHeight * 8 },
            player2 : { x: 0,               y: _tailHeight * 16, width: _tailWidth * 4, height: _tailHeight * 8 },
            T1      : { x: _tailWidth * 16, y: 0,                width: _tailWidth * 4, height: _tailHeight * 2 },
            T2      : { x: _tailWidth * 16, y: _tailHeight * 2,  width: _tailWidth * 4, height: _tailHeight * 2 },
            T3      : { x: _tailWidth * 16, y: _tailHeight * 4,  width: _tailWidth * 4, height: _tailHeight * 2 },
            T4      : { x: _tailWidth * 16, y: _tailHeight * 6,  width: _tailWidth * 4, height: _tailHeight * 2 },
            T5      : { x: _tailWidth * 16, y: _tailHeight * 8,  width: _tailWidth * 4, height: _tailHeight * 2 },
            T6      : { x: _tailWidth * 16, y: _tailHeight * 10, width: _tailWidth * 4, height: _tailHeight * 2 },
            T7      : { x: _tailWidth * 16, y: _tailHeight * 12, width: _tailWidth * 4, height: _tailHeight * 2 },
            T8      : { x: _tailWidth * 16, y: _tailHeight * 14, width: _tailWidth * 4, height: _tailHeight * 2 }
        }
    )[modelName];
    
    var _tailRegionBlink = _.extend(
        {
            player1 : { x: _tailWidth * 16, y: _tailHeight * 16, width: _tailWidth * 4, height: _tailHeight * 8 },
            player2 : { x: _tailWidth * 16, y: _tailHeight * 16, width: _tailWidth * 4, height: _tailHeight * 8 },
            T1      : { x: _tailWidth * 16, y: _tailHeight * 16, width: _tailWidth * 4, height: _tailHeight * 2 },
            T2      : { x: _tailWidth * 16, y: _tailHeight * 18, width: _tailWidth * 4, height: _tailHeight * 2 },
            T3      : { x: _tailWidth * 16, y: _tailHeight * 20, width: _tailWidth * 4, height: _tailHeight * 2 },
            T4      : { x: _tailWidth * 16, y: _tailHeight * 22, width: _tailWidth * 4, height: _tailHeight * 2 },
            T5      : { x: _tailWidth * 16, y: _tailHeight * 24, width: _tailWidth * 4, height: _tailHeight * 2 },
            T6      : { x: _tailWidth * 16, y: _tailHeight * 26, width: _tailWidth * 4, height: _tailHeight * 2 },
            T7      : { x: _tailWidth * 16, y: _tailHeight * 28, width: _tailWidth * 4, height: _tailHeight * 2 },
            T8      : { x: _tailWidth * 16, y: _tailHeight * 30, width: _tailWidth * 4, height: _tailHeight * 2 }
        }
    )[modelName];
    
    var _frames = new TextureExploder(
        new PIXI.Texture(
            Loader.resources.Atlas.texture,
            _tailRegion
        )
    ).explode(_tailWidth * 2, _tailHeight * 2);
    
    var _framesBlink = new TextureExploder(
        new PIXI.Texture(
            Loader.resources.Atlas.texture,
            _tailRegionBlink
        )
    ).explode(_tailWidth * 2, _tailHeight * 2);
    
    var _explosion = new TextureExploder(
        new PIXI.Texture(
            Loader.resources.Atlas.texture,
            { x: _tailWidth * 32, y: _tailHeight * 11, width: _tailWidth * 12, height: _tailHeight * 8 }
        )
    ).explode(_tailWidth * 4, _tailHeight * 4);
    
    var _appearing = new TextureExploder(
        new PIXI.Texture(
            Loader.resources.Atlas.texture,
            { x: _tailWidth * 32, y: 2 * _tailHeight, width: _tailWidth * 8, height: _tailHeight * 2 }
        )
    ).explode(_tailWidth * 2, _tailHeight * 2);
    
    return _.extend(
        new PIXI.Sprite(), 
        {
            _animations: {},
            id: ID,
            type: 'tank',
            model: model,
            blink: false,
            bodyType: 0,
            zIndex: 1,
            speed: 2,
            speedX: 0,
            speedY: 0,
            dirrection: Game.types.tankDirrections.top,
            curentState: Game.types.tankStates.appearing,
            holder: [],
            holderSize: model.holderSize,
            cooldownTime: model.cooldownTime,
            lastShootTime: 0,
            pivot: new PIXI.Point(_tailWidth, _tailHeight),
            canMoveOn: [
                Game.types.mapTails.empty, 
                Game.types.mapTails.tree, 
                Game.types.mapTails.swamp
            ],
            canDestroy: [],
            canNotDestroy: model.canNotDestroy,
            powerUps: [],

            isHuman: function() {
                return model.isHuman;
            },
            isBot: function() {
                return !this.isHuman();
            },
            setBlink: function(blink) {
                if (blink) {
                    this.setBlinkBody();
                } else {
                    this.setDefaultBody();
                }
            },
            setBlinkBody: function() {
                _.extend(
                    this._animations,
                    {
                        stop: new Animation([
                            _frames[this.bodyType][0],
                            _framesBlink[this.bodyType][0]
                        ], 150),
                        move: new Animation([
                            _frames[this.bodyType][0],
                            _frames[this.bodyType][1],
                            _framesBlink[this.bodyType][0],
                            _framesBlink[this.bodyType][1]
                        ], 75)
                    }
                );
                this.blink = true;
            },
            setDefaultBody: function() {
                _.extend(
                    this._animations,
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
                this.blink = false;
            },
            getBlink: function() {
                return this.blink;
            },
            isCanDestroy: function(tailType) {
                return _.contains(this.canDestroy, tailType);
            },
            worseDestroyAbility: function(tailType) {
                this.canDestroy = _.without(this.canDestroy, tailType);
            },
            improveDestroyAbility: function(tailType) {
                this.canDestroy.push(tailType);
            },
            getBodyType: function() {
                return this.bodyType;
            },
            setBodyType: function(level) {
                this.bodyType = level;
                this.setBlink(this.blink);
            },
            improveBodyType: function() {
                this.setBodyType(++this.bodyType);
                return this.bodyType;
            },
            worsenBodyType: function() {
                this.setBodyType(--this.bodyType);
                return this.bodyType;
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
            isOpponent: function(tank) {
                return (this.isHuman() && !_.contains(['player1', 'player2'], tank.model.name) || this.isBot() && _.contains(['player1', 'player2'], tank.model.name));
            },
            applyPowerUp: function(powerUp) {
                if (!powerUp.applyable) {
                    return false;
                }
                BattleCity.removeModel(powerUp);
                
                switch (powerUp.id) {
                    case Game.types.powerUps.helmet.id:
                        if (this.powerUpExists(Game.types.powerUps.protectiveField.id) >= 0) {
                            this.updatePowerUp(Game.types.powerUps.protectiveField.id, { timeAdd: BattleCity.getTime() });
                        }
                        else {
                            var protectiveField = new PowerUp(Game.types.powerUps.protectiveField.id); 
                            protectiveField.attachTo(this);
                            BattleCity.addModel(protectiveField);
                            this.powerUps.push(protectiveField);
                        }
                    break;
                    
                    case Game.types.powerUps.grenade.id:
                        _.each(BattleCity.getChildrenByType(['tank']), function(tank){
                            if (this.isOpponent(tank)) {
                                tank.die();
                            }
                        }, this);
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
                                    this.improveDestroyAbility(Game.types.mapTails.concrete);
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
                        this.improveDestroyAbility(Game.types.mapTails.concrete);
                    break;
                    
                    case Game.types.powerUps.clock.id:
                        _.each(BattleCity.getChildrenByType(['tank']), function(tank){
                            if (this.isHuman() && !_.contains(['player1', 'player2'], tank.model.name) || this.isBot() && _.contains(['player1', 'player2'], tank.model.name)) {
                                if (tank.powerUpExists(Game.types.powerUps.clock.id) >= 0) {
                                    tank.updatePowerUp(Game.types.powerUps.clock.id, { timeAdd: BattleCity.getTime() });
                                }
                                else {
                                    tank
                                      .setState(Game.types.tankStates.freezed)
                                      .powerUps
                                      .push(powerUp);
                                }
                            }
                        }, this);
                    break;
                    
                    case Game.types.powerUps.shovel.id:
                        BattleCity.map.updateBase(
                            this.isHuman() ? 
                                Game.types.mapTails.concrete : 
                                Game.types.mapTails.empty
                        );
                    break;
                }
            },
            updatePowerUp: function(id, data) {
                return _.extend(_.find(this.powerUps, { id: id }), data);
            },
            removePowerUp: function(powerUpType) {
                _.each(this.powerUps, function(powerUp, index) {
                    if (powerUp.getId() === powerUpType) {
                        BattleCity.removeModel(powerUp);
                        
                        switch (powerUp.getId()) {
                            case Game.types.powerUps.clock.id:
                                this.setState(Game.types.tankStates.stop);
                            break;
                        }
                        
                        delete powerUp;
                        this.powerUps = _.filter(this.powerUps, function(powerUp, i) {
                            return i !== index;
                        });
                    }
                }, this);
            },
            powerUpExists: function(powerUpType) {
                var powerUpIndex = -1;
                _.each(this.powerUps, function(powerUp, index) {
                    if (powerUp.getId() === powerUpType) {
                        powerUpIndex = index;
                    }
                }, this);
                
                return powerUpIndex;
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

                this.texture = this._animations[this.curentState].getFrame(BattleCity.getTimeDelta());

                // Absolute position to map position
                var mapPosition = this.mapCoords();
                
                // Justify tank position on map
                this.justifyCoordsToMap();

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

                if 
                (
                    (
                        this.curentState === Game.types.tankStates.move
                    ) && 
                    (
                        this.position.x + this.speedX > BattleCity.screenSize().width - _tailWidth || 
                        this.position.x + this.speedX < _tailWidth || 
                        this.position.y + this.speedY > BattleCity.screenSize().height - _tailHeight || 
                        this.position.y + this.speedY < _tailHeight ||
                        !_.contains(this.canMoveOn, BattleCity.map.getMapCellAt(mapPosition.x, mapPosition.y)) ||
                        (
                            _.contains([Game.types.tankDirrections.top, Game.types.tankDirrections.bottom], this.dirrection) &&
                            !_.contains(this.canMoveOn, BattleCity.map.getMapCellAt(mapPosition.x - 1, mapPosition.y))
                        ) ||
                        (
                            _.contains([Game.types.tankDirrections.left, Game.types.tankDirrections.right], this.dirrection) &&
                            !_.contains(this.canMoveOn, BattleCity.map.getMapCellAt(mapPosition.x, mapPosition.y - 1))
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
                var children = BattleCity.getChildrenByType([this.type, 'powerUp']);
                
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
                var mapX = this.position.x >> 5;
                var mapY = this.position.y >> 5;

                return { x: mapX, y: mapY };
            },
            justifyCoordsToMap: function() {
                switch (this.dirrection) {
                    case Game.types.tankDirrections.top: case Game.types.tankDirrections.bottom:
                        if (this.position.x % _tailWidth > _tailWidth >> 1) {
                            this.position.x = (this.mapCoords().x << 5) + _tailWidth;
                        }
                        else {
                            this.position.x = this.mapCoords().x << 5;
                        }
                    break;

                    case Game.types.tankDirrections.left: case Game.types.tankDirrections.right:
                        if (this.position.y % _tailHeight > _tailHeight >> 1) {
                            this.position.y = (this.mapCoords().y << 5) + _tailHeight;
                        }
                        else {
                            this.position.y = this.mapCoords().y << 5;
                        }
                    break;
                }
            },
            getHolder: function() {
                return this.holder;
            },
            getHolderSize: function() {
                return this.holderSize;
            },
            shot: function() {
                if (this.canShot()) {
                    for (var i = 0; i < this.holder.length; i++) {
                        if (this.holder[i].getState() === Game.types.shellStates.ready && BattleCity.getTime() - this.lastShootTime >= this.cooldownTime) {
                            this.holder[i].setDirrection(this.dirrection);
                            this.holder[i].setPosition(this.position.x, this.position.y);
                            this.holder[i].shot();
                            this.lastShootTime = BattleCity.getTime();
                            if (this.isHuman()) {
                                PIXI.audioManager.getAudio('shot').play();
                            }
                        }
                    }
                }
            },
            handleInput: function() {
            },
            increaseHolder: function() {
                this.holder.push(new Shell());
                this.holder[this.holder.length - 1].setOwner(this);
                BattleCity.addModel(this.holder[this.holder.length - 1]);
                return this.holder[this.holderSize++];
            },
            getState: function() {
                return this.curentState;
            },
            setState: function(state) {
                if (typeof Game.types.tankStates[state] !== 'undefined') {
                    this.curentState = state;
                }
                return this;
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
                return this;
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
                return _.contains([
                    Game.types.tankStates.stop, 
                    Game.types.tankStates.move
                ], this.curentState);
            },
            canShot: function() {
                return this.canMove();
            },
            canDie: function() {
                return (
                    _.contains([
                        Game.types.tankStates.stop, 
                        Game.types.tankStates.move,
                        Game.types.tankStates.freezed
                    ], this.curentState) && 
                    this.powerUpExists(Game.types.powerUps.protectiveField.id) === -1
                );
            },
            moveForward: function() {
                if (this.canMove()) {
                    switch (this.dirrection) {
                        case Game.types.tankDirrections.top:
                            this.setSpeedY(-this.getSpeed());
                        break;
                        
                        case Game.types.tankDirrections.right:
                            this.setSpeedX(this.getSpeed());
                        break;
                        
                        case Game.types.tankDirrections.bottom:
                            this.setSpeedY(this.getSpeed());
                        break;
                        
                        case Game.types.tankDirrections.left:
                            this.setSpeedX(-this.getSpeed());
                        break;
                    }
                }
                return this;
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
                BattleCity.zIndexReorder();
            },
            clearPowerUps: function() {
                for (var i = 0; i < this.powerUps.length; i++) {
                    BattleCity.removeModel(this.powerUps[i]);
                }
                this.powerUps = [];
            },
            clearHolder: function() {
                for (var i = 0; i <= this.model.holderSize; i++) {
                    var shell = this.holder.pop();
                    if (shell) {
                        if (shell.getState() === Game.types.shellStates.flying) {
                            shell.dieOnReset = true;
                        }
                        else {
                            BattleCity.removeModel(shell);
                            delete shell;
                        }
                    }
                }
                this.holderSize = 0;
            },
            appeare: function() {
                // Reset animation
                this._animations.appearing.reset();
                
                // Set tank state to appearing
                this.setState(Game.types.tankStates.appearing);
                
                // Default dirrection
                this.setDirrection(Game.types.tankDirrections.top);
                
                // Player speed / scale etc
                this.setXY(model.initX, model.initY);
            },
            
            reset: function() {
                this.setState(Game.types.tankStates.stop);
                
                this.updateZIndex(1);
                
                // Disapply all powerUps
                this.clearPowerUps();
                
                // Initialize holder
                this.holder = [];
                this.holderSize = model.holderSize;
                for (var i = 0; i < this.holderSize; i++) {
                    this.holder.push(new Shell());
                    this.holder[i].setOwner(this).setSpeed(model.shellSpeed);
                    BattleCity.addModel(this.holder[i]);
                }
                
                // Tank can't break concrete walls as default
                for (var i = 0; i < this.canNotDestroy.length; i++) {
                    this.worseDestroyAbility(this.canNotDestroy[i]);
                }
                
                // Default body type
                this.setBodyType(0);
                
                // Set blinking
                this.setBlink(this.blink);
                
                // Model speed init
                this.setSpeed(model.speed);
            },
            shellHit: function() {
                if (this.canDie()) {
                    this.die();
                }
                
                // If blink flat set then power up thorows
                if (this.blink) {
                    // Clear all power ups on game field
                    BattleCity.removePowerUps();
                    
                    // Throw new one
                    BattleCity.throwPowerUp();
                }
            },
            die: function() {
                this.clearPowerUps();
                this.updateZIndex(5);
                this.setState(Game.types.tankStates.explosion);
                this._animations.explosion.reset();
                PIXI.audioManager.getAudio(this.isHuman() ? 'dieHuman' : 'dieBot').play();
            },
            // Reinitialization tank model depends on model type
            finalize: function() {
                this.clearHolder();
                if (this.isHuman()) {
                    this.appeare();
                }
                else {
                    BattleCity.removeModel(this);
                    delete this;
                }
            },

            initialize: function() {
                var self = this;
                
                this._animations = {
                    explosion: new Animation(
                        [ 
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
                            self.finalize();
                        }
                    ),
                    appearing: new Animation(
                        [
                            _appearing[0][0], 
                            _appearing[0][1], 
                            _appearing[0][2], 
                            _appearing[0][3], 
                            _appearing[0][2], 
                            _appearing[0][1], 
                            _appearing[0][0], 
                            _appearing[0][1], 
                            _appearing[0][2], 
                            _appearing[0][3], 
                            _appearing[0][2], 
                            _appearing[0][1], 
                            _appearing[0][0], 
                            _appearing[0][1], 
                            _appearing[0][2], 
                            _appearing[0][3], 
                            _appearing[0][2], 
                            _appearing[0][1],
                            _appearing[0][0]
                        ], 
                        70, 
                        function() {
                            self.reset();
                        }
                    )
                };
                
                // Define none braking blocks
                _.each(BattleCity.collidableTiles, function(collidableTile) {
                    if (!_.contains(this.canNotDestroy, collidableTile)) {
                        this.improveDestroyAbility(collidableTile);
                    }
                }, this);
                
                // Initialize tank body type
                this.appeare();
                
                // If player type equals to bot
                if (this.isBot()) {
                    _.extend(this, new AI());
                }

                return this;
            }
        }).initialize();
};