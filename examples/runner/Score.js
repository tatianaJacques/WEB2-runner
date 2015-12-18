function Score(){
   score = 0 ;
}

Score.prototype.ajouterScore = function(perdu){
     var divScore = document.getElementById("score");


     timer =  setInterval(function () {
        score = score+1;
        divScore.innerHTML = score ;
        if(score==10){
            Q.stageScene("level2");
        }
        // if(score==70){
        //     Q.stageScene("level3");
        // }
    }, 1000);
};

Score.prototype.piece = function(){
    score += 10;
}

Score.prototype.getScore = function(){
        return score;
    };

Score.prototype.resetScore = function(){
        score = 0;
    }

Score.prototype.arreterScore = function(){
    clearInterval(timer);
}
