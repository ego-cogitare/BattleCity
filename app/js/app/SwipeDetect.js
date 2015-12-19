var SwipeDetect = function() {
    
        var touchsurface = document.getElementsByTagName('body')[0],
            swipedir,
            startX,
            startY,
            distX,
            distY,
            threshold = 100,
            allowedTime = 200,
            elapsedTime,
            startTime = -1,
            eventsQueue = [];

        touchsurface.addEventListener('touchstart', function(e){
            var touchobj = e.changedTouches[0];
            swipedir = 'none';
            dist = 0;
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = Date.now(); // record time when finger first makes contact with surface
            e.preventDefault();
        }, false);

        touchsurface.addEventListener('touchmove', function(e){
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = Date.now() - startTime; // get time elapsed
            if ((Math.abs(distX) >= threshold || Math.abs(distY) >= threshold)){
                if (Math.abs(distX) >= Math.abs(distY)){
                    swipedir = (distX < 0) ? 'left' : 'right';
                }
                else {
                    swipedir = (distY < 0) ? 'top' : 'bottom';
                }
            }
            e.preventDefault();
        }, false);

        touchsurface.addEventListener('touchend', function(e){
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = Date.now() - startTime; // get time elapsed
            if (elapsedTime <= allowedTime && (Math.abs(distX) >= threshold || Math.abs(distY) >= threshold)){
                if (Math.abs(distX) >= Math.abs(distY)){
                    swipedir = (distX < 0) ? 'left' : 'right';
                }
                else {
                    swipedir = (distY < 0) ? 'top' : 'bottom';
                }
            }
            if (swipedir === 'none') {
                eventsQueue.push({ type: 'touch' });
            }
            else {
                eventsQueue.push({ type: 'quckSwipe', direction: swipedir });
            }
            e.preventDefault();
            startTime = -1;
        }, false);
        
        return {
            handleInput: function() {
                if (startTime !== -1 && swipedir !== 'none' && Date.now() - startTime > allowedTime) {
                    eventsQueue.push({ type: 'longSwipe', direction: swipedir });
                }
                return eventsQueue;
            },
            pop: function() {
                return eventsQueue.pop();
            },
            queue: function() {
                return eventsQueue.length > 0;
            }
        };
};


