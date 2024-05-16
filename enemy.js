class Obstacle {
    constructor(gameScreen) {
        this.gameScreen = gameScreen
        this.left = Math.random() * 1000
        this.top = -150
        this.width = 100
        this.height = 50
        this.element = document.createElement("img");
        this.element.src = './6alien.png';
        this.element.style.position = "absolute";
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.width = `${this.width}px`;
    
        this.gameScreen.appendChild(this.element);
    }

    move() {
        this.top += 3
        this.updatePostion()
    }

    updatePostion() {
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
    }

    createExplosion() {
        let newElement = document.createElement("img");
        newElement.src = "./explosion.gif";
        newElement.style.position = "absolute";
        newElement.style.left = `${this.left}px`;
        newElement.style.top = `${this.top}px`;
        newElement.style.width = `${this.width}px`;
        newElement.style.height = `${this.height}px`;
    
        this.gameScreen.appendChild(newElement);
    
        setTimeout(() => {
          newElement.remove();
        }, 1250);
      }
}