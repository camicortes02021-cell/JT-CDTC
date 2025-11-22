document.addEventListener('DOMContentLoaded', () => {
    let nicknameJugador = "";

    const pixelBot = document.getElementById("pixel-bot");
    const juegoContenedor = document.getElementById("juego-contenedor");
    const mensajeJuego = document.getElementById("mensaje-juego");
    const puntuacionDisplay = document.getElementById("puntuacion");
    const suelo = document.getElementById("suelo");

    const btnIniciar = document.getElementById("btn-iniciar");
    const nicknameInput = document.getElementById("nickname");

    //  NUEVO
    const nombreMostrado = document.getElementById("jugador-nombre");
    const mensajeFinal = document.getElementById("mensaje-final");

    let nickname = "";
    let isJumping = false;
    let botBottom = 30;
    let score = 0;
    let gameOver = true;
    let obstacleInterval;

    //  INICIO DEL JUEGO CON BOTÓN
    btnIniciar.addEventListener("click", () => {
        nickname = nicknameInput.value.trim();
        if (nickname === "") {
            alert("Por favor escribe un nickname");
            return;
        }

        mensajeJuego.style.display = "none";

        //  Mostrar nombre durante el juego
        nombreMostrado.textContent = "Jugador: " + nickname;
        nombreMostrado.style.display = "block";

        iniciarJuego();
    });

    //  SALTO CON ESPACIO
    document.addEventListener("keydown", (e) => {
        if (gameOver) return;
        if (e.code === "Space") jump();
    });

    function jump() {
        if (isJumping) return;
        isJumping = true;

        let jumpHeight = 150;
        let jumpSpeed = 10;
        let currentJumpHeight = 0;

        const up = setInterval(() => {
            if (currentJumpHeight >= jumpHeight) {
                clearInterval(up);

                const down = setInterval(() => {
                    if (botBottom <= 30) {
                        clearInterval(down);
                        botBottom = 30;
                        isJumping = false;
                    }
                    botBottom -= jumpSpeed;
                    pixelBot.style.bottom = botBottom + "px";
                }, 20);
            }

            botBottom += jumpSpeed;
            currentJumpHeight += jumpSpeed;
            pixelBot.style.bottom = botBottom + "px";
        }, 20);
    }

    // GENERAR OBSTÁCULOS
    function generarObstaculo() {
        if (gameOver) return;

        let obstaclePosition = 900;
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstaculo");
        juegoContenedor.appendChild(obstacle);

        const mover = setInterval(() => {
            if (obstaclePosition < -30) {
                clearInterval(mover);
                obstacle.remove();

                score++;
                actualizarPuntaje();
            }

            //  COLISIÓN
            if (obstaclePosition > 50 && obstaclePosition < 100 && botBottom < 80) {
                clearInterval(mover);
                clearInterval(obstacleInterval);
                gameOver = true;

                nombreMostrado.style.display = "none";

                //  MENSAJE FINAL CON NOMBRE
                mensajeFinal.innerHTML = `
                    <p> GAME OVER </p>
                    <p>${nickname}, tu puntuación final fue:</p>
                    <h2>${score}</h2>
                `;
                mensajeFinal.style.display = "block";

                suelo.style.animationPlayState = "pause";
            }

            obstaclePosition -= 10;
            obstacle.style.left = obstaclePosition + "px";
        }, 20);
    }

    //  CAMBIAR FONDO Y NIVEL
    function actualizarPuntaje() {
        let nivel = Math.floor(score / 5) + 5;
        if (nivel > 5) nivel = 5;

        puntuacionDisplay.textContent = `Puntuación: ${score} | Nivel: ${nivel}`;

        juegoContenedor.className = "";
        juegoContenedor.classList.add("fondo" + nivel);
    }

    //  INICIAR JUEGO
    function iniciarJuego() {
        document.querySelectorAll(".obstaculo").forEach(o => o.remove());

        score = 0;
        botBottom = 30;
        gameOver = false;

        pixelBot.style.bottom = "30px";
        suelo.style.animationPlayState = "running";

        mensajeFinal.style.display = "none";

        obstacleInterval = setInterval(generarObstaculo, 2000);

        actualizarPuntaje();
    }

});
