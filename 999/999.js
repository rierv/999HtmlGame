var myGamePiece;
var myEnemies = [];
var playerBullets = [];
var powerUps = [];
var damages = [];
var deaths = 1;
var ammo = 0;
var explosion = false;
var explosionComponent = null;
var playerImages = ["img/playergun.png", "img/playermachinegun/playermachinegun1.png", "img/playershotgun.png", "img/playerbazooka.png"];
var powerImages = ["img/powerUps/life.png", "img/powerUps/machinegun.png", "img/powerUps/shotgun.png", "img/powerUps/bazooka.png"];
var explosionImages = ["img/explosion/1.gif","img/explosion/2.gif","img/explosion/3.gif","img/explosion/4.gif","img/explosion/5.gif","img/explosion/6.gif","img/explosion/7.gif","img/explosion/8.gif","img/explosion/9.gif","img/explosion/10.gif",
    "img/explosion/11.gif","img/explosion/12.gif","img/explosion/13.gif","img/explosion/14.gif","img/explosion/15.gif"];
var playerImagesMovement = ["img/playermachinegun/playermachinegun1.png", "img/playermachinegun/playermachinegun2.png", "img/playermachinegun/playermachinegun3.png", "img/playermachinegun/playermachinegun4.png"];
function startGame() {
    myGameArea.start();
    myGamePiece = new component(63, 84, "img/playermachinegun/playermachinegun3.png", myGameArea.canvas.width/2, myGameArea.canvas.height/2, 0, 1000, 1);
}

var myGameArea = {
    start : function() {
        this.canvas = document.getElementById("myCanvas");
        this.canvas.width = 800;
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.canvas.height = 800;
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

function component(width, height, image, x, y, angle, life, weapon) {
    this.weapon =weapon;
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
        fillBullets(this.weapon);
    }
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
}

function updateGameArea() {
    if(everyinterval(10))    damages= [];

    document.getElementById("debug").innerHTML= myGamePiece.life.toString();
    if(ammo==0) {
        myGamePiece.weapon=1;
        myGamePiece.image.src = playerImages[0];
    }
    myGameArea.clear();
    if(explosionComponent!=null) {
        explosionComponent.speed=0;
        explosionComponent.newPos();
        explosionComponent.update();
        explosionComponent= updateImage(explosionComponent, explosionImages);
    }
    myGameArea.frameNo = (myGameArea.frameNo%1000)+1;
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.moveAngle = -7; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.moveAngle = 7; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speed= 7; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speed= -5; }
    myGamePiece.newPos();
    var trueangle=myGamePiece.angle;
    if(myGameArea.keys && myGameArea.keys[32]) {
        myGamePiece.shoot();
    }
    //if(myGamePiece.speed!=0)  updateImage(myGamePiece, playerImagesMovement);
    myGamePiece.update();
    myGamePiece.angle=trueangle;
    playerBullets.forEach(function (bullet) {
        bullet.speed = 15;
        bullet.newPos();
        bullet.update();
        myEnemies.forEach(function(enemy) {
            if (collides(bullet, enemy)) {
                if(explosion==true) {
                    explosionComponent = new component(200, 240, "img/explosion/1.gif", bullet.x + 100*Math.sin(bullet.angle),
                        bullet.y - 100*Math.cos(bullet.angle), bullet.angle, 0, 0);
                    explosion=false;
                }
                enemy.life -= 1;
                bullet.life -=1;
                damages.push(new component(30, 30, "img/damage.png", enemy.x-15*Math.sin(enemy.angle),
                    enemy.y+15*Math.cos(enemy.angle), 0, 0));
                if (enemy.life <= 0) {
                    enemy.active = false;
                    deaths +=1;
                }
                if (bullet.life <= 0) bullet.active = false;
            }
        })
    })
    myEnemies = myEnemies.filter(function(enemy) {
        return enemy.active;
    });
    playerBullets = playerBullets.filter(function(bullet) {
        return bullet.active;
    });

    powerUps.forEach(function (power) {
        power.speed = 0;
        power.newPos();
        power.update();
        if (collides(power, myGamePiece)) {
            power.life -= 1;
            power.active = false;
            if (power.weapon != 1) {
                myGamePiece.weapon =power.weapon;
                ammo = 60;
                myGamePiece.image.src=playerImages[power.weapon-1];
            }
            else myGamePiece.life += 500;
        }
    })

    powerUps = powerUps.filter(function(power) {
        return power.active;
    });

    damages.forEach(function (damage) {
        damage.speed = 0;
        damage.newPos();
        damage.update();
    })


    if(deaths%4==0){
        deaths +=1;
        var i= myGameArea.frameNo%4;
        powerUps.push(new component (30, 30, powerImages[i], Math.random()*myGameArea.canvas.width,
            Math.random()*myGameArea.canvas.height, 0, 1, i+1));
    }
    if(everyinterval(50)&&myEnemies.length<(deaths/5)%17){
        myEnemies.push(new component(56, 88, "img/enemy.png", Math.random()*myGameArea.canvas.width,
            Math.random()*myGameArea.canvas.height, myEnemies.length, 2+(myEnemies.length)%3));
        //myEnemies.push(new component(56, 88, "img/enemy.png", myGameArea.canvas.width -600, (myGameArea.frameNo*55)%myGameArea.canvas.height, -myEnemies.length));
    }
    myEnemies.forEach(function (elem) {
        if(explosionComponent){
            explosionComponent.width+=50;
            explosionComponent.height+=50;
            if(collides(elem, explosionComponent)){
                elem.life=0;
                elem.active=false;
            }
            explosionComponent.width-=50;
            explosionComponent.height-=50;
        }
        elem.speed = -2;
        elem.moveAngle = 0;
        elem.y-=40*Math.cos(elem.angle);
        if(collides(elem, myGamePiece)) {
            elem.speed=0;
            myGamePiece.life-=1;
            damages.push(new component(30, 30, "img/damage.png", myGamePiece.x-15*Math.sin(myGamePiece.angle),
                myGamePiece.y+15*Math.cos(myGamePiece.angle), 0, 0));
        }
        elem.y+=40*Math.cos(elem.angle);
        var distance_enemy_player= Math.sqrt(Math.pow(elem.x-myGamePiece.x, 2)+Math.pow(elem.y-myGamePiece.y, 2));
        var desired_cos= (myGamePiece.y-elem.y)/distance_enemy_player;
        var desired_sin= (myGamePiece.x-elem.x)/distance_enemy_player;
        var mycos= Math.cos(elem.angle);
        var mysin= Math.sin(elem.angle);

        if(desired_cos>mycos && desired_sin>mysin)  elem.moveAngle +=4;
        else if (desired_cos>mycos && desired_sin<mysin) elem.moveAngle -=4;
        else if(desired_cos<mycos && desired_sin<mysin) elem.moveAngle +=4;
        else if(desired_cos<mycos && desired_sin>mysin) elem.moveAngle -=4;
        else if((desired_cos==mycos && desired_sin!=mysin)||(desired_cos!=mycos && desired_sin==mysin)) elem.moveAngle +=1;
        elem.newPos();
        elem.update();

    })

}

function collides(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function updateImage(piece, images){
    if((piece.frame)==images.length-1) piece = null;
    else {
        piece.frame = (piece.frame + 1);
        piece.image.src = images[piece.frame];
    }
    return piece;
}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function fillBullets(weapon){
    if(weapon == 1  && myGameArea.frameNo%10==0) {
        myGamePiece.angle+=myGameArea.frameNo%2/20;

        playerBullets.push(new component(15, 15, "img/bullet-gold1.png", myGamePiece.x+10*Math.cos(myGamePiece.angle)+1*Math.sin(myGamePiece.angle), myGamePiece.y-1*Math.cos(myGamePiece.angle)+10*Math.sin(myGamePiece.angle), myGamePiece.angle, 1));
    }
    else if(weapon == 2  && myGameArea.frameNo%5==0) {
        ammo-=1;

        myGamePiece.angle+=myGameArea.frameNo%2/10;

        playerBullets.push(new component(20, 20, "img/bullet-gold2.png", myGamePiece.x+13*Math.cos(myGamePiece.angle)+40*Math.sin(myGamePiece.angle), myGamePiece.y-40*Math.cos(myGamePiece.angle)+13*Math.sin(myGamePiece.angle), myGamePiece.angle, 1));
    }
    else if(weapon ==3 && everyinterval(25)) {
        ammo-=3;

        myGamePiece.angle+=myGameArea.frameNo%2/10;

        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", myGamePiece.x+13*Math.cos(myGamePiece.angle)+20*Math.sin(myGamePiece.angle), myGamePiece.y-20*Math.cos(myGamePiece.angle)+13*Math.sin(myGamePiece.angle), myGamePiece.angle+0.15, 1));
        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", myGamePiece.x+13*Math.cos(myGamePiece.angle)+20*Math.sin(myGamePiece.angle), myGamePiece.y-20*Math.cos(myGamePiece.angle)+13*Math.sin(myGamePiece.angle), myGamePiece.angle+0.3, 1));
        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", myGamePiece.x+13*Math.cos(myGamePiece.angle)+20*Math.sin(myGamePiece.angle), myGamePiece.y-20*Math.cos(myGamePiece.angle)+13*Math.sin(myGamePiece.angle), myGamePiece.angle, 1));
        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", myGamePiece.x+13*Math.cos(myGamePiece.angle)+20*Math.sin(myGamePiece.angle), myGamePiece.y-20*Math.cos(myGamePiece.angle)+13*Math.sin(myGamePiece.angle), myGamePiece.angle-0.15, 1));
        playerBullets.push(new component(20, 20, "img/bullet-gold3.png", myGamePiece.x+13*Math.cos(myGamePiece.angle)+20*Math.sin(myGamePiece.angle), myGamePiece.y-20*Math.cos(myGamePiece.angle)+13*Math.sin(myGamePiece.angle), myGamePiece.angle-0.3, 1));
    }
    else if(weapon==4 && everyinterval(35)){
        ammo-=10;
        playerBullets.push(new component(20, 20, "img/rocket.png", myGamePiece.x+13*Math.cos(myGamePiece.angle)+20*Math.sin(myGamePiece.angle), myGamePiece.y-20*Math.cos(myGamePiece.angle)+13*Math.sin(myGamePiece.angle), myGamePiece.angle, 5));
        explosion = true;
    }
}
