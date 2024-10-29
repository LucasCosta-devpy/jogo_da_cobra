const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const changePhaseButton = document.getElementById('changePhaseButton');
const startButton = document.getElementById('startButton');
const phaseSelect = document.getElementById('phaseSelect');
const audio = document.getElementById('gameAudio');

// Variáveis globais
let box = 20;
let snake;
let direction;
let food;
let score;
let game;
let phase; // 1: Clássico, 2: Reaparecer no lado oposto

// Função para iniciar o jogo
function startGame() {
  canvas.style.display = 'block'; // Mostrar o canvas
  snake = [{ x: box * 10, y: box * 10 }];
  direction = 'RIGHT';
  food = generateFood();
  score = 0;
  restartButton.style.display = 'none'; // Esconder o botão de reinício
  changePhaseButton.style.display = 'inline-block'; // Mostrar botão de mudança de fase
  phase = parseInt(phaseSelect.value); // Obter a fase selecionada
  game = setInterval(update, 100);
  
  audio.play(); // Começa a tocar a música
}

// Função para gerar comida em uma posição válida
function generateFood() {
  let newFood;
  let isOnSnake;
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  } while (isOnSnake); // Gera nova comida se estiver na mesma posição da cobra
  return newFood;
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

  // Lógica de reaparição na fase 2
  if (phase === 2) {
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY >= canvas.height) snakeY = 0;
  }

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = generateFood(); // Gere nova comida em uma posição válida
  } else {
    snake.pop();
  }

  // Condição de Game Over
  if (
    (phase === 1 && (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(snakeX, snakeY, snake))) ||
    (phase === 2 && collision(snakeX, snakeY, snake) && (snakeX >= 0 && snakeY >= 0 && snakeX < canvas.width && snakeY < canvas.height))
  ) {
    clearInterval(game);
    audio.pause(); // Pausar a música
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

// Lidar com o clique do botão de iniciar
startButton.addEventListener('click', startGame);

// Lidar com o clique do botão de reinício
restartButton.addEventListener('click', () => {
  audio.currentTime = 0; // Reinicia a música
  audio.play(); // Toca a música
  startGame();
});

// Lidar com a mudança de fase
changePhaseButton.addEventListener('click', () => {
  phase = phase === 1 ? 2 : 1; // Alterna entre fase 1 e 2
  alert(`Mudou para a Fase ${phase}`);
  startGame(); // Reinicia o jogo ao mudar de fase
});
