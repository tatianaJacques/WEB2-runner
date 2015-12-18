function Audio(src){
    this.src = src;
}

Audio.prototype.jouerSon = function(sonAJouer){

    if(sonAJouer=="musiqueFond"){
        var player = document.getElementById("sonGeneral");
    }
    if(sonAJouer=="sonCol"){
        var player = document.getElementById("sonCollision");
    }
    if(sonAJouer=="sonSaut"){
          var player = document.getElementById("sonSaut");
    }


    player.setAttribute('src',this.src);


    player.play();
}

Audio.prototype.arreterSon = function(sonAArreter){
    if(sonAArreter=="musiqueFond"){
        var player = document.getElementById("sonGeneral");
    }
    if(sonAArreter=="sonCol"){
        var player = document.getElementById("sonCollision");
    }
    if(sonAArreter=="sonSaut"){
          var player = document.getElementById("sonSaut");
    }

    player.pause();
    player.currentTime = 0;

}
