var Utils = {
    rectIntersect: function(A1, B1, A2, B2) {
        return !(B1.x <= A2.x || B2.x <= A1.x || B1.y <= A2.y || B2.y <= A1.y);
    }
};