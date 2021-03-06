var Shell = function() {
    
    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    var _explosion = new PIXI.Texture(
        Loader.resources.Atlas.texture,
        { x: _tailWidth * 33, y: _tailHeight * 12, width: _tailWidth * 2, height: _tailHeight * 2 }
    );
    var _animations = {
        explosion: new Animation(
            [ 
                _explosion,
                _explosion
            ], 
            100, 
            function() {
                Shell.reset();
            }
        ),
        flying: new Animation(
            [ 
                new PIXI.Texture(
                    Loader.resources.Atlas.texture,
                    { x: 1283, y: 80, width: 32, height: 32 }
                )
            ], 
            999
        )
    };
    
    var Shell = _.extend(
        new PIXI.Sprite(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                { x: 1288, y: 72, width: _tailWidth, height: _tailHeight }
            )
        ), 
        {
            _speed: 7,
            _speedX: 0,
            _speedY: 0,
            _dirrection: null,

            id: BattleCity.getTime() + BattleCity.getChildrenByType(['shell']).length,
            type: 'shell',
            zIndex: 3,
            pivot: new PIXI.Point(_tailWidth / 2, _tailHeight / 2),
            state: Game.types.shellStates.ready,
            visible: false,
            owner: null,
            collideWith: BattleCity.collidableTiles,
            dieOnReset: false,
            
            getId: function() {
                return this.id;
            },
            addCollideableTail: function(tailType) {
                this.collideWith.push(tailType);
            },
            removeCollideableTail: function(tailType) {
                this.collideWith = _.filter(this.collideWith, function(tail) {
                    return tail !== tailType;
                });
            },
            getDirrection: function() {
                return this._dirrection;
            },
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
            setOwner: function(owner) {
                this.owner = owner;
                return this;
            },
            getOwner: function() {
                return this.owner;
            },
            setState: function(state) {
                this.state = state;
            },
            die: function() {
                // Move model to fix explosion point
                switch (this._dirrection) {
                    case Game.types.tankDirrections.top:
                        this.position.x -= _tailWidth / 2;
                    break;
                    
                    case Game.types.tankDirrections.right:
                        this.position.x += _tailWidth / 2;
                        this.position.y -= _tailHeight / 2;
                    break;
                    
                    case Game.types.tankDirrections.bottom:
                        this.position.x += _tailWidth / 2;
                        this.position.y += _tailHeight / 2;
                    break;
                    
                    case Game.types.tankDirrections.left:
                        this.position.x += _tailWidth / 2;
                        this.position.y += _tailHeight / 2;
                    break;
                }
                this._speedX = this._speedY = 0;
                this.setState(Game.types.shellStates.explosion);
                _animations.explosion.reset();
            },
            reset: function() {
                if (this.dieOnReset) {
                    BattleCity.removeModel(this);
                    delete this;
                }
                else {
                    this.visible = false;
                    this._speedX = this._speedY = 0;
                    this.state = Game.types.shellStates.ready;
                }
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
                
                if (this.state !== Game.types.shellStates.ready) {
                    this.texture = _animations[this.state].getFrame(BattleCity.getTimeDelta());
                }
                
                if (this.state === Game.types.shellStates.flying && this.collisionDetected()) {
                    this.die();
                }

                if (this.position.x > BattleCity.screenSize().width || 
                    this.position.x < 0 || this.position.y > BattleCity.screenSize().height || 
                    this.position.y < 0
                ) {
                    this.reset();
                }
            },
            getShape: function() {
                return [
                    {
                        x: this.position.x - 8,
                        y: this.position.y - 8
                    },
                    {
                        x: this.position.x + 8,
                        y: this.position.y + 8
                    }
                ];
            },
            mapCoords: function() {
                var mapX = Math.round(this.position.x / _tailWidth);
                var mapY = Math.round(this.position.y / _tailHeight);

                return { x: mapX, y: mapY };
            },
            collisionDetected: function() {
                var mapCoords = this.mapCoords();
                var mapCell = BattleCity.map.getMapCellAt(mapCoords.x, mapCoords.y);
                var mapCell_x = BattleCity.map.getMapCellAt(mapCoords.x - 1, mapCoords.y);
                var mapCell_y = BattleCity.map.getMapCellAt(mapCoords.x, mapCoords.y - 1);
                
                var colided = _.contains(
                    this.collideWith,
                    mapCell
                );
        
                var colided_x = _.contains(
                    this.collideWith,
                    mapCell_x
                );
        
                var colided_y = _.contains(
                    this.collideWith,
                    mapCell_y
                );
        
                if (colided || colided_x || colided_y) {
                    var collisionPoints = [{
                        x: mapCoords.x,
                        y: mapCoords.y
                    }];
                    
                    switch (this._dirrection) {
                        case Game.types.tankDirrections.top: case Game.types.tankDirrections.bottom: 
                            collisionPoints.push({
                                x: mapCoords.x - 1,
                                y: mapCoords.y
                            });
                        break;
                        
                        case Game.types.tankDirrections.left: case Game.types.tankDirrections.right: 
                            collisionPoints.push({
                                x: mapCoords.x,
                                y: mapCoords.y - 1
                            });
                        break;
                    } 
                    
                    _.each(collisionPoints, function(point) {
                        if (BattleCity.map.isCrestCell(point.x, point.y)) {
                            BattleCity.gameOver();
                        }
                        else if (this.getOwner().isCanDestroy(BattleCity.map.getMapCellAt(point.x, point.y))) {
                            BattleCity.map.replaceCell(point.x, point.y, Game.types.mapTails.empty);
                            if (this.getOwner().isHuman()) {
                                PIXI.audioManager.getAudio('brickRemove').play();
                            }
                        }
                        else if (BattleCity.map.getMapCellAt(point.x, point.y) === Game.types.mapTails.concrete) {
                            if (this.getOwner().isHuman()) {
                                PIXI.audioManager.getAudio('concrete').play();
                            }
                        }
                    }, this);
                }
                // Check for collisions with tanks
                else 
                {
                    var children = BattleCity.getChildrenByType([this.type, 'tank']);
                
                    for (var i = 0; i < children.length; i++) {
                        if ((children[i].getId() !== this.id || children[i].type !== this.type) &&
                            children[i].getState() !== Game.types.tankStates.explosion &&
                            Utils.rectIntersect(
                                this.getShape()[0], 
                                this.getShape()[1],
                                children[i].getShape()[0],
                                children[i].getShape()[1]
                            )) 
                        {
                            // Shell collided with other shell
                            if (children[i].type === this.type && 
                                children[i].getState() === Game.types.shellStates.flying &&
                                children[i].getOwner() !== this.getOwner()) 
                            {
                                children[i].reset();
                                this.reset();
                            }
                            // Shell collided with tank
                            else if (children[i].type === 'tank' && 
                                this.getOwner().getId() !== children[i].getId() &&
                                (
                                    children[i].isBot() && this.getOwner().isHuman() || 
                                    children[i].isHuman() && this.getOwner().isBot()
                                ) 
                            )
                            {
                                // Return shell to holder
                                this.reset();
                                
                                // Hit tank by shell 
                                children[i].shellHit(this);
                            }
                        } 
                    }
                }
                
                return ((colided || colided_x) && this._speedX === 0) || ((colided || colided_y) && this._speedY === 0);
            },
            initialize: function() {
                this.scale.x = 1;
                this.scale.y = 1;
                
                return this;
            }
        }
    ).initialize();
    
    return Shell;
};