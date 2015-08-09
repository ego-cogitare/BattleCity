Game = {
    instance: null,
    types: {
        tankDirrections: { 
            top: 'top', 
            right: 'right', 
            bottom: 'bottom', 
            left: 'left' 
        },
        tankStates: { 
            stop: 'stop', 
            move: 'move'
        },
        shellStates: {
            ready: 'ready',
            flying: 'flying'
        }
    },
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
        assets: {
            Atlas: 'app/asset/textures/atlas4x.png',
            Level01: 'app/asset/maps/level01.json'
        },
        canvasSize: {
            width: 800,
            height: 800
        },
        tailSize: {
            width: 64,
            height: 64
        }
    }
};