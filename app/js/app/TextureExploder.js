var TextureExploder = function(texture) {

    var r = [];
    var t = new PIXI.Texture(texture);

    return {
        getTexture: function() {
            return t;
        },
        explode: function(cellWidth, cellHeight) {

            var cellsX = t.width / cellWidth;
            var cellsY = t.height / cellHeight;

            for (var i = 0; i < cellsY; i++) {
                r[i] = [];
                for (var j = 0; j < cellsX; j++) {
                    r[i][j] = new PIXI.Texture(
                                t,
                                { x: j * cellWidth, y: i * cellHeight, width: cellWidth, height: cellHeight }
                            );
                }
            }

            return r;
        }
    };

};