window.onload = function() {
    var BattleCity = (function(){
            
        var _prevUnixTime = new Date().getTime();
        var _curUnixTime = 0;
        var _timeDelta = 0;
        var _keyboard = new Keyboard();

        var GameLoop = {
            initialize: function() {
                this.renderer = new PIXI.CanvasRenderer(800, 600);
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
                    GameLoop.stage.children[i].render();
                }
            },
            getTime: function() {
                return new Date().getTime();
            },
            addModel: function(model) {
                GameLoop.stage.addChild(model);
            },
            removeModel: function(model) {
                GameLoop.stage.removeChild(model);
            },
            getModel: function(name) {
                return GameLoop.models[name];
            },
            getTimeDelta: function() {
                return _timeDelta;
            }
        };

        GameLoop.initialize();

        return  {
            addModel: GameLoop.addModel,
            removeModel: GameLoop.removeModel,
            input: _keyboard,
            screenWidth: GameLoop.renderer.width,
            screenHeight: GameLoop.renderer.height,
            getTime: GameLoop.getTime,
            getTimeDelta: GameLoop.getTimeDelta
        };
    });

    Game = {
        instance: null,
        players: [
            {
                instance: null,
                scale: 2,
                speed: 3.0,
                initX: 300,
                initY: 550
            },
            {
                instance: null,
                scale: 2,
                speed: 3.0,
                initX: 700,
                initY: 550
            }
        ]
    };

    Loader = new PIXI.loaders.Loader();
    Loader.add('Atlas', 'app/asset/textures/atlas.png');
    Loader.once('complete', 
        function() {
            /* Game instance create */
            Game.instance = new BattleCity();

            /* First players initialization */
            for (var i = 0; i < Game.players.length; i++) {
                /* Create player instance */
                Game.players[i].instance = new Tank(i);

                /* Player speed / scale etc */
                Game.players[i].instance.setScale(Game.players[i].scale);
                Game.players[i].instance.setSpeed(Game.players[i].speed);
                Game.players[i].instance.setXY(Game.players[i].initX, Game.players[i].initY);

                /* Add player to scene */
                Game.instance.addModel(Game.players[i].instance);
            }

            /* Player 1 input handling */
            Game.players[0].instance.handleInput = function() {
                if (Game.instance.input.keys.left) {
                    this.setDirrection(Dirrections.left);
                    this.setSpeedX(-this.getSpeed());
                }
                else if (Game.instance.input.keys.right) {
                    this.setDirrection(Dirrections.right);
                    this.setSpeedX(this.getSpeed());
                }
                else if (Game.instance.input.keys.up) {
                    this.setDirrection(Dirrections.top);
                    this.setSpeedY(-this.getSpeed());
                }
                else if (Game.instance.input.keys.down) {
                    this.setDirrection(Dirrections.bottom);
                    this.setSpeedY(this.getSpeed());
                }
                if (Game.instance.input.keys.z) {
                    this.shot();
                }
            };

            /* Player 2 input handling */
            Game.players[1].instance.handleInput = function() {
                if (Game.instance.input.keys.num4) {
                    this.setDirrection(Dirrections.left);
                    this.setSpeedX(-this.getSpeed());
                }
                else if (Game.instance.input.keys.num6) {
                    this.setDirrection(Dirrections.right);
                    this.setSpeedX(this.getSpeed());
                }
                else if (Game.instance.input.keys.num8) {
                    this.setDirrection(Dirrections.top);
                    this.setSpeedY(-this.getSpeed());
                }
                else if (Game.instance.input.keys.num5) {
                    this.setDirrection(Dirrections.bottom);
                    this.setSpeedY(this.getSpeed());
                }
                if (Game.instance.input.keys.num9) {
                    this.shot();
                }
            };
        }
    );
    Loader.load();
};