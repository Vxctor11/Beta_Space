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
        this.lives = 3
        this.timer = 60
        this.gameIsOver = false
        this.gameIntervalId = null
        this.gameLoopFrequency = 1000/60
        this.frames = 0
        this.scoreElement = document.getElementById("score");
        this.livesElement = document.getElementById("lives");
        this.stats = document.getElementById("stats-container");
        this.clockContainer = document.getElementById("clock-container");
        this.clock = document.getElementById("clock");
        this.endMessage = document.getElementById("end-message");

        
        document.addEventListener("keydown",(e) => {
            if(e.key === " "){
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

        this.gameScreen.style.display = 'block'

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
                    this.score++
                }

            })
            if (this.player.didCollide(obstacle)) {
                obstacle.createExplosion();
                obstacle.element.remove();
                this.obstacles.splice(i, 1);
                this.lives -= 1;
              }

            if (obstacle.top > 2000) {
                obstacle.element.remove()
                this.obstacles.splice(i, 1)
                this.score++
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
        this.player.element.remove();

        this.obstacles.forEach((obstacle) => {
          obstacle.element.remove();
        });

        this.gameScreen.style.height = `${0}px`;
        this.gameScreen.style.width = `${0}px`;
        this.gameScreen.style.display = "none";
        console.log("Game end screen", this.stats);
        // this.stats.style.display = "none";
        // this.clockContainer.style.display = "none";
        this.gameEndScreen.style.display = "inherit";
        if (this.timer <= 0) {
          this.endMessage.innerText = `You won! You finished with a score of ${this.score} and ${this.returnLivesMessage()}!`;
        } else {
          this.endMessage.innerText = `You lost!  You ran out of lives and finished with a score of ${this.score}.`;
        }
      }
}