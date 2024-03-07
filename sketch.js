let grid, rows, columns;
let cellSpacingX = 15, cellSpacingY = 15, mulX = 102, mulY = 49;
let mouseIsPressed = false;
let HUEValue = 200, sandColorChangeRate = 20;
let dropAreaX = 1, dropAreaY = 1;
let colorsOfSand = [
  [246, 215, 176],
  [242, 210, 169],
  [236, 204, 162],
  [231, 196, 150],
  [225, 191, 146],
  [194, 178, 128],
  [225, 170, 114],
  [219, 154, 89],
  [255, 226, 156],
  [234, 191, 125]
];

function setup()
{
  createCanvas(cellSpacingX * mulX, cellSpacingY * mulY);
  //colorMode(HSB, 360, 255, 255);
  columns = floor(width / cellSpacingX);
  rows = floor(height / cellSpacingY);
  grid = make2DArray(width, height);
}

function draw()
{
  background(0);

  for ( let i = 0; i < columns; i ++ )
  {
    for ( let j = 0; j < rows; j ++ )
    {
      noStroke();
      if ( grid[j][i] > 0 )
      {
        //fill(grid[j][i], 255, 255);
        fill(colorsOfSand[grid[j][i]][0], colorsOfSand[grid[j][i]][1], colorsOfSand[grid[j][i]][2]);
        rect(i * cellSpacingX, j * cellSpacingY, cellSpacingX, cellSpacingY);
      }
    }
  }

  if ( mouseIsPressed )
  {
    let [origoY, origoX] = [floor(mouseY / cellSpacingY), floor(mouseX / cellSpacingX)];

    for ( let x = origoX - dropAreaX; x <= origoX + dropAreaX; x ++ )
    {
      for ( let y = origoY - dropAreaY; y <= origoY + dropAreaY; y ++ )
      {
        if ( random(0, 1) > 0.80 && isValidPosition(x, y) && grid[y][x] == 0 )
        {
          grid[y][x] = floor(random(colorsOfSand.length)); //HUEValue
        }
      }
    }
  }

  moveSand();
}

function keyPressed()
{
  if ( keyCode === 32 )
  {
    let [y, x] = [floor(mouseY / cellSpacingY), floor(mouseX / cellSpacingX)];
    if ( isValidPosition(x, y) && grid[y][x] == 0 )
    {
      HUEValue = ( HUEValue + sandColorChangeRate ) % 359;
      grid[y][x] = floor(random(colorsOfSand.length)); //HUEValue
    }
  }
}

function mousePressed()
{
  mouseIsPressed = true;
}

function mouseReleased()
{
  mouseIsPressed = false;
  HUEValue = ( HUEValue + sandColorChangeRate ) % 359;
}

function isValidPosition(x, y)
{
  return x >= 0 && x < columns && y >= 0 && y < rows;
}

function moveSand()
{
  let movedSand = new Set();

  for ( let i = 0; i < columns; i ++ )
  {
    for ( let j = rows - 2; j >= 0; j -- )
    {
      if ( grid[j][i] > 0 )
      {
        if ( grid[j + 1][i] == 0 )
        {
          grid[j + 1][i] = grid[j][i];
          grid[j][i] = 0;
          movedSand.add(`${j + 1},${i}`);
        }
      }
    }
  }

  for ( let i = rows - 2; i >= 0; i -- )
  {
    for ( let j = 0; j < columns; j ++ )
    {
      if ( !movedSand.has(`${i},${j}`) && grid[i][j] > 0 )
      {
        if ( grid[i + 1][j] > 0 )
        {
          let dir = [];
          if ( j - 1 >= 0 && grid[i + 1][j - 1] == 0 ) dir.push([i + 1, j - 1]);
          if ( j + 1 < columns && grid[i + 1][j + 1] == 0 ) dir.push([i + 1, j + 1]);
          if ( dir.length > 0 )
          {
            let nextDir = dir[floor(random(0, dir.length))];
            grid[nextDir[0]][nextDir[1]] = grid[i][j];
            grid[i][j] = 0;
          }
        }
      }
    }
  }
}

function make2DArray(rows, columns)
{
  let arr = new Array(rows);

  for ( let i = 0; i < arr.length; i ++ )
  {
    arr[i] = new Array(columns).fill(0);
  }

  return arr;
}