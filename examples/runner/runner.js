window.addEventListener("load",function() {


//gestion du score

var timerScore = new Score();

var score = new Array();
score.push(0);

timerScore.ajouterScore();
// gestion des vies


var divVie = document.getElementById("life");
var vie = new Vie();


divVie.innerHTML = '<img src="images/heart13.svg"><img src="images/heart13.svg"><img src="images/heart13.svg">' + vie.getVie() ;


//fin de la gestion du score


var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        .setup({ maximize: true })
        .controls().touch()

var SPRITE_BOX = 1;

var jumpNumber = 0;

Q.gravityY = 2000;

Q.Sprite.extend("Player",{

  init: function(p) {

    this._super(p,{
      sheet: "player",
      sprite: "player",
      collisionMask: SPRITE_BOX,
      x: 40,
      y: 555,
      standingPoints: [ [ -16, 44], [ -23, 35 ], [-23,-48], [23,-48], [23, 35 ], [ 16, 44 ]],
      duckingPoints : [ [ -16, 44], [ -23, 35 ], [-23,-10], [23,-10], [23, 35 ], [ 16, 44 ]],
      speed: 500,
      jump: -900
    });

    this.p.points = this.p.standingPoints;

    this.add("2d, animation");
  },

  step: function(dt) {
    this.p.vx += (this.p.speed - this.p.vx)/4;

    if(this.p.y > 555) {
      this.p.y = 555;
      this.p.landed = 1;
      this.p.vy = 0;
    }else {
      this.p.landed = 0;
    }

    if(Q.inputs['up'] && this.p.landed > 0) {
      this.p.vy = this.p.jump;
      jumpNumber += 1;
    }

    this.p.points = this.p.standingPoints;
    if(this.p.landed) {
        this.play("walk_right");
    } else {
      this.play("jump_right");
    }

    this.stage.viewport.centerOn(this.p.x + 300, 400 );

  }
});

Q.Sprite.extend("Box",{
  init: function() {

    var levels = [ 565, 540, 500, 450 ];

    var player = Q("Player").first();
    this._super({
      x: player.p.x + Q.width + 50,
      y: levels[Math.floor(Math.random() * 3)],
      frame: Math.random() < 0.5 ? 1 : 0,
      scale: 2,
      type: SPRITE_BOX,
      sheet: "crates",
      vx: -600 + 200 * Math.random(),
      vy: 0,
      ay: 0,
      theta: (300 * Math.random() + 200) * (Math.random() < 0.5 ? 1 : -1)
    });


    this.on("hit");
  },

  step: function(dt) {
    this.p.x += this.p.vx * dt;


    this.p.vy += this.p.ay * dt;
    this.p.y += this.p.vy * dt;
    if(this.p.y != 565) {
      this.p.angle += this.p.theta * dt;
    }

    if(this.p.y > 800) { this.destroy(); }

  },

  hit: function() {
    this.p.type = 0;
    this.p.collisionMask = Q.SPRITE_NONE;
    this.p.vx = 200;
    this.p.ay = 400;
    this.p.vy = -300;
    this.p.opacity = 0.5;
    //lorsque la personne touche un objet elle perd une vie, les collisions pouvant varier de 1 à 20 lorsque l'on touche un objet
    //on ne perd pas automatiquement un coeur lorsque l'on touche un objet.
    vie.perdUneVie();

    if(vie.getVie() == 20 ){
          divVie.innerHTML = '<img src="images/heart13.svg"><img src="images/heart13.svg">' + vie.getVie();
    }
    if(vie.getVie() == 10 ){
          divVie.innerHTML = '<img src="images/heart13.svg">'  + vie.getVie() ;
    }
      //la personne n'a plus de vie, lance la scene de fin
    if(vie.getVie() == 0 ){
        divVie.innerHTML = '<img src="images/heart13.svg"><img src="images/heart13.svg"><img src="images/heart13.svg">' + vie.getVie();
        timerScore.arreterScore(); //arrete le timer

        Q.stageScene("endGame");
    }
  }


});

Q.GameObject.extend("BoxThrower",{
  init: function() {
    this.p = {
      launchDelay: 0.75,
      launchRandom: 1,
      launch: 2
    }
  },

  update: function(dt) {
    this.p.launch -= dt;

    if(this.p.launch < 0) {
      this.stage.insert(new Q.Box());
      this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    }
  }

});




Q.scene("level1",function(stage) {

  stage.insert(new Q.Repeater({ asset: "background-wall.png",
                                speedX: 0.5 }));

  stage.insert(new Q.Repeater({ asset: "background-floor.png",
                                repeatY: false,
                                speedX: 1.0,
                                y: 300 }));

  stage.insert(new Q.BoxThrower());

  stage.insert(new Q.Player());
  stage.add("viewport");

});


Q.scene("level2",function(stage) {

  stage.insert(new Q.Repeater({ asset: "background-wall.png",
                                speedX: 0.5 }));

  stage.insert(new Q.Repeater({ asset: "background-floor.png",
                                repeatY: false,
                                speedX: 1.5,
                                y: 300 }));

  stage.insert(new Q.BoxThrower());

  stage.insert(new Q.Player());
  stage.add("viewport");

});
//gestion fin du jeu
Q.scene("endGame",function(stage) {
//ajoute le score dans un array
score.push(timerScore.getScore());
score.sort(function(a, b){return b-a});

stage.insert(new Q.Repeater({ asset: "gameover.jpg",
                            speedX: 0.5 }));


  timerScore.resetScore();

vie.resetVie();
//bouton rejouer
stage.insert(new Q.UI.Button({
  label: "Rejouer",
  y: 120,
  x: Q.width/2
}, function() {
  Q.stageScene("level1");
  timerScore.ajouterScore();
}));
    //sauvegarde du score dans la BDD
//    stage.insert(new Q.UI.Button({
//   label: "Sauvegarder le score",
//   y: 200,
//   x: Q.width/2
// }, function() {
//
//    window.alert("Score enregistré ! ");
//
// }));


//affiche le meilleur score
stage.insert(new Q.UI.Text({
  label: "Votre meilleur score : "+score[0],
  color: "black",
  align: 'center',
  x: Q.width/2,
  y: 300
}));

});


Q.load("player.json, player.png, background-wall.png, background-floor.png, crates.png, crates.json", function() {
    Q.compileSheets("player.png","player.json");
    Q.compileSheets("crates.png","crates.json");
    Q.animations("player", {
      walk_right: { frames: [0,1,2,3,4,5,6,7,8,9,10], rate: 1/15, flip: false, loop: true },
      jump_right: { frames: [13], rate: 1/10, flip: false },
      stand_right: { frames:[14], rate: 1/10, flip: false },
      duck_right: { frames: [15], rate: 1/10, flip: false },
    });
    Q.stageScene("level1");

});


});
