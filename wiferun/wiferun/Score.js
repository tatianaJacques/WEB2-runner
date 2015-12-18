function Score(){
   score = 0 ;
}

Score.prototype.ajouterScore = function(perdu){
     var divScore = document.getElementById("score");


     timer =  setInterval(function () {
        score = score+1;
        divScore.innerHTML = score ;
        if(score==15){
            Q.stageScene("level2");
        }
    }, 1000);
};

Score.prototype.getScore = function(){
        return score;
    };

Score.prototype.arreterScore = function(){
  clearInterval(timer);
};

Score.prototype.resetScore = function(){
  score = 0;
  clearInterval(timer);
};
