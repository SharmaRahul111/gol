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
let GRID = true
let DEBUG = true

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


canvas.addEventListener('click', e => {
  // console.log(e)
  let box = canvas.getBoundingClientRect()
  let x = Math.floor((e.clientX - box.top) / size)
  let y = Math.floor((e.clientY - box.left) / size)
  grid.data[x][y].alive = !grid.data[x][y].alive
  // console.log(x, y)
})
