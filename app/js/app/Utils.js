var Utils = {
    inArray: function(el, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == el) {
                return true;
            }
        }
        return false;
    }
};