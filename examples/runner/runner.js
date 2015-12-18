window.addEventListener("load",function() {



setTimeout(function(){ $('#popin').css('opacity','1'); $('#popin').css('transform','translateY(100px)'); $('.overlay').addClass('show');}, 2000);

//gestion du score

var timerScore = new Score();
var score = new Array();
score.push(0);

// cacher le score au début et la vie

$('#textScore').css('display','none');
$('#life').css('display','none');

// gestion des vies

var divVie = document.getElementById("life");
var vie = new Vie();

divVie.innerHTML = '<img src="images/heart13.svg"><img src="images/heart13.svg"><img src="images/heart13.svg">';


//fin de la gestion du score


var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        .setup({ maximize: true })
        .controls().touch()

var SPRITE_BOX = 1;

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
      jump: -800,
      isJumpPressed: false,
      hasJumped: false,
      hasJumpedTwice: false
    });

    this.p.points = this.p.standingPoints;

    this.add("2d, animation");
  },

  step: function(dt) {
    this.p.vx += (this.p.speed - this.p.vx)/4;

    if(this.p.y > 555) {
      this.p.y = 555;
      this.p.landed = 1;
      this.p.hasJumped = false;
      this.p.hasJumpedTwice = false;
      this.p.vy = 0;
    }else {
      this.p.landed = 0;
    }

    if(Q.inputs['up'] && !this.p.hasJumpedTwice && !this.p.isJumpPressed){
         this.p.vy = this.p.jump;
       }

        //if the player release up key...
        if(Q.inputs['up'] === false){
            this.p.hasJumped = true;
            this.p.isJumpPressed = false;
        }

        if(Q.inputs['up']){
            this.p.isJumpPressed = true;
            if(this.p.hasJumped){
                this.p.hasJumpedTwice = true;
            }
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
      frame: Math.floor(Math.random()* 10),
      scale: 2,
      type: SPRITE_BOX,
      sheet: "crates",
      vx: -400 + 200 * Math.random(),
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

    if(vie.getVie() == 15 ){
          divVie.innerHTML = '<img src="images/heart13.svg"><img src="images/heart13.svg">';
    }
    if(vie.getVie() == 8 ){
          divVie.innerHTML = '<img src="images/heart13.svg">';
    }
      //la personne n'a plus de vie, lance la scene de fin
    if(vie.getVie() == 0 ){
        divVie.innerHTML = '<img src="images/heart13.svg"><img src="images/heart13.svg"><img src="images/heart13.svg">';
        timerScore.arreterScore(); //arrete le timer

        Q.stageScene("endGame");
    }
  }


});

Q.GameObject.extend("BoxThrower",{
  init: function() {
    this.p = {
      launchDelay: 0.95,
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

  timerScore.ajouterScore();
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

  stage.insert(new Q.Repeater({ asset: "decor.png",
                                speedX: 0.5 }));

  stage.insert(new Q.Repeater({ asset: "background-floor.png",
                                repeatY: false,
                                speedX: 1.0,
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

stage.insert(new Q.Repeater({ asset: "findujeu.png",
                            speedX: 0.5 }));

//reset du score
timerScore.resetScore();
timerScore.arreterScore();


//reset de la vie
vie.resetVie();

//on cache les informations
$('#textScore').css('display','none');
$('#life').css('display','none');

//affiche le meilleur score
$('body').append('<h2 class="endScore">Il faudra faire mieux que '+score[0]+' <br/> pour avoir une bière !</h2>')
$('body').append('<p class="endbtn">Je retente ma chance</p>')

//bouton rejouer

$(".endbtn").on('click',function(){
  
  //on focus le canvas pour pouvoir joeur directement sans avoir à cliquer
  document.getElementById('quintus').focus();

  Q.stageScene("level1");
  $('.endScore').remove();
  $('.endbtn').remove();
  $('#textScore').css('display','block');
  $('#life').css('display','block');
});

});

Q.scene("start",function(stage) {
   stage.insert(new Q.Repeater({ asset: "firstPage.jpg",
                            speedX: 0.5 }));


$('#btnPlay').click(function(){
  //lancement de la scene une
   Q.stageScene("level1");

   //on cache la popin
   $('#popin').hide();

   //on focus le canvas pour pouvoir joeur directement sans avoir à cliquer
   document.getElementById('quintus').focus();

   //on enlève et affiche les informations nécessaire au jeu
   $('body').css('background-image','none');
   $('.overlay').removeClass('show');
   $('#textScore').css('display','block');
   $('#life').css('display','block');

});

});


Q.load("player.json, player.png, background-wall.png, findujeu.png, background-floor.png, decor.png,crates.png, crates.json", function() {
    Q.compileSheets("player.png","player.json");
    Q.compileSheets("crates.png","crates.json");
    Q.animations("player", {
      walk_right: { frames: [0,1,2,3,4,5,6,7,8,9,10], rate: 1/15, flip: false, loop: true },
      jump_right: { frames: [13], rate: 1/10, flip: false },
      stand_right: { frames:[14], rate: 1/10, flip: false },
      duck_right: { frames: [15], rate: 1/10, flip: false },
    });
    Q.stageScene("start");
});


});
