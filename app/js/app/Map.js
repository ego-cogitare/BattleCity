var Map = function(map) {
    
    var _map = {};
    
    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    
    var _tiles = new TextureExploder(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                { x: _tailWidth * 16, y: _tailHeight * 4, width: _tailWidth * 3, height: _tailHeight * 2 }
            )
        ).explode(_tailWidth / 2, _tailHeight / 2);
    
    _.extend(_map, {
        getTail: function(id) {
            var tailMap = [
                { x: 3, y: 1 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 3, y: 0 },
                { x: 4, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 1 },
                { x: 2, y: 1 }
            ];
            return new PIXI.Sprite(_tiles[tailMap[id].y][tailMap[id].x])
        },
        init: function() {
            for (var i = 0; i < Game.instance.getMap(map).length; i++) {
                for (var j = 0; j < Game.instance.getMap(map)[i].length; j++) {
                    
                    var tileSprite = this.getTail(Game.instance.getMap(map)[i][j]);
                    tileSprite.position.x = j * (_tailWidth / 2);
                    tileSprite.position.y = i * (_tailHeight / 2);
                    tileSprite.render = function() {};
            
                    Game.instance.addModel(tileSprite);
                }
            }
        },
        render: function() {

        }
    });
    
    _map.init();
    
    return _map;
    
};