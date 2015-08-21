var AI = function() {
    return {
        AIPlay: function() {
//            this.setDirrection(['top','right','bottom','left'][Math.round(Math.random() * 3)]);
            this.shot();
            this.setDirrection('bottom');
            this.moveDown();
            
//            console.log(this.speedY);
        },
    };
}