import { FileText, Loader2, Pause, Play, X } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useEffect, useRef, useState } from "react";

const GalaxyAttackGame = ({ onClose, isVisible, analysisState, analysisError }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'paused', 'gameOver'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isFiring, setIsFiring] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game objects
  const gameObjectsRef = useRef({
    player: { x: 400, y: 500, width: 40, height: 40, speed: 5 },
    bullets: [],
    enemies: [],
    particles: []
  });

  const lastEnemySpawn = useRef(0);
  const gameTime = useRef(0);

  // Initialize game
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to fit container properly
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = Math.min(600, window.innerHeight * 0.6);

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Update player position based on actual canvas size
    gameObjectsRef.current.player.x = containerWidth / 2 - 20;
    gameObjectsRef.current.player.y = containerHeight - 80;

    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'playing') {
          shootBullet();
        }
      }
      if (e.key === 'p' || e.key === 'P') {
        togglePause();
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    startGameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isVisible, gameState]);

  const handleJoystickMove = (dx: number, dy: number) => {
    const player = gameObjectsRef.current.player;
    const speed = player.speed * 1.2; // Player speed control ke liye
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate new position with reduced sensitivity
    const newX = player.x + dx * speed;
    const newY = player.y + dy * speed;

    // Apply boundaries
    player.x = Math.min(Math.max(newX, 0), canvas.width - player.width);
    player.y = Math.min(Math.max(newY, 0), canvas.height - player.height);
  };


  const shootBullet = useCallback(() => {
    const player = gameObjectsRef.current.player;
    const newBullet = {
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 8
    };
    gameObjectsRef.current.bullets.push(newBullet);
  }, []);

  const spawnEnemy = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameObjectsRef.current.enemies.push({
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: 1 + Math.random() * 2,
      type: Math.random() > 0.8 ? 'fast' : 'normal'
    });
  };

  const createExplosion = (x, y) => {
    for (let i = 0; i < 8; i++) {
      gameObjectsRef.current.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 30,
        maxLife: 30
      });
    }
  };

  const updateGame = () => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { player, bullets, enemies, particles } = gameObjectsRef.current;

    // Update player with canvas boundaries
    if (keysRef.current['ArrowLeft'] && player.x > 0) {
      player.x -= player.speed;
    }
    if (keysRef.current['ArrowRight'] && player.x < canvas.width - player.width) {
      player.x += player.speed;
    }
    if (keysRef.current['ArrowUp'] && player.y > 0) {
      player.y -= player.speed;
    }
    if (keysRef.current['ArrowDown'] && player.y < canvas.height - player.height) {
      player.y += player.speed;
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= bullets[i].speed;
      if (bullets[i].y < -bullets[i].height) {
        bullets.splice(i, 1);
      }
    }

    // Spawn enemies
    gameTime.current++;
    if (gameTime.current - lastEnemySpawn.current > 60 - Math.min(score / 100, 50)) {
      spawnEnemy();
      lastEnemySpawn.current = gameTime.current;
    }

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].y += enemies[i].speed;
      if (enemies[i].y > canvas.height) {
        enemies.splice(i, 1);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      if (particle.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Collision detection
    for (let i = bullets.length - 1; i >= 0; i--) {
      for (let j = enemies.length - 1; j >= 0; j--) {
        const bullet = bullets[i];
        const enemy = enemies[j];
        if (bullet && enemy &&
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y) {

          createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
          bullets.splice(i, 1);
          enemies.splice(j, 1);
          const points = enemy.type === 'fast' ? 200 : 100;
          setScore(prevScore => {
            const newScore = prevScore + points;
            if (newScore > highScore) {
              setHighScore(newScore);
            }
            return newScore;
          });
          break;
        }
      }
    }

    // Check player collision with enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y) {

        createExplosion(player.x + player.width / 2, player.y + player.height / 2);
        setGameState('gameOver');
        return;
      }
    }
  };

  // Drawing functions for ships
const drawPlayerShip = (ctx, x, y, width, height) => {
  const centerX = x + width / 2;

  // === Main body (layered armor) ===
  ctx.fillStyle = "#1976d2"; // deep blue
  ctx.beginPath();
  ctx.moveTo(centerX, y); // nose tip
  ctx.lineTo(x + width * 0.9, y + height * 0.4);
  ctx.lineTo(x + width * 0.7, y + height);
  ctx.lineTo(x + width * 0.3, y + height);
  ctx.lineTo(x + width * 0.1, y + height * 0.4);
  ctx.closePath();
  ctx.fill();

  // Dark outline
  ctx.strokeStyle = "#0a1a2f";
  ctx.lineWidth = 2;
  ctx.stroke();

  // === Cockpit ===
  ctx.fillStyle = "#0d47a1"; // dark navy
  ctx.beginPath();
  ctx.ellipse(centerX, y + height * 0.35, width * 0.18, height * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = "#64b5f6";
  ctx.beginPath();
  ctx.ellipse(centerX - width * 0.06, y + height * 0.3, width * 0.1, height * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  // === Side engines (inner) ===
  ctx.fillStyle = "#37474f";
  ctx.fillRect(x + width * 0.15, y + height * 0.55, width * 0.12, height * 0.28);
  ctx.fillRect(x + width * 0.73, y + height * 0.55, width * 0.12, height * 0.28);

  // === Extra outer cannons/pods ===
  ctx.fillStyle = "#455a64";
  ctx.fillRect(x + width * 0.02, y + height * 0.45, width * 0.12, height * 0.25);
  ctx.fillRect(x + width * 0.86, y + height * 0.45, width * 0.12, height * 0.25);

  // === Engine flames (left + right) ===
  const drawFlame = (fx, fy) => {
    // Outer flame
    ctx.fillStyle = "#ff6b35";
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx - width * 0.05, fy + height * 0.35);
    ctx.lineTo(fx + width * 0.05, fy + height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Inner flame
    ctx.fillStyle = "#ffd23f";
    ctx.beginPath();
    ctx.moveTo(fx, fy + height * 0.05);
    ctx.lineTo(fx - width * 0.03, fy + height * 0.25);
    ctx.lineTo(fx + width * 0.03, fy + height * 0.25);
    ctx.closePath();
    ctx.fill();
  };

  drawFlame(x + width * 0.22, y + height * 0.82);
  drawFlame(x + width * 0.78, y + height * 0.82);
};


  const drawEnemyShip = (ctx, x, y, width, height, isRed = false) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // Main body
    ctx.fillStyle = isRed ? '#dc2626' : '#1e90ff';
    ctx.beginPath();
    ctx.moveTo(centerX, y + height); // Bottom point (nose down)
    ctx.lineTo(x + width * 0.2, y + height * 0.6);
    ctx.lineTo(x + width * 0.4, y);
    ctx.lineTo(x + width * 0.6, y);
    ctx.lineTo(x + width * 0.8, y + height * 0.6);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#1a365d';
    ctx.beginPath();
    ctx.ellipse(centerX, y + height * 0.4, width * 0.12, height * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cockpit highlight
    ctx.fillStyle = '#63b3ed';
    ctx.beginPath();
    ctx.ellipse(centerX - width * 0.04, y + height * 0.35, width * 0.06, height * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Side engines
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(x + width * 0.15, y + height * 0.1, width * 0.12, height * 0.25);
    ctx.fillRect(x + width * 0.73, y + height * 0.1, width * 0.12, height * 0.25);

    // Engine flames (pointing up since ship is inverted)
    ctx.fillStyle = '#ff6b35';
    ctx.beginPath();
    ctx.moveTo(x + width * 0.21, y + height * 0.1);
    ctx.lineTo(x + width * 0.16, y - height * 0.2);
    ctx.lineTo(x + width * 0.26, y - height * 0.2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + width * 0.79, y + height * 0.1);
    ctx.lineTo(x + width * 0.74, y - height * 0.2);
    ctx.lineTo(x + width * 0.84, y - height * 0.2);
    ctx.closePath();
    ctx.fill();

    // Inner flame
    ctx.fillStyle = '#ffd23f';
    ctx.beginPath();
    ctx.moveTo(x + width * 0.21, y + height * 0.15);
    ctx.lineTo(x + width * 0.19, y - height * 0.1);
    ctx.lineTo(x + width * 0.23, y - height * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + width * 0.79, y + height * 0.15);
    ctx.lineTo(x + width * 0.77, y - height * 0.1);
    ctx.lineTo(x + width * 0.81, y - height * 0.1);
    ctx.closePath();
    ctx.fill();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas with starfield effect
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 123) % canvas.width;
      const y = (i * 456 + gameTime.current) % canvas.height;
      ctx.fillRect(x, y, 1, 1);
    }

    const { player, bullets, enemies, particles } = gameObjectsRef.current;

    // Draw player ship
    drawPlayerShip(ctx, player.x, player.y, player.width, player.height);

    // Draw bullets
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 5;
    bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    ctx.shadowBlur = 0;

    // Draw enemies
    enemies.forEach(enemy => {
      drawEnemyShip(ctx, enemy.x, enemy.y, enemy.width, enemy.height, enemy.type === 'fast');
    });

    // Draw particles
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    });

    // Draw game over screen
    if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff0000';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      if (!isMobile) {
        ctx.fillText(
          'Press R to restart',
          canvas.width / 2,
          canvas.height / 2 + 20
        );
      }
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 60);
    }

    // Draw pause screen
    if (gameState === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
      ctx.font = '24px Arial';
      ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 40);
    }
  };

  const startGameLoop = () => {
    const gameLoop = () => {
      updateGame();
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoop();
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  const restartGame = () => {
    setScore(0);
    setGameState('playing');
    gameTime.current = 0;
    lastEnemySpawn.current = 0;

    const canvas = canvasRef.current;
    const startX = canvas ? canvas.width / 2 - 20 : 400;
    const startY = canvas ? canvas.height - 80 : 500;

    gameObjectsRef.current = {
      player: { x: startX, y: startY, width: 40, height: 40, speed: 5 },
      bullets: [],
      enemies: [],
      particles: []
    };
  };

  // Handle restart key
  useEffect(() => {
    const handleRestart = (e) => {
      if (e.key === 'r' && gameState === 'gameOver') {
        restartGame();
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleRestart);
      return () => window.removeEventListener('keydown', handleRestart);
    }
  }, [gameState, isVisible]);

  useEffect(() => {
    let fireInterval: NodeJS.Timeout;
    if (isFiring) {
      fireInterval = setInterval(() => {
        if (gameState === "playing") shootBullet();
      }, 250); // auto-fire every 250ms
    }
    return () => clearInterval(fireInterval);
  }, [isFiring, gameState, shootBullet]);


  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-4xl max-h-[95vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-6">
            <div className="text-lg font-semibold">Score: {score}</div>
            <div className="text-lg font-semibold text-yellow-600">High Score: {highScore}</div>
          </div>
          <div className="flex gap-2">
            {analysisState === 'analyzing' && (
              <Button onClick={togglePause} variant="outline" size="sm">
                {gameState === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            )}
            {analysisState === 'analyzing' && (
              <Button onClick={onClose} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Analysis Status Bar */}
        <div className="mb-4 p-3 rounded-lg text-center">
          {analysisState === 'analyzing' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-2 text-blue-800 dark:text-blue-200">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-medium">Resume is being analyzed...</span>
              </div>
            </div>
          )}
          {analysisState === 'completed' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="text-green-800 dark:text-green-200">
                <div className="font-medium">✅ Analysis Complete!</div>
                <div className="text-sm mt-1">Your resume analysis is ready to view</div>
                <div className="mt-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                    className="bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Analysis Results
                  </Button>
                </div>
              </div>
            </div>
          )}
          {analysisState === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mt-1">
              <div className="text-red-800 dark:text-red-200">
                <div className="font-medium mt-1">❌ Analysis Failed</div>
                <div className="my-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                    className="bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Analysis Results
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative w-full" style={{ touchAction: 'none' }}>
          <canvas
            ref={canvasRef}
            className="border border-gray-300 dark:border-gray-600 w-full h-auto bg-black"
            style={{ touchAction: 'none' }}
            onTouchMove={(e) => e.preventDefault()}
          />
          {isMobile && (
            <div className="absolute inset-0 flex justify-between items-end p-4 pointer-events-none">
              {/* Joystick */}
              <div className="pointer-events-auto">
                <div
                  className="size-32 bg-gray-700/50 rounded-full relative flex items-center justify-center touch-none"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const rect = e.currentTarget.getBoundingClientRect();
                    setJoystickPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const rect = e.currentTarget.getBoundingClientRect();
                    const currentX = touch.clientX - rect.left;
                    const currentY = touch.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    // Calculate distance from center
                    const dx = (currentX - centerX) / (rect.width / 2);
                    const dy = (currentY - centerY) / (rect.height / 2);

                    // Apply deadzone and limit maximum movement
                    const deadzone = 0.2;
                    const maxSpeed = 1.0;
                    const magnitude = Math.sqrt(dx * dx + dy * dy);

                    if (magnitude > deadzone) {
                      const normalizedDx = dx / magnitude;
                      const normalizedDy = dy / magnitude;
                      const speed = Math.min(magnitude, maxSpeed);
                      handleJoystickMove(normalizedDx * speed, normalizedDy * speed);
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setJoystickPos({ x: 0, y: 0 });
                  }}
                >
                  <div className="w-12 h-12 bg-gray-500 rounded-full shadow-lg"></div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="pointer-events-auto">
                {gameState === 'gameOver' ? (
                  <button
                    className="w-20 h-20 rounded-full bg-green-600 text-white font-bold text-sm shadow-lg active:scale-95 flex items-center justify-center"
                    onClick={restartGame}
                  >
                    RESTART
                  </button>
                ) : (
                  <button
                    className="w-20 h-20 rounded-full bg-red-600 text-white font-bold text-lg shadow-lg active:scale-95 touch-none"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setIsFiring(true);
                      shootBullet(); // Immediate first shot
                    }}
                    onPointerUp={(e) => {
                      e.preventDefault();
                      setIsFiring(false);
                    }}
                    onPointerLeave={(e) => {
                      e.preventDefault();
                      setIsFiring(false);
                    }}
                  >
                    FIRE
                  </button>
                )}
              </div>
            </div>
          )}


          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
            {isMobile ?
              'Use virtual joystick to move, tap FIRE button to shoot' :
              'Use arrow keys to move, SPACE to shoot, P to pause'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalaxyAttackGame;