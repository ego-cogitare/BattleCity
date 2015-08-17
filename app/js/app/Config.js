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
            move: 'move',
            explosion: 'explosion'
        },
        shellStates: {
            ready: 'ready',
            flying: 'flying',
            explosion: 'explosion'
        },
        mapTails: {
            empty: 0,
            brick: 1,
            rightBrick: 2,
            bottomBrick: 3,
            leftBrick: 4,
            topBrick: 5,
            concrete: 6,
            water: 7,
            tree: 8,
            swamp: 9,
            flagAliveTopLeft: 10,
            flagAliveTopRight: 11,
            flagAliveBottomLeft: 12,
            flagAliveBottomRight: 13,
            flagDeadTopLeft: 14,
            flagDeadTopRight: 15,
            flagDeadBottomLeft: 16,
            flagDeadBottomRight: 17
        },
        powerUps: {
            helmet: {
                id: 0,
                applyable: true
            },
            clock: {
                id: 1,
                applyable: true
            },
            shovel: {
                id: 2,
                applyable: true
            },
            star: {
                id: 3,
                applyable: true
            },
            grenade: {
                id: 4,
                applyable: true
            },
            tank: {
                id: 5,
                applyable: true
            },
            gun: {
                id: 6,
                applyable: true
            },
            protectiveField: {
                id: 7,
                applyable: false
            }
        }
    },
    players: [
        {
            instance: null,
            holderSize: 2,
            cooldownTime: 100,
            scale: 1,
            speed: 4.0,
            initX: 300,
            initY: 800
        },
        {
            instance: null,
            holderSize: 1,
            cooldownTime: 100,
            scale: 1,
            speed: 4.0,
            initX: 532,
            initY: 800
        }
    ],
    config: {
        assets: {
            Atlas: 'app/asset/textures/atlas4x.png',
            maps: [
                'app/asset/maps/level01.json',
                'app/asset/maps/level01.json'
            ]
        },
        tailSize: {
            width: 32,
            height: 32
        }
    }
};