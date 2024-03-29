document.addEventListener("DOMContentLoaded", function() {

    ///// SETUP /////

    const containerWidth = document.getElementById("heroContainer").offsetWidth;
    const containerHeight = document.getElementById("heroContainer").offsetHeight;
    const heroHeight = 50;
    const heroWidth = 50;
    const enemyHeight = 50;
    const enemyWidth = 50;
    const bossWidth = 200;
    const bossHeight = 80;
    const missileWidth = 10;
    const missileLength = 28;
    const paddingSmall = 5;
    const enemyHitPoints = 20;
    const bossHitPoints = 50;
    const hitsRequiredToWin = 10;
    const lose_message = "Game Over </br> Refresh page to try again";
    const win_message = "You Win </br> Refresh page play again";

    ///// VARIABLES /////

    let gameplay = false;
    let heroPosition = {
        top: (containerHeight - 100),
        left: (containerWidth / 2 - heroWidth)
    };
    let enemiesOnBoard = 0;
    let missiles = [];
    let enemies = [];
    let enemyMissiles = [];
    let boss = {
        top: -10,
        left: (containerWidth / 2 - bossWidth / 2)
    };
    let bossHits = 0;
    let bossGameon = false;
    let score = 0;
    let level = 1;
    let left = true;
    let bossLeft = true;
    let speed = 3;
    let bossAlive = false;

    let scoreCard = document.getElementById("score");
    let lvl = document.getElementById("level");

    ///// CLICK TO PLAY /////

    startGame = () => {
        document.getElementById("startmodule").style.display = 'none';
        gameplay = true;
        scoreCard.innerHTML = "Score : " + score;
        lvl.innerHTML = "LVL - " + level;
        drawHero();
        makeEnemies(1);
        gameloop();
    };

    ///// CONTROLS /////

    document.onkeydown = (e) => {
        // left
        if (e.keyCode === 37) {
            if (heroPosition.left >= 0 + paddingSmall) {
                heroPosition.left = heroPosition.left - 5;
                moveHero();
            }
            // right
        } else if (e.keyCode === 39) {
            if (heroPosition.left <= containerWidth - heroWidth - paddingSmall) {
                heroPosition.left = heroPosition.left + 5;
                moveHero();
            }
            // up
        } else if (e.keyCode === 38) {
            if (heroPosition.top >= 0 + paddingSmall) {
                heroPosition.top = heroPosition.top - 5;
                moveHero();
            }
            // down
        } else if (e.keyCode === 40) {
            if (heroPosition.top <= containerHeight - heroHeight - paddingSmall) {
                heroPosition.top = heroPosition.top + 5;
                moveHero();
            }
            // space - SHOOT
        } else if (e.keyCode === 32) {
            missiles.push({
                top: heroPosition.top,
                left: heroPosition.left + 20
            });
            drawMissiles();
        }
    };

    ///// HERO /////

    drawHero = () => {
        let heroContainer = document.getElementById("heroContainer");
        heroContainer.innerHTML = " ";
        heroContainer.innerHTML += `<div id='hero' style='top:${ heroPosition.top + "px " }; left:${ heroPosition.left + "px " }'></div>`;
    };
    moveHero = () => {
        let hero = document.getElementById("hero ")
        hero.style.top = heroPosition.top + "px ";
        hero.style.left = heroPosition.left + "px ";
    };
    missileHitHero = () => {
        for (let i = 0; i < enemyMissiles.length; i++) {
            if (enemyMissiles[i].top + missileLength >= heroPosition.top &&
                enemyMissiles[i].top + missileLength <= heroPosition.top + heroHeight &&
                enemyMissiles[i].left + missileWidth >= heroPosition.left &&
                enemyMissiles[i].left <= heroPosition.left + heroWidth) {
                enemyMissiles.splice(i, 1);
                gameover(0);
            }
        }
    };
    enemyHitHero = () => {
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].top + enemyHeight >= heroPosition.top &&
                enemies[i].top <= heroPosition.top + heroHeight &&
                enemies[i].left + enemyWidth >= heroPosition.left &&
                enemies[i].left <= heroPosition.left + heroWidth) {
                enemies.splice(i, 1);
                gameover(0);
            }
        }
    };

    ///// MISSILES /////

    drawMissiles = () => {
        let missileContainer = document.getElementById("missileContainer");
        missileContainer.innerHTML = " ";
        for (let i = 0; i < missiles.length; i++) {
            missileContainer.innerHTML += `<div class='missile' style='top:${ missiles[i].top + 'px' }; left:${ missiles[i].left + 'px' }'></div>`;
        }
    };
    moveMissiles = () => {
        for (let i = 0; i < missiles.length; i++) {
            if (missiles[i].top <= 0) {
                missiles.splice(i, 1);
            } else {
                missiles[i].top = missiles[i].top - 5;
            }
        }
    };

    ///// ENEMY /////

    makeEnemies = (number, t = 50, offset = 0) => {
        enemiesOnBoard += number;
        for (let i = 0; i < number; i++) {
            let w = ((containerWidth / number) * i + enemyWidth * 2) + offset;
            enemies.push({
                top: t,
                left: w
            })
        }
    };
    drawEnemies = () => {
        let enemyContainer = document.getElementById("enemiesContainer");
        enemyContainer.innerHTML = " ";
        for (let i = 0; i < enemies.length; i++) {
            enemyContainer.innerHTML += `<div class='enemy' style='top:${ enemies[i].top + 'px' }; left:${ enemies[i].left + 'px' }'></div>`;

        }
    };
    moveEnemies = () => {
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].top + enemyHeight + paddingSmall >= containerHeight) {
                enemies.splice(i, 1);
                enemiesOnBoard -= 1;
                checkEnemies();
            } else {
                enemies[i].top = enemies[i].top + speed;

            }
        }
    };
    moveEnemiesHoizontal = () => {
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].left <= paddingSmall) {
                left = false;
            } else if (enemies[i].left > containerWidth - paddingSmall - enemyWidth) {
                left = true;
            }
            if (left === true) {
                enemies[i].left -= speed;
            } else {
                enemies[i].left += speed;
            }
        }
    };
    targetHit = () => {
        for (let enemy = 0; enemy < enemies.length; enemy++) {
            for (let missile = 0; missile < missiles.length; missile++) {
                if (missiles[missile].top <= enemies[enemy].top + enemyHeight &&
                    missiles[missile].top > enemies[enemy].top &&
                    missiles[missile].left >= enemies[enemy].left &&
                    missiles[missile].left <= enemies[enemy].left + enemyWidth) {
                    missiles.splice(missile, 1);
                    enemies.splice(enemy, 1);
                    score += enemyHitPoints;
                    enemiesOnBoard -= 1;
                    checkEnemies();
                }
            }
        }
    };
    checkEnemies = () => {
        if (enemiesOnBoard <= 0) {
            level = level + 1;
            levelUp();
        }
    };

    ///// BOSS /////

    makeBoss = () => {
        let bossContainer = document.getElementById("bossContainer");
        bossContainer.innerHTML = " ";
        bossContainer.innerHTML += `<div id='boss' style="top:${boss.top + 'px'}; left:${boss.left + 'px'} "><div>`;
        bossAlive = true;
    };
    drawBoss = () => {
        let bossContainer = document.getElementById("bossContainer");
        bossContainer.innerHTML = " ";
        bossContainer.innerHTML += `<div id='boss' style='top:${ boss.top + "px " }; left:${ boss.left + "px " }'></div>`;
    };
    bossHoverDown = () => {
        (boss.top <= 100 ? boss.top += speed : bossGameon = true);
    };
    bossSideToSide = () => {
        if (boss.left <= paddingSmall) {
            bossLeft = false;

        } else if (boss.left > containerWidth - paddingSmall - bossWidth) {
            bossLeft = true;

        }
        if (bossLeft === true) {
            boss.left -= 10;
        } else {
            boss.left += 10;
        }
    };
    bossHit = () => {
        for (let i = 0; i < missiles.length; i++) {
            if (missiles[i].top <= boss.top + bossHeight &&
                missiles[i].top >= boss.top &&
                missiles[i].left + missileWidth >= boss.left &&
                missiles[i].left + missileWidth <= boss.left + bossWidth) {
                missiles.splice(i, 1);
                score += bossHitPoints;
                bossHits += 1;
                if (bossHits >= hitsRequiredToWin) {
                    document.getElementById("boss").style.display = "none";
                    bossAlive = false;
                    bossGameon = false;
                    gameover(1);
                }
            }
        }
    };

    ///// BOSS MISSILES ///// 

    makeBossMissiles = () => {
        if (boss.left == containerWidth / 4 || boss.left == containerWidth / 2 + bossWidth || boss.left == containerWidth / 2 - bossWidth / 2 || boss.left == containerWidth / 2 + bossWidth / 2) {
            enemyMissiles.push({
                top: boss.top,
                left: boss.left
            });
        }
    };
    drawBossMissiles = () => {
        let enemyMissileContainer = document.getElementById("enemyMissileContainer");
        enemyMissileContainer.innerHTML = " ";
        for (let i = 0; i < enemyMissiles.length; i++) {
            enemyMissileContainer.innerHTML += `<div class="enemyMissile " style="top:${enemyMissiles[i].top + "px"}; left: ${enemyMissiles[i].left + "px"} "></div>`
        }
    };
    moveBossMissiles = () => {
        for (let i = 0; i < enemyMissiles.length; i++) {
            if (enemyMissiles[i].top >= containerHeight) {
                enemyMissiles.splice(i, 1);
            } else {
                enemyMissiles[i].top += 5;
            }
        }
    };

    levelUp = () => {
        if (level >= 1 && level <= 4) {
            makeEnemies(level);

        } else if (level >= 5 && level <= 9) {
            speed += 1
            makeEnemies(5);
            makeEnemies(5, 0, 50);
        } else if (level = 10) {
            if (!bossAlive) {
                makeBoss();
            }
            makeEnemies(5);
            makeEnemies(5, 0, 50);
            makeEnemies(5, -50, -50);
            makeEnemies(5, 50, -100);
        }
    };

    gameover = (x) => {
        if (x === 0) {
            document.getElementById("hero").style.display = "none";
            gameplay = false;
            document.getElementById('msg').innerHTML = lose_message;
            document.getElementById('finalScore').innerHTML = `Score = ${score}`;
        } else {
            gameplay = false;
            document.getElementById('msg').innerHTML = win_message;
            document.getElementById('finalScore').innerHTML = `Score = ${score}`;

        }
    };
    gameloop = () => {
        if (gameplay) {
            setTimeout(gameloop, 100);
            drawHero();
            drawEnemies();
            moveEnemies();
            moveEnemiesHoizontal();
            drawMissiles();
            moveMissiles();
            targetHit();
            missileHitHero();
            enemyHitHero();
            scoreCard.innerHTML = "Score : " + score;
            lvl.innerHTML = "LVL - " + level;
            if (bossAlive === true) {
                bossHoverDown();
                drawBoss();
                if (bossGameon === true) {
                    bossSideToSide();
                    makeBossMissiles();
                    moveBossMissiles();
                    drawBossMissiles();
                    bossHit();
                }
            }
        }

    };
})