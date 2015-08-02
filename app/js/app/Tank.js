var Tank = function(ID) {

    var sprite = new PIXI.Sprite();
    var Frames = new TextureExploder(Loader.resources.Atlas.texture).explode(16, 16);
    
    /* Get animation depends of player ID */
    
    var _mapOffsetX = 0;
    var _mapOffsetY = 0;
    
    switch (ID) {
        case 1: 
            _mapOffsetY = 8;
        break;
    }
    
    var Animations = {
        stop: new Animation([ 
            Frames[3 + _mapOffsetY][6]
        ], 999),
        
        move: new Animation([ 
            Frames[3 + _mapOffsetY][6], 
            Frames[3 +_mapOffsetY][7] 
        ], 75)
    };

    var Methods = {

        id: ID,
        speed: 2,
        speedX: 0,
        speedY: 0,
        dirrection: Dirrections.top,
        curentState: States.stop,
        holderSize: 1,
        holder: [new Shell(),new Shell()],
        cooldownTime: 100,
        lastShootTime: 0,
        pivot: new PIXI.Point(7, 7),

        render: function() {
            this.setSpeedX(0);
            this.setSpeedY(0);
            
            /* Process user input */
            this.handleInput();
            
            /* If speed not zero - model is in a move state */
            if (this.getSpeedX() !== 0 || this.getSpeedY() !== 0) {
                this.setState(States.move);
            } else {
                this.setState(States.stop);
            }
            
            this.texture = Animations[this.curentState].getFrame(Game.instance.getTimeDelta());
            
            switch (this.dirrection) {
                case Dirrections.top:
                    this.rotation = -1.57;
                break;
                
                case Dirrections.right: 
                    this.rotation = 0;
                break;
                
                case Dirrections.bottom: 
                    this.rotation = 1.57;
                break;
                
                case Dirrections.left: 
                    this.rotation = 3.14;
                break;
            }
            
            if (this.position.x + this.speedX > Game.instance.screenWidth || this.position.x + this.speedX < 0 || 
                this.position.y + this.speedY > Game.instance.screenHeight || this.position.y + this.speedY < 0) 
            {
                this.speedX = 0;
                this.speedY = 0;
            } else {
                this.moveXBy(this.speedX);
                this.moveYBy(this.speedY);
            }
        },
        shot: function() {
            for (var i = 0; i < this.holder.length; i++) {
                if (this.holder[i].getState() === ShellStates.ready && Game.instance.getTime() - this.lastShootTime >= this.cooldownTime) {
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
            if (typeof States[state] !== 'undefined') {
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
    _.extend(sprite, Methods);

    for (var i = 0; i < Methods.holder.length; i++) {
        Game.instance.addModel(Methods.holder[i]);
    }
    
    return sprite;
};