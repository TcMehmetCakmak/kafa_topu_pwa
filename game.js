"use strict";


/* =========================================
   CANVAS
========================================= */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


/* =========================================
   UI
========================================= */

const startScreen =
    document.getElementById("startScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const playerScoreElement =
    document.getElementById("playerScore");

const enemyScoreElement =
    document.getElementById("enemyScore");

const timerElement =
    document.getElementById("timer");

const gameResult =
    document.getElementById("gameResult");

const finalScore =
    document.getElementById("finalScore");


/* =========================================
   GAME CONFIG
========================================= */

const GAME_TIME = 60;

let gameRunning = false;

let gameTime = GAME_TIME;

let lastTime = 0;

let timerAccumulator = 0;


/* =========================================
   WORLD
========================================= */

const world = {

    width: 1000,

    height: 600,

    ground: 500

};


/* =========================================
   RESIZE
========================================= */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const dpr =
        Math.min(window.devicePixelRatio || 1, 2);

    canvas.width =
        rect.width * dpr;

    canvas.height =
        rect.height * dpr;

    ctx.setTransform(
        canvas.width / world.width,
        0,
        0,
        canvas.height / world.height,
        0,
        0
    );

}


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================
   PLAYER
========================================= */

const player = {

    x: 180,

    y: world.ground - 95,

    width: 55,

    height: 95,

    vx: 0,

    vy: 0,

    speed: 430,

    jumpPower: 850,

    onGround: true,

    color: "#2563eb",

    skin: "#f2c29b"

};


/* =========================================
   ENEMY
========================================= */

const enemy = {

    x: 765,

    y: world.ground - 95,

    width: 55,

    height: 95,

    vx: 0,

    vy: 0,

    speed: 280,

    jumpPower: 780,

    onGround: true,

    color: "#ef4444",

    skin: "#d69b72"

};


/* =========================================
   BALL
========================================= */

const ball = {

    x: world.width / 2,

    y: 280,

    radius: 25,

    vx: 0,

    vy: 0,

    gravity: 1100,

    bounce: 0.72,

    friction: 0.992

};


/* =========================================
   GOALS
========================================= */

const leftGoal = {

    x: 20,

    y: 360,

    width: 80,

    height: 140

};


const rightGoal = {

    x: world.width - 100,

    y: 360,

    width: 80,

    height: 140

};


/* =========================================
   SCORE
========================================= */

let playerScore = 0;

let enemyScore = 0;


/* =========================================
   KEYBOARD
========================================= */

const keys = {

    left: false,

    right: false,

    jump: false

};


window.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {
            keys.left = true;
        }

        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {
            keys.right = true;
        }

        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w" ||
            event.code === "Space"
        ) {
            keys.jump = true;
        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {
            keys.left = false;
        }

        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {
            keys.right = false;
        }

        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w" ||
            event.code === "Space"
        ) {
            keys.jump = false;
        }

    }
);


/* =========================================
   MOBILE CONTROLS
========================================= */

function holdButton(
    element,
    property
) {

    const start = event => {

        event.preventDefault();

        keys[property] = true;

    };


    const end = event => {

        event.preventDefault();

        keys[property] = false;

    };


    element.addEventListener(
        "pointerdown",
        start
    );

    element.addEventListener(
        "pointerup",
        end
    );

    element.addEventListener(
        "pointercancel",
        end
    );

    element.addEventListener(
        "pointerleave",
        end
    );

}


holdButton(
    document.getElementById("leftButton"),
    "left"
);


holdButton(
    document.getElementById("rightButton"),
    "right"
);


holdButton(
    document.getElementById("jumpButton"),
    "jump"
);


/* =========================================
   RESET BALL
========================================= */

function resetBall(direction = 0) {

    ball.x = world.width / 2;

    ball.y = 250;

    ball.vx = direction * 250;

    ball.vy = -100;

}


/* =========================================
   RESET PLAYERS
========================================= */

function resetPlayers() {

    player.x = 180;

    player.y =
        world.ground - player.height;

    player.vx = 0;

    player.vy = 0;

    player.onGround = true;


    enemy.x = 765;

    enemy.y =
        world.ground - enemy.height;

    enemy.vx = 0;

    enemy.vy = 0;

    enemy.onGround = true;

}


/* =========================================
   START GAME
========================================= */

function startGame() {

    playerScore = 0;

    enemyScore = 0;

    gameTime = GAME_TIME;

    timerAccumulator = 0;

    playerScoreElement.textContent =
        playerScore;

    enemyScoreElement.textContent =
        enemyScore;

    timerElement.textContent =
        gameTime;

    resetPlayers();

    resetBall();

    startScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    gameRunning = true;

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);

}


startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


/* =========================================
   PLAYER UPDATE
========================================= */

function updatePlayer(dt) {

    player.vx = 0;


    if (keys.left) {

        player.vx = -player.speed;

    }


    if (keys.right) {

        player.vx = player.speed;

    }


    if (
        keys.jump &&
        player.onGround
    ) {

        player.vy =
            -player.jumpPower;

        player.onGround = false;

    }


    player.x +=
        player.vx * dt;

    player.vy +=
        1800 * dt;

    player.y +=
        player.vy * dt;


    if (
        player.y + player.height >=
        world.ground
    ) {

        player.y =
            world.ground -
            player.height;

        player.vy = 0;

        player.onGround = true;

    }


    player.x =
        Math.max(
            105,
            Math.min(
                450,
                player.x
            )
        );

}


/* =========================================
   ENEMY AI
========================================= */

function updateEnemy(dt) {

    const targetX =
        ball.x;

    const center =
        enemy.x +
        enemy.width / 2;


    enemy.vx = 0;


    if (
        targetX < center - 10
    ) {

        enemy.vx =
            -enemy.speed;

    }


    if (
        targetX > center + 10
    ) {

        enemy.vx =
            enemy.speed;

    }


    enemy.x +=
        enemy.vx * dt;


    /*
       Rakip topa yaklaşınca
       bazen zıplar.
    */

    const ballNear =
        Math.abs(
            ball.x - center
        ) < 100;


    if (
        ballNear &&
        ball.y < enemy.y + 30 &&
        enemy.onGround &&
        Math.random() < 0.08
    ) {

        enemy.vy =
            -enemy.jumpPower;

        enemy.onGround = false;

    }


    enemy.vy +=
        1800 * dt;

    enemy.y +=
        enemy.vy * dt;


    if (
        enemy.y +
        enemy.height >=
        world.ground
    ) {

        enemy.y =
            world.ground -
            enemy.height;

        enemy.vy = 0;

        enemy.onGround = true;

    }


    enemy.x =
        Math.max(
            550,
            Math.min(
                815,
                enemy.x
            )
        );

}


/* =========================================
   BALL PHYSICS
========================================= */

function updateBall(dt) {

    ball.vy +=
        ball.gravity * dt;


    ball.x +=
        ball.vx * dt;

    ball.y +=
        ball.vy * dt;


    /*
       Zemin
    */

    if (
        ball.y +
        ball.radius >=
        world.ground
    ) {

        ball.y =
            world.ground -
            ball.radius;

        ball.vy *=
            -ball.bounce;

        ball.vx *=
            0.94;

    }


    /*
       Sol duvar
    */

    if (
        ball.x -
        ball.radius <= 0
    ) {

        ball.x =
            ball.radius;

        ball.vx *= -0.75;

    }


    /*
       Sağ duvar
    */

    if (
        ball.x +
        ball.radius >=
        world.width
    ) {

        ball.x =
            world.width -
            ball.radius;

        ball.vx *= -0.75;

    }


    ball.vx *=
        Math.pow(
            ball.friction,
            dt * 60
        );


    /*
       Oyuncuya çarpma
    */

    collideBallWithPlayer(player);


    /*
       Rakibe çarpma
    */

    collideBallWithPlayer(enemy);

}


/* =========================================
   PLAYER / BALL COLLISION
========================================= */

function collideBallWithPlayer(character) {

    const closestX =
        Math.max(
            character.x,
            Math.min(
                ball.x,
                character.x +
                character.width
            )
        );


    const closestY =
        Math.max(
            character.y,
            Math.min(
                ball.y,
                character.y +
                character.height
            )
        );


    const dx =
        ball.x - closestX;

    const dy =
        ball.y - closestY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        distance <
        ball.radius
    ) {

        let nx = dx;

        let ny = dy;


        if (distance === 0) {

            nx = 0;

            ny = -1;

        } else {

            nx /= distance;

            ny /= distance;

        }


        const overlap =
            ball.radius -
            distance;


        ball.x +=
            nx * overlap;

        ball.y +=
            ny * overlap;


        /*
           Çarpma gücü
        */

        const kickPower =
            character === player
                ? 620
                : 580;


        ball.vx +=
            nx * kickPower;

        ball.vy +=
            ny * kickPower;


        /*
           Hareket yönü
        */

        ball.vx +=
            character.vx * 0.35;

    }

}


/* =========================================
   GOALS
========================================= */

function checkGoals() {

    /*
       Oyuncu rakip kaleye gol attı
    */

    if (
        ball.x +
        ball.radius >
        rightGoal.x &&
        ball.y >
        rightGoal.y &&
        ball.y <
        rightGoal.y +
        rightGoal.height
    ) {

        playerScore++;

        playerScoreElement.textContent =
            playerScore;

        resetAfterGoal(1);

    }


    /*
       Rakip oyuncu kalesine gol attı
    */

    if (
        ball.x -
        ball.radius <
        leftGoal.x +
        leftGoal.width &&
        ball.y >
        leftGoal.y &&
        ball.y <
        leftGoal.y +
        leftGoal.height
    ) {

        enemyScore++;

        enemyScoreElement.textContent =
            enemyScore;

        resetAfterGoal(-1);

    }

}


/* =========================================
   GOAL RESET
========================================= */

function resetAfterGoal(direction) {

    resetPlayers();

    resetBall(direction);

}


/* =========================================
   TIMER
========================================= */

function updateTimer(dt) {

    timerAccumulator += dt;


    if (
        timerAccumulator >= 1
    ) {

        timerAccumulator -= 1;

        gameTime--;

        gameTime =
            Math.max(
                0,
                gameTime
            );

        timerElement.textContent =
            gameTime;


        if (
            gameTime <= 0
        ) {

            endGame();

        }

    }

}


/* =========================================
   END GAME
========================================= */

function endGame() {

    gameRunning = false;

    finalScore.textContent =
        `${playerScore} - ${enemyScore}`;


    if (
        playerScore >
        enemyScore
    ) {

        gameResult.textContent =
            "🏆 Kazandın!";

    } else if (
        playerScore <
        enemyScore
    ) {

        gameResult.textContent =
            "😢 Kaybettin!";

    } else {

        gameResult.textContent =
            "🤝 Berabere!";

    }


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* =========================================
   DRAW FIELD
========================================= */

function drawField() {

    /*
       Çim
    */

    ctx.fillStyle =
        "#72c850";

    ctx.fillRect(
        0,
        0,
        world.width,
        world.height
    );


    /*
       Çim çizgileri
    */

    ctx.fillStyle =
        "rgba(255,255,255,.04)";


    for (
        let x = 0;
        x < world.width;
        x += 70
    ) {

        ctx.fillRect(
            x,
            0,
            35,
            world.ground
        );

    }


    /*
       Saha çizgisi
    */

    ctx.strokeStyle =
        "rgba(255,255,255,.8)";

    ctx.lineWidth = 4;


    ctx.beginPath();

    ctx.moveTo(
        0,
        world.ground
    );

    ctx.lineTo(
        world.width,
        world.ground
    );

    ctx.stroke();


    /*
       Orta çizgi
    */

    ctx.beginPath();

    ctx.moveTo(
        world.width / 2,
        0
    );

    ctx.lineTo(
        world.width / 2,
        world.ground
    );

    ctx.stroke();


    /*
       Orta daire
    */

    ctx.beginPath();

    ctx.arc(
        world.width / 2,
        world.ground,
        100,
        Math.PI,
        Math.PI * 2
    );

    ctx.stroke();


    drawGoal(
        leftGoal
    );

    drawGoal(
        rightGoal
    );

}


/* =========================================
   DRAW GOAL
========================================= */

function drawGoal(goal) {

    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth = 6;


    ctx.strokeRect(
        goal.x,
        goal.y,
        goal.width,
        goal.height
    );


    /*
       Ağ
    */

    ctx.strokeStyle =
        "rgba(255,255,255,.25)";

    ctx.lineWidth = 1;


    for (
        let x = goal.x;
        x <= goal.x + goal.width;
        x += 15
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            goal.y
        );

        ctx.lineTo(
            x,
            goal.y + goal.height
        );

        ctx.stroke();

    }


    for (
        let y = goal.y;
        y <= goal.y + goal.height;
        y += 15
    ) {

        ctx.beginPath();

        ctx.moveTo(
            goal.x,
            y
        );

        ctx.lineTo(
            goal.x + goal.width,
            y
        );

        ctx.stroke();

    }

}


/* =========================================
   DRAW PLAYER
========================================= */

function drawCharacter(
    character,
    label
) {

    const centerX =
        character.x +
        character.width / 2;


    /*
       Gölge
    */

    ctx.fillStyle =
        "rgba(0,0,0,.2)";

    ctx.beginPath();

    ctx.ellipse(
        centerX,
        world.ground + 4,
        38,
        9,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Bacaklar
    */

    ctx.strokeStyle =
        "#111827";

    ctx.lineWidth = 10;

    ctx.lineCap = "round";


    ctx.beginPath();

    ctx.moveTo(
        centerX - 13,
        character.y + 66
    );

    ctx.lineTo(
        centerX - 17,
        character.y + 92
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        centerX + 13,
        character.y + 66
    );

    ctx.lineTo(
        centerX + 17,
        character.y + 92
    );

    ctx.stroke();


    /*
       Gövde
    */

    ctx.fillStyle =
        character.color;

    ctx.fillRect(
        character.x + 8,
        character.y + 30,
        character.width - 16,
        43
    );


    /*
       Kollar
    */

    ctx.strokeStyle =
        character.skin;

    ctx.lineWidth = 9;


    ctx.beginPath();

    ctx.moveTo(
        character.x + 8,
        character.y + 38
    );

    ctx.lineTo(
        character.x - 7,
        character.y + 63
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        character.x +
        character.width - 8,
        character.y + 38
    );

    ctx.lineTo(
        character.x +
        character.width + 7,
        character.y + 63
    );

    ctx.stroke();


    /*
       Kafa
    */

    ctx.fillStyle =
        character.skin;

    ctx.beginPath();

    ctx.arc(
        centerX,
        character.y + 20,
        24,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Saç
    */

    ctx.fillStyle =
        "#202020";

    ctx.beginPath();

    ctx.arc(
        centerX,
        character.y + 12,
        23,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Göz
    */

    ctx.fillStyle =
        "#111827";

    ctx.beginPath();

    ctx.arc(
        centerX + 8,
        character.y + 19,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       İsim
    */

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "rgba(255,255,255,.9)";

    ctx.fillText(
        label,
        centerX,
        character.y - 10
    );

}


/* =========================================
   DRAW BALL
========================================= */

function drawBall() {

    /*
       Gölge
    */

    ctx.fillStyle =
        "rgba(0,0,0,.18)";

    ctx.beginPath();

    ctx.ellipse(
        ball.x,
        world.ground + 3,
        ball.radius * .9,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Top
    */

    ctx.fillStyle =
        "#ffffff";

    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Siyah desen
    */

    ctx.fillStyle =
        "#111827";


    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    const points = [
        [0, -15],
        [14, -5],
        [9, 13],
        [-9, 13],
        [-14, -5]
    ];


    points.forEach(point => {

        ctx.beginPath();

        ctx.arc(
            ball.x + point[0],
            ball.y + point[1],
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

}


/* =========================================
   DRAW
========================================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        world.width,
        world.height
    );


    drawField();


    drawCharacter(
        player,
        "SEN"
    );


    drawCharacter(
        enemy,
        "RAKİP"
    );


    drawBall();

}


/* =========================================
   GAME LOOP
========================================= */

function gameLoop(timestamp) {

    if (!gameRunning) {
        return;
    }


    let dt =
        (timestamp - lastTime) / 1000;


    /*
       Büyük FPS sıçramalarında
       fiziğin bozulmasını önle.
    */

    dt =
        Math.min(
            dt,
            0.033
        );


    lastTime =
        timestamp;


    updatePlayer(dt);

    updateEnemy(dt);

    updateBall(dt);

    checkGoals();

    updateTimer(dt);

    draw();


    if (gameRunning) {

        requestAnimationFrame(
            gameLoop
        );

    }

}


/* =========================================
   INITIAL
========================================= */

resizeCanvas();

resetPlayers();

resetBall();

draw();