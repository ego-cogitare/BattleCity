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
            appearing: 'appearing',
            explosion: 'explosion',
            freezed: 'freezed'
        },
        tankModels: [
            {
                name: 'player1',
                isHuman: true,
                holderSize: 3,
                cooldownTime: 100,
                scale: 1,
                speed: 4.0,
                shellSpeed: 14.0,
                canNotDestroy: [
                    
                ],
                initX: 300,
                initY: 800
            },
            {
                name: 'player2',
                isHuman: true,
                holderSize: 1,
                cooldownTime: 100,
                scale: 1,
                speed: 3.0,
                shellSpeed: 7.0,
                canNotDestroy: [
                    6
                ],
                initX: 532,
                initY: 800
            },
            {
                name: 'T1',
                isHuman: false,
                holderSize: 1,
                cooldownTime: 100,
                scale: 1,
                speed: 2.0,
                shellSpeed: 7.0,
                canNotDestroy: [
                    1,2,3,4,5,6
                ],
                initX: 200,
                initY: 30
            },
            {
                name: 'T2',
                isHuman: false,
                holderSize: 1,
                cooldownTime: 100,
                scale: 1,
                speed: 2.5,
                shellSpeed: 15.0,
                canNotDestroy: [
                    1,2,3,4,5,6
                ],
                initX: 300,
                initY: 30
            },
            {
                name: 'T3',
                isHuman: false,
                holderSize: 2,
                cooldownTime: 100,
                scale: 1,
                speed: 3.0,
                shellSpeed: 15.0,
                canNotDestroy: [
                    1,2,3,4,5,6
                ],
                initX: 400,
                initY: 30
            },
            {
                name: 'T4',
                isHuman: false,
                holderSize: 3,
                cooldownTime: 100,
                scale: 1,
                speed: 4.0,
                shellSpeed: 15.0,
                canNotDestroy: [
                    1,2,3,4,5,6
                ],
                initX: 500,
                initY: 30
            },
            {
                name: 'T5',
                isHuman: false,
                holderSize: 1,
                cooldownTime: 100,
                scale: 1,
                speed: 2.5,
                shellSpeed: 12.0,
                canNotDestroy: [
                    1,2,3,4,5,6
                ],
                initX: 600,
                initY: 30
            },
            {
                name: 'T6',
                isHuman: false,
                holderSize: 1,
                cooldownTime: 100,
                scale: 1,
                speed: 6.0,
                shellSpeed: 11.0,
                canNotDestroy: [
                    1,2,3,4,5,6
                ],
                initX: 700,
                initY: 30
            },
            {
                name: 'T7',
                isHuman: false,
                holderSize: 2,
                cooldownTime: 100,
                scale: 1,
                speed: 2.0,
                shellSpeed: 15.0,
                canNotDestroy: [
                    1,2,3,4,5,6
                ],
                initX: 800,
                initY: 30
            },
            {
                name: 'T8',
                isHuman: false,
                holderSize: 2,
                cooldownTime: 100,
                scale: 1,
                speed: 1.5,
                shellSpeed: 20.0,
                canNotDestroy: [
                    1,2,3,4,5,6
                ],
                initX: 35,
                initY: 30
            }
        ],
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
                time: 15000,
                applyable: true
            },
            clock: {
                id: 1,
                time: 10000,
                applyable: true
            },
            shovel: {
                id: 2,
                time: 10000,
                applyable: true
            },
            star: {
                id: 3,
                time: -1,
                applyable: true
            },
            grenade: {
                id: 4,
                time: -1,
                applyable: true
            },
            tank: {
                id: 5,
                time: -1,
                applyable: true
            },
            gun: {
                id: 6,
                time: -1,
                applyable: true
            },
            protectiveField: {
                id: 7,
                time: 15000,
                applyable: false
            }
        }
    },
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