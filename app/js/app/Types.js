var Dirrections = { top: 'top', right: 'right', bottom: 'bottom', left: 'left' };

var States = { stop: 'stop', move: 'move' };
var ShellStates = { flying: 'flying', ready: 'ready' };


Game = {
    instance: null,
    players: [
        {
            instance: null,
            scale: 1,
            speed: 4.0,
            initX: 300,
            initY: 550
        },
        {
            instance: null,
            scale: 1,
            speed: 4.0,
            initX: 700,
            initY: 550
        }
    ],
    config: {
        canvasSize: {
            width: 960,
            height: 600
        },
        tailSize: {
            width: 64,
            height: 64
        }
    }
};