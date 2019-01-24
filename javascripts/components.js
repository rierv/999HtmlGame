var player;
var myEnemies = [];
var playerBullets = [];
var powerUps = [];
var damages = [];
var deaths = 1;
var ammo = 0;
var explosionComponent = null;
var enemy3Bullet = [];
var playerImages = ["img/playergun.png", "img/playermachinegun/playermachinegun1.png", "img/playershotgun.png", "img/playerbazooka.png"];
var powerImages = ["img/powerUps/life.png", "img/powerUps/machinegun.png", "img/powerUps/shotgun.png", "img/powerUps/bazooka.png"];
var explosionImages = ["img/explosion/1.gif","img/explosion/2.gif","img/explosion/3.gif","img/explosion/4.gif","img/explosion/5.gif","img/explosion/6.gif","img/explosion/7.gif","img/explosion/8.gif","img/explosion/9.gif","img/explosion/10.gif",
    "img/explosion/11.gif","img/explosion/12.gif","img/explosion/13.gif","img/explosion/14.gif","img/explosion/15.gif"];
var playerImagesMovement = ["img/playermachinegun/playermachinegun1.png", "img/playermachinegun/playermachinegun2.png", "img/playermachinegun/playermachinegun3.png", "img/playermachinegun/playermachinegun4.png"];
function startGame() {
    document.getElementById("lifeBar").style.display = "block";
    document.getElementById("ammo").style.display = "block";
    document.getElementById("start").style.display = "none";
    document.getElementById("died").style.display = "none";
    myGameArea.start();
    myGameArea.canvas.style.display = "block";

    player = new component(63, 84, "img/playergun.png", myGameArea.canvas.width/2, myGameArea.canvas.height/2, 0, 1000, 1);

}

var myGameArea = {
    start : function() {

        this.canvas = document.getElementById("myCanvas");
        this.canvas.width = 2000;
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.canvas.height = 1000;
        this.context = this.canvas.getContext("2d");
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


function component(width, height, image, x, y, angle, life, type) {
    this.type =type;
    this.life = life;
    this.active=true;
    this.image = new Image();
    this.image.src = image;
    this.frame = 0;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = angle;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        if(this.active) {
            ctx = myGameArea.context;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        }
    }
    this.shoot = function(){
        fillBullets(this.type);
    }
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
}

function fillBullets(weapon){
    if(weapon == 1  && myGameArea.frameNo%15==0) {
        player.angle+=myGameArea.frameNo%2/20;

        playerBullets.push(new component(30, 30, "img/bullet-gold1.png", player.x+10*Math.cos(player.angle)+1*Math.sin(player.angle), player.y-1*Math.cos(player.angle)+10*Math.sin(player.angle), player.angle, 1, 0));
    }
    else if(weapon == 2  && myGameArea.frameNo%5==0) {
        ammo-=1;

        player.angle+=myGameArea.frameNo%1/10;

        playerBullets.push(new component(20, 20, "img/bullet-gold2.png", player.x+13*Math.cos(player.angle)+40*Math.sin(player.angle), player.y-40*Math.cos(player.angle)+13*Math.sin(player.angle), player.angle, 1, 0));
    }
    else if(weapon ==3 && everyinterval(25)) {
        ammo-=3;

        player.angle+=myGameArea.frameNo%1/10;

        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", player.x+13*Math.cos(player.angle)+20*Math.sin(player.angle), player.y-20*Math.cos(player.angle)+13*Math.sin(player.angle), player.angle+0.15, 1, 0));
        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", player.x+13*Math.cos(player.angle)+20*Math.sin(player.angle), player.y-20*Math.cos(player.angle)+13*Math.sin(player.angle), player.angle+0.3, 1, 0));
        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", player.x+13*Math.cos(player.angle)+20*Math.sin(player.angle), player.y-20*Math.cos(player.angle)+13*Math.sin(player.angle), player.angle, 1, 0));
        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", player.x+13*Math.cos(player.angle)+20*Math.sin(player.angle), player.y-20*Math.cos(player.angle)+13*Math.sin(player.angle), player.angle-0.15, 1, 0));
        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", player.x+13*Math.cos(player.angle)+20*Math.sin(player.angle), player.y-20*Math.cos(player.angle)+13*Math.sin(player.angle), player.angle-0.3, 1, 0));
    }
    else if(weapon==4 && everyinterval(35)){
        ammo-=10;
        playerBullets.push(new component(20, 20, "img/rocket.png", player.x+13*Math.cos(player.angle)+20*Math.sin(player.angle), player.y-20*Math.cos(player.angle)+13*Math.sin(player.angle), player.angle, 5, 1));
    }
}