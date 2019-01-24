

function updateGameArea() {

    if(player.life<0) {
        myGameArea.clear();
        myGameArea.stop();
        document.getElementById("lifeBar").style.display = "none";
        document.getElementById("ammo").style.display = "none";
        myGameArea.canvas.style.display = "none";
        document.getElementById("start").style.display = "block";
        document.getElementById("died").style.display = "block";
        myEnemies=[];
        playerBullets=[];
        enemy3Bullet=[];
        powerUps=[];
        player=null;
    }
    myGameArea.frameNo = (myGameArea.frameNo%1000)+1;
    document.getElementById("lifeBar").style.width = player.life/20 +'%';
    document.getElementById("ammo").style.width = ammo/2 +'%';
    myGameArea.clear();

    updatePlayer();

    updateEnemies();

    updateBullets();

    updatePowerUps ();

    updateDamages ();

    fillLevel1();
}
var direction = {x: 0, y: 0};
var start =false;
function updatePlayer(){
    if(ammo==0) {
        player.type=1;
        player.image.src = playerImages[0];
    }
    start=true;
    for(i=0;i<15;i++) {
        player.moveAngle = 0;

        direction = {x: 0, y: 0};


        player.speed = 0;
        if (myGameArea.keys && (myGameArea.keys[37] || myGameArea.keys[39] || myGameArea.keys[38] || myGameArea.keys[40])) {
            player.speed = 0.25;
            if (myGameArea.keys[67]) player.speed *=-0.5;
            if (myGameArea.keys[86]) player.speed *=2.7;

        }

        if (myGameArea.keys && myGameArea.keys[37]) {
            if(Math.sin(player.angle)>0.8&& !myGameArea.keys[38]&& !myGameArea.keys[40]) player.angle += Math.PI;
            direction.x += 90;
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
            if(Math.sin(player.angle)<-0.8&& !myGameArea.keys[38]&& !myGameArea.keys[40]) player.angle += Math.PI;
            direction.x -= 90;
        }
        if (myGameArea.keys && myGameArea.keys[38]) {
            if(Math.cos(player.angle)<-0.8&& !myGameArea.keys[39]&& !myGameArea.keys[37]) player.angle += Math.PI;
            direction.y += 90;
        }
        if (myGameArea.keys && myGameArea.keys[40]) {
            if(Math.cos(player.angle)>0.8&& !myGameArea.keys[39]&& !myGameArea.keys[37]) player.angle += Math.PI;
            direction.y -= 90;
        }

        direction.x += player.x;
        direction.y += player.y;

        reachPlayer(player, direction);

        if (myGameArea.keys) {
            if (myGameArea.keys[67]) player.angle += Math.PI;
        }

        player.newPos();
        var trueangle = player.angle;
        //if(player.speed!=0)  updateImage(player, playerImagesMovement);
        player.update();
        if( myGameArea.keys&& !myGameArea.keys[86] && start) {
            player.shoot();
        }
        start=false;
        player.angle = trueangle;
        if (myGameArea.keys ){
            if (myGameArea.keys[67]) {

                player.angle -= Math.PI;
            }
        }

    }
    if (player.x>myGameArea.canvas.width) player.x=myGameArea.canvas.width;
    if(player.y>myGameArea.canvas.height) player.y=myGameArea.canvas.height;
    if(player.x<0) player.x=00;
    if(player.y<0) player.y=0;
}

function updateEnemies (){
    myEnemies.forEach(function (enemy){
        if(explosionComponent){
            if(collides(enemy, explosionComponent)){
                enemy.life-=10;
            }
        }
        if(enemy.life<=0) enemy.active=false;
        else {
            if (enemy.type == 1) {
                updateEnemy1 (enemy);
                if (enemy.x>myGameArea.canvas.width) enemy.x=myGameArea.canvas.width;
                if(enemy.y>myGameArea.canvas.height) enemy.y=myGameArea.canvas.height;
                if(enemy.x<0) enemy.x=0;
                if(enemy.y<0) enemy.y=0;
            }
            else if (enemy.type==2) updateEnemy2 (enemy);
            else if (enemy.type==3) updateEnemy3 (enemy);
            else if (enemy.type==4) updateEnemy4 (enemy);
        }
    });
    myEnemies = myEnemies.filter(function(enemy) {
        return enemy.active;
    });
    enemy3Bullet.forEach(function (bullet) {
        updateEnemy3Bullets(bullet)
    });
    enemy3Bullet = enemy3Bullet.filter(function(bullet) {
        return bullet.active;
    });

}

function updateEnemy1 (elem){
    elem.speed = -3;
    elem.moveAngle = 0;
    elem.y-=40*Math.cos(elem.angle);
    if(collides(elem, player)) {
        elem.speed=0;
        player.life-=1;
        damages.push(new component(45, 45, "img/damage.png", player.x-15*Math.sin(player.angle),
            player.y+15*Math.cos(player.angle), 0, 0));
    }
    elem.y+=40*Math.cos(elem.angle);
    reachPlayer(elem, player);
    elem.newPos();
    elem.update();

}

function updateEnemy2 (elem){
    elem.speed = -6;
    elem.moveAngle = 0;

    if(collides(elem, player)) {
        elem.speed=-50;
        player.life-=20;
        for(i=-2; i<3; i++) {
            damages.push(new component(45, 45, "img/damage.png", player.x+i*10 - 15 * Math.sin(player.angle),
                player.y+i*10 + 15 * Math.cos(player.angle), 0, 0));
        }
    }
    reachPlayer(elem, player);
    elem.newPos();
    elem.update();
}

function updateEnemy3 (elem){
    elem.speed = 0;
    elem.moveAngle = 0;

    if(collides(elem, player)) {
        player.life-=20;
        for(i=-2; i<3; i++) {
            damages.push(new component(45, 45, "img/damage.png", player.x+i*10 - 15 * Math.sin(player.angle),
                player.y+i*10 + 15 * Math.cos(player.angle), 0, 0));
        }
    }
    if(Math.random()>0.99&&enemy3Bullet.length<3){
        enemy3Bullet.push(new component(60, 60, "img/damage.png", elem.x, elem.y, elem.angle, 20, 1));
        elem.x = (elem.x + 100*(Math.random()-0.5))%myGameArea.canvas.width;
        elem.y =(elem.y + 100*(Math.random()-0.5))%myGameArea.canvas.height;
    }
    for(i=0;i<3;i++) reachPlayer(elem, player);
    elem.newPos();
    elem.update();
}

function updateEnemy4 (elem){
    elem.speed = 0;
    elem.moveAngle = 0;

    if(collides(elem, player)) {
        player.life-=20;
        for(i=-2; i<3; i++) {
            damages.push(new component(45, 45, "img/damage.png", player.x+i*10 - 15 * Math.sin(player.angle),
                player.y+i*10 + 15 * Math.cos(player.angle), 0, 0));
        }
    }
    if(Math.random()>0.99&&myEnemies.length<21){
        for(i=0;i<5;i++){
            myEnemies.push(new component(30, 50, "img/enemy2.png", elem.x,
                elem.y, elem.angle+Math.PI+myEnemies.length%5, 1+(myEnemies.length)%1, 2));
        }
    }
    elem.moveAngle+=0.5;
    elem.newPos();
    elem.update();
}

function updateEnemy3Bullets(bullet){
    bullet.speed = -13;
    bullet.moveAngle = 0;
    reachPlayer(bullet, player);
    bullet.newPos();
    bullet.update();
    if(bullet.x>myGameArea.canvas.width||bullet.x<0||bullet.y<0||bullet.y>myGameArea.canvas.height) bullet.active = false;
    if (collides(bullet, player)) {

        player.life -= 5;
        bullet.life -=10;
        damages.push(new component(45, 45, "img/damage.png", player.x-15*Math.sin(player.angle),
            player.y+15*Math.cos(player.angle), 0, 10));
        if (bullet.life <= 0) bullet.active = false;
    }
}

function updateBullets(){
    playerBullets.forEach(function (bullet) {
        bullet.speed = 15;
        bullet.newPos();
        bullet.update();
        myEnemies.forEach(function(enemy) {
            bullet.angle+=Math.PI;
            if (collides(bullet, enemy)&&(enemy.type!=4||((Math.sin(bullet.angle)-Math.sin(enemy.angle)<1)&&(Math.cos(bullet.angle)-Math.cos(enemy.angle)<1))&&(
                    (Math.sin(bullet.angle)-Math.sin(enemy.angle)>-1)&&(Math.cos(bullet.angle)-Math.cos(enemy.angle)>-1))))
            {
                if (bullet.type == 1) {
                    bullet.angle-=Math.PI;
                    explosionComponent = new component(200, 240, "img/explosion/1.gif", bullet.x + 100 * Math.sin(bullet.angle),
                        bullet.y - 100 * Math.cos(bullet.angle), bullet.angle, 0, 0);
                    bullet.life = 0;
                    enemy.life = 0;
                    bullet.angle+=Math.PI;
                }
                enemy.life -= 1;
                bullet.life -= 1;
                damages.push(new component(45, 45, "img/damage.png", enemy.x - 15 * Math.sin(enemy.angle),
                    enemy.y + 15 * Math.cos(enemy.angle), 0, 10));
                if (enemy.life <= 0) {
                    enemy.active = false;
                    deaths += 1;
                }
                if (bullet.life <= 0) bullet.active = false;
            }
            else if(collides(bullet, enemy)&&enemy.type==4){
                bullet.active=false;
                damages.push(new component(55, 55, "img/nondamage.png", enemy.x - 15 * Math.sin(enemy.angle),
                    enemy.y + 15 * Math.cos(enemy.angle), 0, 10));
            }
            bullet.angle-=Math.PI;

        })
    })

    playerBullets = playerBullets.filter(function(bullet) {
        return bullet.active;
    });
    if(explosionComponent!=null) {
        explosionComponent.speed=20;
        explosionComponent.newPos();
        explosionComponent.update();
        if (myGameArea.frameNo%2==0) explosionComponent= updateImage(explosionComponent, explosionImages);
    }
}

function updatePowerUps (){
    powerUps.forEach(function (power) {
        power.speed = 0;
        power.newPos();
        power.update();
        if (collides(power, player)) {
            power.life -= 1;
            power.active = false;
            if (power.type != 1) {
                if(player.type ==power.type) {
                    if(ammo<140) ammo+=60;
                    else ammo=200;
                }
                else {
                    player.type=power.type;
                    ammo = 60;
                    player.image.src = playerImages[power.type - 1];
                }
            }
            else {
                if (player.life<1700) player.life += 300;
                else player.life = 2000;
            }
        }
    });

    powerUps = powerUps.filter(function(power) {
        return power.active;
    });
}

function updateDamages(){
    damages.forEach(function (damage) {
        damage.speed = 0;
        damage.life -=1;
        damage.newPos();
        damage.update();
        if (damage.life<=0) damage.active=false;
    });
    damages = damages.filter(function (damage){
        return damage.active;
    });
}

function reachPlayer(elem, aim){
    var distance_enemy_player= 0;
    var desired_cos= 0;
    var desired_sin= 0;
    var mycos= 0;
    var mysin= 0;
    var modify=0;
    distance_enemy_player = Math.sqrt(Math.pow(elem.x - aim.x, 2) + Math.pow(elem.y - aim.y, 2));
    desired_cos = (aim.y - elem.y) / distance_enemy_player;
    desired_sin = (aim.x - elem.x) / distance_enemy_player;
    mycos = Math.cos(elem.angle);
    mysin = Math.sin(elem.angle);

    if (desired_cos > mycos && desired_sin > mysin) modify = (distance_enemy_player / 300);
    else if (desired_cos > mycos && desired_sin < mysin) modify = -(distance_enemy_player / 300);
    else if (desired_cos < mycos && desired_sin < mysin) modify = (distance_enemy_player / 300);
    else if (desired_cos < mycos && desired_sin > mysin) modify = -(distance_enemy_player / 300);
    else if ((desired_cos == mycos && desired_sin != mysin) || (desired_cos != mycos && desired_sin == mysin)) modify = 0.001;
    if(elem==player) modify*=1.5;
    elem.moveAngle = elem.moveAngle + modify;

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

/*
var direction;
var x = false;
var y = false;
var x1 = false;
var y1 = false;
var dir = false;
function updatePlayer(){
    if(ammo==0) {
        player.type=1;
        player.image.src = playerImages[0];
    }

    if(player.speed==0){
        x=false;
        y=false;
        x1=false;
        y1=false;
    }
    for(i=0;i<15;i++) {
        player.moveAngle = 0;
        player.speed = 0;
        direction = {x: 0, y: 0};
        if (myGameArea.keys && (myGameArea.keys[37] || myGameArea.keys[39] || myGameArea.keys[38] || myGameArea.keys[40])&&!myGameArea.keys[67]) {
            player.speed = 0.3;
        }

        if (myGameArea.keys && myGameArea.keys[37]) {
            direction.x += 200;
            if(x==false) y=true;
            if(x==true) y1=true;
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
            if(x==false) y=true;
            if(x==true) y1=true;
            direction.x -= 200;
        }
        if (myGameArea.keys && myGameArea.keys[38]) {
            if(y==false) x=true;
            if(y==true) x1=true;
            direction.y += 200;
        }
        if (myGameArea.keys && myGameArea.keys[40]) {
            if(y==false) x=true;
            if(y==true) x1=true;
            direction.y -= 200;
        }
        if (myGameArea.keys && myGameArea.keys[37]) {
            if (Math.sin(player.angle) > 0.72) {
                if(y==true||y1==true) direction.y *=-1;
                direction.x *= -1;
                if(player.speed>0) player.speed *=-1;
            }
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
            if (Math.sin(player.angle) <- 0.72) {
                if(y==true||y1==true) direction.y *=-1;
                direction.x *= -1;
                if(player.speed>0) player.speed *=-1;
            }
        }
        if (myGameArea.keys && myGameArea.keys[38]) {
            if (Math.cos(player.angle) <-0.72) {
                if(x==true||x1==true) direction.x *=-1;
                direction.y *=-1;
                if(player.speed>0) player.speed *=-1;
            }
        }
        if (myGameArea.keys && myGameArea.keys[40]) {
            if (Math.cos(player.angle) > 0.72) {
                if(x==true||x1==true) direction.x *=-1;
                direction.y *=-1;
                if(player.speed>0) player.speed *=-1;
            }
        }

        direction.x += player.x;
        direction.y += player.y;

        reachPlayer(player, direction);


        player.newPos();
        var trueangle = player.angle;

        //if(player.speed!=0)  updateImage(player, playerImagesMovement);
        player.update();
        player.angle = trueangle;
    }
    if(myGameArea.keys && myGameArea.keys[32]) {
        player.shoot();
    }
    document.getElementById("debug").innerHTML = player.speed.toString();

}*/