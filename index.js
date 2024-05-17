class Game {
    constructor() {
        this.startScreen = document.getElementById('game-intro')
        this.gameScreen = document.getElementById("game-screen")
        this.gameEndScreen = document.getElementById('game-end')
        this.player = new Player(this.gameScreen, 215, 450, 100, 100, './5ship.png')
        this.height = 80
        this.width = 50
        this.obstacles = []
        this.bulletsArr = []
        this.score = 0
        this.lives = 0
        this.timer = 60
        this.gameIsOver = false
        this.gameIntervalId = null
        this.gameLoopFrequency = 1000/60
        this.frames = 0
        this.scoreElement = document.getElementById("score");
        this.livesElement = document.getElementById("lives");
        this.stats = document.getElementById("stats-container");
        this.clockContainer = document.getElementById("clock-container");
        this.statsContainer = document.getElementById('stats-container')
        this.clock = document.getElementById("clock");
        this.endMessage = document.getElementById("end-message");

        
        document.addEventListener("keydown",(e) => {
            if(e.key === " "){
                let bulletSound = new Audio('./13ship-shoot.mp3')
                bulletSound.play()
                bulletSound.volume = 0.1
                const bullet  = this.player.shoot()
                this.bulletsArr.push(bullet)
                bullet.element.style.top = bullet.top +"px"
                bullet.element.style.left = bullet.left + "px"
                bullet.element.style.width = bullet.width + "px"
                bullet.element.style.height = bullet.height + "px"
                bullet.element.style.position = "absolute"
                bullet.element.style.backgroundColor = bullet.backgroundColor
                this.gameScreen.appendChild(bullet.element)
              
            }
        })
    }
    
    start() {
        this.gameScreen.style.height = `${this.height}vh`
        this.gameScreen.style.width = `${this.width}vw`

        this.startScreen.style.display = 'none'
        this.startScreen.style.padding = 0
        this.startScreen.style.height = 0

        this.gameScreen.style.display = 'flex'

        this.clockContainer.style.display = 'block'
        this.statsContainer.style.display = 'block'

        this.clockContainer.style.height = 'fit-content'
        this.statsContainer.style.height = 'fit-content'

        this.clockContainer.style.marginLeft = '2%'
        this.clockContainer.style.marginTop = '1%'
        this.statsContainer.style.height = 'fit-content'

        this.gameIntervalId = setInterval(() => {
            this.gameLoop()
        }, this.gameLoopFrequency)

    }

    gameLoop() {
        this.frames += 1

        if (this.frames % 120 === 0) {
            this.obstacles.push(new Obstacle(this.gameScreen))
        }

        this.update()

        if (this.lives <= 0) {
            console.log("Lives====>", this.lives);
            this.gameIsOver = true;
          }
        
        if (this.frames % 60 === 0) {
            this.timer --;
            this.clock.innerHTML = this.timer;
        }

        if (this.timer <= 0) {
            this.gameIsOver = true;
          }

        if (this.gameIsOver === true) {
            clearInterval(this.gameIntervalId)
            this.gameOverScreen();
        }
    }

    update() {
        this.player.move()



        this.obstacles.forEach((obstacle, i) => {
            obstacle.move()
            
            this.bulletsArr.forEach((bullet, j) => {
              bullet.top--
              if(bullet.top < -10){
                this.bulletsArr.splice(j, 1)
                bullet.element.remove
              }
              bullet.element.style.top = bullet.top + "px"
                if(this.player.didBulletHit(bullet, obstacle)){
                    this.bulletsArr.splice(j, 1)
                    this.obstacles.splice(i, 1)
                    obstacle.element.remove()
                    bullet.element.remove()
                    let alienKillSound = new Audio('./15alien-killed.mp3')
                    alienKillSound.play();
                    alienKillSound.volume = 0.1;
                    this.score += 100
                }

            })
            if (this.player.didCollide(obstacle)) {
                obstacle.createExplosion();
                obstacle.element.remove();
                this.obstacles.splice(i, 1);
                this.lives -= 1;
                let collideSound = new Audio('./14explosion-ship.mp3')
                collideSound.play();
                collideSound.volume = 0.1
              }

            if (obstacle.top > 1000) {
                obstacle.element.remove()
                this.obstacles.splice(i, 1)
                let lostLifeSound = new Audio('./16lostLife.mp3')
                lostLifeSound.play()
                lostLifeSound.volume = 0.1
                this.lives -= 1;
            }

        })

        this.scoreElement.innerHTML = this.score;
        this.livesElement.innerHTML = this.lives;

    }

    returnLivesMessage() {
        return this.lives
    }

    gameOverScreen() {
        console.log("Game over");
        audioGame.pause();
        audioGame.currentTime = 0;
        this.player.element.remove();

        this.obstacles.forEach((obstacle) => {
          obstacle.element.remove();
        });

        this.gameScreen.style.height = `${0}px`;
        this.gameScreen.style.width = `${0}px`;
        this.gameScreen.style.display = "none";
        console.log("Game end screen", this.stats);
        this.gameEndScreen.style.display = "block";
        // this.gameEndScreen.style.height = '98.5vh'
        if (this.timer <= 0) {
          this.endMessage.innerText = `You won! You finished with a Score of ${this.score} and ${this.returnLivesMessage()} Lives!`;
        } else {
          this.endMessage.innerText = `You lost!  You ran out of Lives and finished with a Score of ${this.score}.`;
        }
      }
}

