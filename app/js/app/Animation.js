var Animation = function(frames, duration) {
    
    var curTime = 0;
    var duration = duration;
    var fullAnimationTime = duration * frames.length;
    var curFrameIndex = 0;
    
    return {
        getFrame: function(timeDelta) {
            curTime += timeDelta;
            var mod = curTime % fullAnimationTime;
            curFrameIndex = Math.floor(mod / duration);
            
            return frames[curFrameIndex];
        },
        getCurFrameIndex: function() {
            return curFrameIndex;
        },
        getFullAnimationTime: function() {
            return fullAnimationTime;
        },
        reset: function() {
            curTime = 0;
        },
        setDuration: function(d) {
            duration = d;
            fullAnimationTime = duration * frames.length;
        }
    };
    
};