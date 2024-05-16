window.onload = function () {
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
  
    let game
  
    function startGame() {
      
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
        
        if (e.key === "ArrowDown") {
          if (game.player.directionY < 4) {
            game.player.directionY += 1
          }
        }
        
        if (e.key === "ArrowUp") {
          if (game.player.directionY > -4) {
            game.player.directionY -= 1
          }
        }
        
      })
      
    }
  
    function restartGame() {
  
      startGame()
  
      game.gameEndScreen.style.display = 'none'
      game.gameEndScreen.style.padding = 0
      game.gameEndScreen.style.height = 0
  
    }
  
    startButton.addEventListener("click", () => {
      startGame();
    });
  
    restartButton.addEventListener("click", () => {
      restartGame();
    });
  };
  