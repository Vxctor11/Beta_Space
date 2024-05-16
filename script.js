let audioGame = new Audio('12game-song.mp3');

window.onload = function () {
     // Intro Song
     let audioIntro = new Audio('10intro-song.mp3');
     audioIntro.play();
     audioIntro.volume = 0.1;

    const insertCoinBtn =  document.getElementById('insert-coin')
    const restartButton = document.getElementById("restart-button");
  
    let game
  
    function startGame() {
         // Game Song
            audioIntro.pause();
            audioGame.volume = 0.1;
      
      game = new Game()
      game.start()
      
      console.log("start game");
      
      document.addEventListener('keydown', (e) => {
        
        if (e.key === "ArrowRight") {
          if (game.player.directionX < 4) {
            game.player.directionX += 1
          }
        }
        
        if (e.key === "ArrowLeft") {
          if (game.player.directionX > -4) {
            game.player.directionX -= 1
          }
        }
        
      })
      
    }
  
    function restartGame() {
  
      startGame()
      audioGame.play();
      game.gameEndScreen.style.display = 'none'
      game.gameEndScreen.style.padding = 0
      game.gameEndScreen.style.height = 0
  
    }

    insertCoinBtn.addEventListener('click', () => {
        let audioInsertCoin = new Audio('./11Arcade_INSERT_COIN.mp3')
        audioInsertCoin.play();
        audioInsertCoin.volume = 0.1;
        audioGame.play();
        startGame()
    })
  
    restartButton.addEventListener("click", () => {
      restartGame();
    });
  };