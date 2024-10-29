const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

// Variáveis globais
let box = 20;
let snake;
let direction;
let food;
let score;
let game;

// Função para iniciar o jogo
function startGame() {
  snake = [{ x: box * 10, y: box * 10 }];
  direction = 'RIGHT';
  food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
  score = 0;
  restartButton.style.display = 'none'; // Esconder o botão de reinício
  game = setInterval(update, 100);
}

// Função para desenhar a cobra
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
}

// Função para desenhar a comida
function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);
}

// Função para atualizar o jogo
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'LEFT') snakeX -= box;
  if (direction === 'UP') snakeY -= box;
  if (direction === 'RIGHT') snakeX += box;
  if (direction === 'DOWN') snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
  } else {
    snake.pop();
  }

  if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(snakeX, snakeY, snake)) {
    clearInterval(game);
    restartButton.style.display = 'block'; // Mostrar o botão de reinício
    alert('Game Over! Sua pontuação: ' + score);
  }

  const newHead = { x: snakeX, y: snakeY };
  snake.unshift(newHead);
}

// Função para verificar colisão
function collision(x, y, array) {
  for (let i = 1; i < array.length; i++) {
    if (array[i].x === x && array[i].y === y) {
      return true;
    }
  }
  return false;
}

// Função para controlar a direção da cobra
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

// Iniciar o jogo pela primeira vez
startGame();

// Lidar com o clique do botão de reinício
restartButton.addEventListener('click', startGame);
