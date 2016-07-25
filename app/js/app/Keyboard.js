var Keyboard = function() {
    
    var keyboard = {
        keys: {
        },
        onKeyDown: function(keyCode) {
        },
        onKeyUp: function(keyCode) {
        }
    };
    
    window.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 37: // Left
                keyboard.keys.left = true;
            break;

            case 38: // Up
                keyboard.keys.up = true;
            break;

            case 39: // Right
                keyboard.keys.right = true;
            break;

            case 40: // Down
                keyboard.keys.down = true;
            break;
            
            case 90: // Shot
                keyboard.keys.z = true;
            break;

            case 100: // Left
                keyboard.keys.num4 = true;
            break;

            case 104: // Up
                keyboard.keys.num8 = true;
            break;

            case 102: // Right
                keyboard.keys.num6 = true;
            break;

            case 101: // Down
                keyboard.keys.num5 = true;
            break;
            
            case 105: // Shot
                keyboard.keys.num9 = true;
            break;
        }
        
        keyboard.onKeyDown.call(this, event.keyCode);
        
    }, false);
    
    window.addEventListener('keyup', function(event) {
        switch (event.keyCode) {
            case 37: // Left
                keyboard.keys.left = false;
            break;

            case 38: // Up
                keyboard.keys.up = false;
            break;

            case 39: // Right
                keyboard.keys.right = false;
            break;

            case 40: // Down
                keyboard.keys.down = false;
            break;
            
            case 90: // Shot
                keyboard.keys.z = false;
            break;

            case 100: // Left
                keyboard.keys.num4 = false;
            break;

            case 104: // Up
                keyboard.keys.num8 = false;
            break;

            case 102: // Right
                keyboard.keys.num6 = false;
            break;

            case 101: // Down
                keyboard.keys.num5 = false;
            break;

            case 105: // Shot
                keyboard.keys.num9 = false;
            break;
        }
        
        keyboard.onKeyUp.call(this, event.keyCode);
        
    }, false);

    return keyboard;
};