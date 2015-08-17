window.onload = function() {
    var BattleCity = (function(){
            
        var _tailWidth = Game.config.tailSize.width;
        var _tailHeight = Game.config.tailSize.height;
        var _prevUnixTime = new Date().getTime();
        var _curUnixTime = 0;
        var _timeDelta = 0;
        var _keyboard = new Keyboard();

        var GameLoop = {
            currentLevel: 0,
            
            screenSizes: function() {
                return {
                    width: this.getMap()[0].length * Game.config.tailSize.width,
                    height: this.getMap().length * Game.config.tailSize.height
                };
            },
            initialize: function() {
                this.renderer = new PIXI.autoDetectRenderer(this.screenSizes().width, this.screenSizes().height);
                document.body.appendChild(this.renderer.view);
                this.stage = new PIXI.Container();
                requestAnimationFrame(GameLoop.animate);
            },
            animate: function() {
                requestAnimationFrame(GameLoop.animate);
                GameLoop.renderer.render(GameLoop.stage);
                _curUnixTime = new Date().getTime();
                _timeDelta = _curUnixTime - _prevUnixTime;
                _prevUnixTime = _curUnixTime;
                for (var i = 0; i < GameLoop.stage.children.length; i++) {
                    if (GameLoop.stage.children[i].render) {
                        GameLoop.stage.children[i].render();
                    }
                    if (GameLoop.stage.children[i].AIPlay) {
                        GameLoop.stage.children[i].AIPlay();
                    }
                }
            },
            getTime: function() {
                return new Date().getTime();
            },
            addModel: function(model) {
                GameLoop.stage.addChild(model);
                this.zIndexReorder();
            },
            zIndexReorder: function() {
                GameLoop.stage.children.sort(function (a,b) {
                    if (a.zIndex < b.zIndex)
                        return -1;
                    if (a.zIndex > b.zIndex)
                        return 1;
                    return 0;
                });
            },
            removeModel: function(model) {
                GameLoop.stage.removeChild(model);
            },
            getModel: function(name) {
                return GameLoop.models[name];
            },
            getTimeDelta: function() {
                return _timeDelta;
            },
            getMapCellAt: function(x, y) {
                return (x < 0 || y < 0 || x >= this.getMap()[0].length || y >= this.getMap().length) ? 0 : this.getMap()[y][x];
            },
            getMap: function() {
                return Loader.resources['level' + this.currentLevel].data;
            },
            getMapSize: function() {
                return {
                    width: this.getMap()[0].length,
                    height: this.getMap().length
                };
            },
            getChildren: function() {
                return GameLoop.stage.children;
            },
            getChildrenByType: function(types) {
                return _.filter(GameLoop.stage.children, function(child) {
                    return Utils.inArray(child.type, types);
                });
            },
            getRandomPowerUp: function() {
                var powerUps = _.filter(Game.types.powerUps, function(powerUp) {
                    return powerUp.applyable;
                });
                return powerUps[Math.round((powerUps.length - 1) * Math.random())].id;
            },
            throwPowerUp: function(powerUpType) {
                // PowerUp position
                var mapSize = GameLoop.getMapSize();
                
                if (typeof powerUpType === 'undefined') {
                    powerUpType = GameLoop.getRandomPowerUp();
                }
                var powerUp = new PowerUp(powerUpType);
                powerUp.setPosition(
                    Math.round(mapSize.width * _tailWidth * Math.random()),
                    Math.round(mapSize.height * _tailHeight * Math.random())
                );
                Game.instance.addModel(powerUp);
            }
        };

        GameLoop.initialize();

        return  {
            addModel: GameLoop.addModel,
            screenSize: GameLoop.screenSizes,
            currentLevel: GameLoop.currentLevel,
            getMap: GameLoop.getMap,
            getMapSize: GameLoop.getMapSize,
            getChildren: GameLoop.getChildren,
            getChildrenByType: GameLoop.getChildrenByType,
            getMapCellAt: GameLoop.getMapCellAt,
            getTime: GameLoop.getTime,
            getTimeDelta: GameLoop.getTimeDelta,
            input: _keyboard,
            removeModel: GameLoop.removeModel,
            zIndexReorder: GameLoop.zIndexReorder,
            throwPowerUp: GameLoop.throwPowerUp
        };
    });

    Loader = new PIXI.loaders.Loader();
    
    // Load game resources
    _.each(Game.config.assets, function(v, f) {
        if (typeof Game.config.assets[f] === 'object') {
            _.each(v, function(el, i) {
                Loader.add('level' + i, el);
            });
        } else {
            Loader.add(f, v);
        }
    });
    
    Loader.once('complete', 
        function() {
            /* Game instance create */
            Game.instance = new BattleCity();

            /* First players initialization */
            for (var i = 0; i < Game.players.length; i++) {
                /* Create player instance */
                Game.players[i].instance = new Tank(i);

                /* Add player to scene */
                Game.instance.addModel(Game.players[i].instance);
            }

            /* Player 1 input handling */
            Game.players[0].instance.handleInput = function() {
                if (Game.instance.input.keys.left) {
                    this.moveLeft();
                }
                else if (Game.instance.input.keys.right) {
                    this.moveRight();
                }
                else if (Game.instance.input.keys.up) {
                    this.moveUp();
                }
                else if (Game.instance.input.keys.down) {
                    this.moveDown();
                }
                if (Game.instance.input.keys.z) {
                    this.shot();
                }
            };

            /* Player 2 input handling */
            Game.players[1].instance.handleInput = function() {
                if (Game.instance.input.keys.num4) {
                    this.moveLeft();
                }
                else if (Game.instance.input.keys.num6) {
                    this.moveRight();
                }
                else if (Game.instance.input.keys.num8) {
                    this.moveUp();
                }
                else if (Game.instance.input.keys.num5) {
                    this.moveDown();
                }
                if (Game.instance.input.keys.num9) {
                    this.shot();
                }
            };
            
            Game.instance.throwPowerUp();
            
            window.map = new Map(Game.instance.currentLevel);
        }
    );
    Loader.load();
};