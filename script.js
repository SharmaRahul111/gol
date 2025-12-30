// Author: Pramendra Sharma
//
// Notes for the readers:
// 1. I bellieve the x,y is actually y,x due to rows, cols order
// 2. The neighbour count function is very bad, needs an update I know

let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// Game control variables
let ON = false

class Cell {
  constructor(x, y, data) {
    this.x = x
    this.y = y
    this.alive = false
    this.data = data

  }
  get count() {
    // let edgeCount = this.data[this.x][this.y - 1].alive + this.data[this.x][this.y + 1].alive +
    //   this.data[this.x - 1][this.y].alive + this.data[this.x + 1][this.y].alive
    // let cornerCount = this.data[this.x - 1][this.y - 1].alive + this.data[this.x - 1][this.y + 1].alive +
    //   this.data[this.x + 1][this.y - 1] + this.data[this.x + 1][this.y + 1].alive
    // return edgeCount + cornerCount

    let x = this.x
    let y = this.y

    let h = this.data.length
    let w = this.data[0].length
    // console.log(x, y, h, w)
    let count = 0
    if (x > 0 && this.data[x - 1][y].alive) count++
    if (y > 0 && this.data[x][y - 1].alive) count++
    if (x < h - 1 && this.data[x + 1][y].alive) count++
    if (y < w - 1 && this.data[x][y + 1].alive) count++
    if (x > 0 && y > 0 && this.data[x - 1][y - 1].alive) count++
    if (x < h - 1 && y < w - 1 && this.data[x + 1][y + 1].alive) count++
    if (x > 0 && y < w - 1 && this.data[x - 1][y + 1].alive) count++
    if (x < h - 1 && y > 0 && this.data[x + 1][y - 1].alive) count++
    return count
  }

}

class Grid {
  //size is in pixels
  constructor(rows, cols, size) {
    this.data = []
    this.rows = rows
    this.cols = cols
    this.size = size
    // updateList is needed because altering alive status mid loop, alters the game of life rules
    this.updateList = []

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.data[i].push(new Cell(i, j, this.data))
      }
    }
  }
  updateCheck() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        // Rules for Conway's game of life
        // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        // Any live cell with two or three live neighbours lives on to the next generation.
        // Any live cell with more than three live neighbours dies, as if by overpopulation.
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        let cell = this.data[i][j]
        if (cell.alive && (cell.count < 2 || cell.count > 3)) {
          this.updateList.push(cell)
          // console.log(cell.x, cell.y, cell.count)
        }
        else if (!cell.alive && (cell.count == 3)) this.updateList.push(cell)
      }
    }

  }

  update() {
    this.updateList.forEach(cell => cell.alive = !cell.alive)
    this.updateList = []
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
        // c.font = "9px Arial"
        // c.fillStyle = "red"
        // c.fillText(`${cell.x},${cell.y}`, cell.x * this.size, cell.y * this.size + this.size / 2)
      }
    }

  }
}

let size = 30
let cols = Math.floor(innerHeight / size)
let rows = Math.floor(innerWidth / size)
let grid = new Grid(rows, cols, size)

function animate() {
  c.fillStyle = "rgba(0,0,0,1)"
  c.fillRect(0, 0, innerWidth, innerHeight)

  grid.draw(c)
  grid.updateCheck()
  grid.update()


  // if (ON) requestAnimationFrame(animate)
  requestAnimationFrame(animate)
}
animate()

addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// helper functions
function start() {
  animate()
  ON = true
}
function stop() {
  ON = false
}
function alive(x, y) {
  grid.data[x][y].alive = true
}
function randInt(x) {
  return Math.floor(Math.random() * x)
}
function randomAlive() {
  alive(randInt(grid.rows), randInt(grid.cols))
}
function update() {
  grid.updateCheck()
  grid.update()
}

// patterns
function pattern(x, y, style) {
  let patterns = {
    // Oscillators
    blinker: [
      [x, y - 1],
      [x, y],
      [x, y + 1]
    ],

    toad: [
      [x - 1, y],
      [x, y],
      [x + 1, y],
      [x, y + 1],
      [x + 1, y + 1],
      [x + 2, y + 1]
    ],

    beacon: [
      [x, y],
      [x + 1, y],
      [x, y + 1],
      [x + 1, y + 1],
      [x + 2, y + 2],
      [x + 3, y + 2],
      [x + 2, y + 3],
      [x + 3, y + 3]
    ],

    // Still lifes
    block: [
      [x, y],
      [x + 1, y],
      [x, y + 1],
      [x + 1, y + 1]
    ],

    beehive: [
      [x + 1, y],
      [x + 2, y],
      [x, y + 1],
      [x + 3, y + 1],
      [x + 1, y + 2],
      [x + 2, y + 2]
    ],

    // Spaceships
    glider: [
      [x + 1, y],
      [x + 2, y + 1],
      [x, y + 2],
      [x + 1, y + 2],
      [x + 2, y + 2]
    ],

    lwss: [ // Lightweight spaceship
      [x + 1, y],
      [x + 2, y],
      [x + 3, y],
      [x + 4, y],
      [x, y + 1],
      [x + 4, y + 1],
      [x + 4, y + 2],
      [x, y + 3],
      [x + 3, y + 3]
    ]
  };

  // return patterns[style]
  let p = patterns[style]
  // console.log(p)
  p.forEach(coord => {
    // console.log(coord)
    grid.data[coord[0]][coord[1]].alive = true
  })
}

function getAlive() {
  let cells = []
  grid.data.forEach(row => {
    row.forEach(col => {
      if (col.alive) cells.push(col)
    })
  })
  return cells
}
