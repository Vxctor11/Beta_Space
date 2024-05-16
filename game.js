class Game {
    constructor(sizeOfTile, rows, columns) {
        //Board
        this.sizeOfTile = sizeOfTile;
        this.rows = rows;
        this.columns = columns;
        
        this.boardWidth = this.sizeOfTile * this.columns;
        this.boardHeight = this.sizeOfTile * this.rows;
        
        this.board = document.getElementById('board')
        this.board.width = this.boardWidth;
        this.board.height = this.boardHeight;
        document.body.appendChild(this.board); 
        
        this.context = this.board.getContext("2d");
        
        // Ship
        this.shipWidth = this.sizeOfTile * 2;
        this.shipHeight = this.sizeOfTile * 1.7;
        this.shipX = this.sizeOfTile * this.columns / 2 - this.sizeOfTile;
        this.shipY = this.sizeOfTile * this.rows - this.sizeOfTile * 2;
        
        this.ship = {
            x: this.shipX,
            y: this.shipY,
            width: this.shipWidth,
            height: this.shipHeight
        };
        
        this.shipImg;
        this.shipVelocityX = this.sizeOfTile;

        // Aliens
        this.alienArray = [];
        this.alienWidth = this.sizeOfTile * 2;
        this.alienHeight = this.sizeOfTile;
        this.alienX = this.sizeOfTile;
        this.alienY = this.sizeOfTile;
        this.alienImg;
        
        this.alien =  {
            x: this.alienX,
            y: this.alienY,
            width: this.alienWidth,
            height: this.alienHeight,
            alive : true
        }

        this.alienRows = 2;
        this.alienColumns = 3;
        this.alienCount = 5; // Number of aliens to defeat
        this.alienVelocityX = 1; // Alien moving speed
        
        // Bullets
        this.bulletArray = [];
        this.bulletVelocityY = -10; // Bullet moving speed

        this.bullet = {
            x: this.bulletX,
            y: this.bulletY,
            width: this.bulletWidth,
            height: this.bulletHeight,
            used : true
        }
        
        // Game state
        this.score = 0;
        this.gameOver = false;


        // Start Game
        this.gameScreen = document.getElementById("game-screen")
        
        this.update = this.update.bind(this);

        this.moveShip = this.moveShip.bind(this);
    }

    drawShip() {
        if (!this.shipImg) return;
        this.context.drawImage(this.shipImg, this.ship.x, this.ship.y, this.ship.width, this.ship.height);
    }

    drawAlien(){
        for(let i = 0; i < this.alienArray.length; i++){
            let alien = this.alienArray[i];
            if(alien.alive){
                this.context.drawImage(this.alienImg, this.alien.x, this.alien.y, this.alien.width, this.alien.height);
            }
        }

    }

    update() {
        requestAnimationFrame(this.update);

        this.context.clearRect(0, 0, this.board.width, this.board.height)

        // Ship
        this.context.drawImage(this.shipImg, this.ship.x, this.ship.y, this.ship.width, this.ship.height);

        //this.context.drawImage(this.alienImg, this.alien.x, this.alien.y, this.alien.width, this.alien.height);

        // Alien
        for (let i = 0; i < this.alienArray.length; i++) {
            let alien = this.alienArray[i];
            if (alien.alive) {
                this.alien = this.alienArray[i];
                this.alien.x += this.alienVelocityX;
    
                //if alien touches the borders
                if (this.alien.x + this.alien.width >= this.board.width || this.alien.x <= 0) {
                    this.alienVelocityX *= -1;
                    this.alien.x += this.alienVelocityX*2;
    
                    //move all aliens up by one row
                    for (let j = 0; j < this.alienArray.length; j++) {
                        this.alienArray[j].y += this.alienHeight;
                    }
                }
                this.context.drawImage(this.alienImg, this.alien.x, this.alien.y, this.alien.width, this.alien.height);
    
                if (this.alien.y >= this.ship.y) {
                    this.gameOver = true;
                }
            }
        }

        //bullets
        for (let i = 0; i < this.bulletArray.length; i++) {
            this.bullet = this.bulletArray[i];
            this.bullet.y += this.bulletVelocityY; 
            this.context.fillStyle="white"; 
            this.context.fillRect(this.bullet.x, this.bullet.y, this.bullet.width, this.bullet.height); // Dibuja la bala

        }

        //bullet collision with aliens
        for (let j = 0; j < this.alienArray.length; j++) {
            this.alien = this.alienArray[j];
            if (!this.bullet.used && this.alien.alive && this.detectCollision(this.bullet, this.alien)) {
                this.bullet.used = true;
                this.alien.alive = false;
                this.alienCount--;
                this.score += 100;   
            }
        }

        //clear bullets
        while (this.bulletArray.length > 0 && (this.bulletArray[0].used || this.bulletArray[0].y < 0)) {
        this.bulletArray.shift(); //removes the first element of the array
        }
    }

    //Ship Movement
    moveShip(e){
        if (this.gameOver) {
            return;
        }
    
        if (e.code == "ArrowLeft" && this.ship.x - this.shipVelocityX >= 0) {
            this.ship.x -= this.shipVelocityX; //move left one tile
        }
        else if (e.code == "ArrowRight" && this.ship.x + this.shipVelocityX + this.ship.width <= this.board.width) {
            this.ship.x += this.shipVelocityX; //move right one tile
        }
    }

    //Create Aliens
    createAlian(){
        for(let c = 0; c < this.alienColumns; c++){
            for(let r = 0; r < this.alienRows; r++){
                let alien = {
                    img : this.alienImg,
                    x : this.alienX,
                    y : this.alienY,
                    width : this.alienWidth,
                    height : this.alienHeight,
                    alive : true
                }
                this.alienArray.push(alien)
            }

        }
        this.alienCount = this.alienArray.length
    }

    // Create Bullets
    shoot(e){
        if(e.code == "Space"){
            let bullet = {
                x : this.ship.x + this.shipWidth * 15 / 32,
                y : this.ship.y,
                width : this.sizeOfTile / 8,
                height : this.sizeOfTile / 2,
                used : false
            }
            this.bulletArray.push(bullet);
        }   
    }

    // Bullets Collision
    detectCollision(a, b) {
        return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
               a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
               a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
               a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
    }
}
 
class gameOn{
    constructor(){
        this.startScreen = document.getElementById('game-intro')

        this.gameContainer = document.getElementById('game-container')

        this.gameScreen = document.getElementById('game-screen')

        this.height = 10
        this.width = 20
    }

    start(){
        // Remove Main Screen
        this.startScreen.style.display = 'none'
        this.startScreen.style.padding = 0
        this.startScreen.style.height = 0  

        
        
        // Display Game Screen
        this.gameScreen.style.display = 'block'

        // Display Game Statas
        this.gameContainer.style.height = `${this.height}vh`
        this.gameContainer.style.width = `${this.width}vw`
        this.gameContainer.style.display = 'block'
    }
}

    const insertCoinBtn =  document.getElementById('insert-coin')

    window.onload = () => {
        // Intro Song
        let audioIntro = new Audio('9intro-song.mp3');
        audioIntro.play();
        audioIntro.volume = 0.1;
        

        function startGame(){
            // Game Song
            audioIntro.pause();
            let audioGame = new Audio('10game-song.mp3');
            audioGame.play();
            audioGame.volume = 0.1;

           
           // Create the Board on Game Screen
            const game = new Game(32, 20, 20);

            gameOnScreen = new gameOn();
            gameOnScreen.start();

            // Create Ship On Board
            game.shipImg = new Image();
            game.shipImg.src = "5ship.png";
            game.shipImg.onload = () => {
                // Display Ship on Board
                game.drawShip();
                game.update();
                
            };

            // Create Aliens On Board
            game.alienImg = new Image();
            game.alienImg.src = "6alien.png";
            game.alienImg.onload = () =>{
                game.createAlian();
                game.drawAlien();

            }


            // Ship Movement Event
            document.addEventListener("keydown", function(e){
                game.moveShip(e);
            })

            // Bullet Event
            document.addEventListener("keyup", function(e){
                game.shoot(e)
            })
        }

            // Insert Coin Btn Event
            insertCoinBtn.addEventListener('click', () => {
            let audioInsertCoin = new Audio('8Arcade_INSERT_COIN.mp3')
            audioInsertCoin.play();
            audioInsertCoin.volume = 0.1;
            console.log('Insert Coin Button Clicked');
            startGame();
           
        });
    };