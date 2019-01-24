function fillLevel1 (){
    if(deaths%4==0){
        deaths +=1;
        var i= myGameArea.frameNo%4;
        powerUps.push(new component (30, 30, powerImages[i], Math.random()*myGameArea.canvas.width,
            Math.random()*myGameArea.canvas.height, 0, 1, i+1));
    }
    if(everyinterval(50)&&myEnemies.length<deaths%13){
        myEnemies.push(new component(56, 88, "img/enemy.png", Math.random()*myGameArea.canvas.width,
            Math.random()*myGameArea.canvas.height, player.angle+Math.PI/2, 3+(myEnemies.length)%1, 1));
    }
    if(everyinterval(100)&&deaths%11==0){
        myEnemies.push(new component(80, 105, "img/enemy3.png", Math.random()*myGameArea.canvas.width,
            Math.random()*myGameArea.canvas.height, myEnemies.length, 2+(myEnemies.length)%1, 3));
    }
    if(everyinterval(100)&&deaths%15==0) {
        myEnemies.push(new component(120, 90, "img/figa.png", myGameArea.canvas.width/2+200*Math.random(),
            myGameArea.canvas.height/2+200*Math.random(), myEnemies.length, 2+(myEnemies.length)%1, 4));
    }
}