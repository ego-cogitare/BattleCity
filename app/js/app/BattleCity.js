window.onload = function() {
    var BattleCityGame = (function(){
        var _tailWidth = Game.config.tailSize.width;
        var _tailHeight = Game.config.tailSize.height;
        var _prevUnixTime = Date.now();
        var _curUnixTime = 0;
        var _timeDelta = 0;
        
        var GameLoop = {
            currentLevel: 0,
            collidableTiles: [
                Game.types.mapTails.concrete, 
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
            
            screenSizes: function() {
                var mapData = Loader.resources['level' + GameLoop.currentLevel].data;
                return {
                    width: mapData.length * Game.config.tailSize.width,
                    height: mapData[0].length * Game.config.tailSize.height
                };
            },
            browserDetect: function() {
                var ua = navigator.userAgent, tem,
                    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                    if (/trident/i.test(M[1])){
                    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return 'IE ' + (tem[1] || '');
                }
                if (M[1] === 'Chrome'){
                    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                    if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
                }
                M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
                
                return M.join(' ');
            },
            initialize: function() {
                GameLoop.renderer = new PIXI.autoDetectRenderer(GameLoop.screenSizes().width, GameLoop.screenSizes().height);
                document.body.appendChild(GameLoop.renderer.view);
                GameLoop.stage = new PIXI.Container();
                requestAnimationFrame(GameLoop.animate);
                
                /* Frame rate counter */
                GameLoop.frameRate = 0;
                setInterval(function() { 
                    document.getElementById('frameRate').innerHTML = 'FPS: ' + GameLoop.frameRate + ' OBJECTS: ' + GameLoop.getChildren().length;
                    GameLoop.frameRate = 0; 
                }, 1000);
                
                /* Autoremoving powerups */
                setInterval(function() {
                    _.each(BattleCity.getChildrenByType(['tank']), function (tank) {
                        _.each(tank.powerUps, function(powerUp) {
                            if (powerUp) {
                                var powerUpInfo = _.find(Game.types.powerUps, { id: powerUp.id });
                                if (powerUpInfo && powerUpInfo.time !== -1 && powerUp.timeAdd + powerUpInfo.time < BattleCity.getTime()) {
                                    tank.removePowerUp(powerUp.id);
                                }
                            }
                        });
                    });
                }, 1000);
            },
            animate: function() {
                GameLoop.frameRate++;
                requestAnimationFrame(GameLoop.animate);
                GameLoop.renderer.render(GameLoop.stage);
                _curUnixTime = Date.now();
                _timeDelta = _curUnixTime - _prevUnixTime;
                _prevUnixTime = _curUnixTime;
                
                /* Render main game screen */
                _.each(BattleCity.getChildrenByType(['tank','shell','powerUp']), function(model) { 
                    try { model.render(); } catch (e) {}
                    try { model.AIPlay(); } catch (e) {}
                });
            },
            gameOver: function() {
                BattleCity.map.killCrest();
                console.log('Game over');
            },
            getTime: function() {
                return Date.now();
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
            getChildren: function() {
                return GameLoop.stage.children;
            },
            getChildrenByType: function(types) {
                return _.filter(GameLoop.stage.children, function(child) {
                    return _.contains(types, child.type);
                });
            },
            getRandomPowerUp: function() {
                return _.sample(_.where(Game.types.powerUps, { applyable: true })).id;
            },
            throwPowerUp: function(powerUpType) {
                var mapSize = BattleCity.map.getMapSize();
                if (typeof powerUpType === 'undefined') {
                    powerUpType = GameLoop.getRandomPowerUp();
                }
                var powerUp = new PowerUp(powerUpType).setPosition(
                    (_.random(mapSize.width - 2) + 1) * _tailWidth,
                    (_.random(mapSize.height - 2) + 1) * _tailHeight
                );
                this.addModel(powerUp);
            },
            getTanksByModelName: function(modelName) {
                var tanks = [];
                _.each(GameLoop.getChildrenByType(['tank']), function(tank) {
                    if (tank.model.name === modelName) {
                        tanks.push(tank);
                    }
                });
                return tanks;
            },
            getTankById: function(id) {
                return _.findWhere(GameLoop.stage.children, { id: id });
            },
            getTankModelByName: function(modelName) {
                return _.find(Game.types.tankModels, { name: modelName });
            },
            addBot: function(model) {
                var tank = new Tank(model);
                this.addModel(tank);
                return tank;
            },
            addAssets: function() {
                _.each(Game.config.assets, function (v, f) {
                    if (typeof Game.config.assets[f] === 'object') {
                        _.each(v, function (el, i) {
                            Loader.add('level' + i, el);
                        });
                    } else {
                        Loader.add(f, v);
                    }
                });
            }
        };

        return {
            initialize: GameLoop.initialize,
            addAssets: GameLoop.addAssets,
            addModel: GameLoop.addModel,
            getTankModelByName: GameLoop.getTankModelByName,
            screenSize: GameLoop.screenSizes,
            currentLevel: GameLoop.currentLevel,
            collidableTiles: GameLoop.collidableTiles,
            getChildren: GameLoop.getChildren,
            getTanksByModelName: GameLoop.getTanksByModelName,
            getTankById: GameLoop.getTankById,
            getChildrenByType: GameLoop.getChildrenByType,
            getTime: GameLoop.getTime,
            getTimeDelta: GameLoop.getTimeDelta,
            input: new Keyboard(),
            map: GameLoop.map,
            gameOver: GameLoop.gameOver,
            removeModel: GameLoop.removeModel,
            zIndexReorder: GameLoop.zIndexReorder,
            throwPowerUp: GameLoop.throwPowerUp,
            addBot: GameLoop.addBot
        };
    });

    /* Assets PIXI.js loader */
    Loader = new PIXI.loaders.Loader();
    
    /* Game instance */
    BattleCity = new BattleCityGame();
    
    /* Create required game resources list */
    BattleCity.addAssets();
    
    /* Start resources loading */
    Loader.load();
    
    /* After all resources are loaded */
    Loader.once('complete', 
        function() {

            /* Gameloop initialization */
            BattleCity.initialize();
            
            /* Create game map instance */
            BattleCity.map = new Map();
            
            /* Load game map */
            BattleCity.map.load(BattleCity.currentLevel);
            
            /* Mobile input detection */
            var mobileInput = new SwipeDetect();

            /* Create human players to stage */
            var player1 = new Tank('player1');
            var player2 = new Tank('player2');

            /* Add human players to stage */
            BattleCity.addModel(player1);
            BattleCity.addModel(player2);
            
            /* Player 1 input handling */
            player1.handleInput = function() {
                if (BattleCity.input.keys.left) {
                    this.moveLeft();
                }
                else if (BattleCity.input.keys.right) {
                    this.moveRight();
                }
                else if (BattleCity.input.keys.up) {
                    this.moveUp();
                }
                else if (BattleCity.input.keys.down) {
                    this.moveDown();
                }
                if (BattleCity.input.keys.z) {
                    this.shot();
                }
                
                mobileInput.handleInput();
                while (mobileInput.queue()) {
                    var command = mobileInput.pop();
                    
                    switch (command.type) {
                        case 'longSwipe': 
                            switch (command.direction) {
                                case 'top':
                                    this.moveUp();
                                break;
                                
                                case 'right': 
                                    this.moveRight();
                                break;
                                
                                case 'bottom':
                                    this.moveDown();
                                break;
                                
                                case 'left':
                                    this.moveLeft();
                                break;
                            }
                        break;
                        
                        case 'quckSwipe': 
                            this.setDirrection(command.direction);
                        break;
                        
                        case 'touch': 
                            this.shot();
                        break;
                    }
                };
            };

            /* Player 2 input handling */
            player2.handleInput = function() {
                if (BattleCity.input.keys.num4) {
                    this.moveLeft();
                }
                else if (BattleCity.input.keys.num6) {
                    this.moveRight();
                }
                else if (BattleCity.input.keys.num8) {
                    this.moveUp();
                }
                else if (BattleCity.input.keys.num5) {
                    this.moveDown();
                }
                if (BattleCity.input.keys.num9) {
                    this.shot();
                }
            };
            
            BattleCity.throwPowerUp(Game.types.powerUps.shovel.id);
            for (var i = 0; i < 1; i++) {
                var x = 0;
                _(['T1','T2','T3','T4','T5','T6','T7','T8']).each(function(modelName) {
                    x++;
                    BattleCity.addBot(modelName).setXY(x * 64 + 32, i * 128 + 32);
                });
            }
        }
    );
};