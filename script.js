let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

class Cell {
  constructor(x, y, data) {
    this.x = x
    this.y = y
    this.alive = false
    this.data = data

  }
  get count() {
    let edgeCount = this.data[i][j - 1].alive + this.data[i][j + 1].alive + this.data[i - 1][j].alive + this.data[i + 1][j].alive
    let cornerCount = this.data[i - 1][j - 1].alive + this.data[i - 1][j + 1].alive + this.data[i + 1][j - 1] + this.data[i + 1][j + 1].alive
    return edgeCount + cornerCount
  }

}

class Grid {
  //size is in pixels
  constructor(rows, cols, size) {
    this.data = []
    this.rows = rows
    this.cols = cols
    this.size = size

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.data[i].push(new Cell(i, j, this.data))
      }
    }
  }

  draw(c) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let cell = this.data[i][j]

        c.beginPath()
        c.fillStyle = cell.alive ? "white" : "black"
        c.fillRect(cell.x * this.size, cell.y * this.size, this.size, this.size)
        c.lineWidth = 1
        c.strokeStyle = "white"
        c.strokeRect(cell.x * this.size, cell.y * this.size, this.size, this.size)
      }
    }

  }
}

let size = 25
let cols = Math.floor(innerHeight / size)
let rows = Math.floor(innerWidth / size)
let grid = new Grid(rows, cols, size)

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,1)"
  c.fillRect(0, 0, innerWidth, innerHeight);
  // console.log(5)
  randomAlive()
  grid.draw(c)


}
animate();

addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// helper functions
function alive(x, y) {
  grid.data[x][y].alive = true
}
function randInt(x) {
  return Math.floor(Math.random() * x)
}
function randomAlive() {
  alive(randInt(grid.rows), randInt(grid.cols))
}
