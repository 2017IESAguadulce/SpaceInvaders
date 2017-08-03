// Variable estado usada para cargar la pantalla de nivel superado
var levelUp = {
	/**
	 * Método usado para cargar el mensaje de juego ganado
	 * @method create
	 */
    create: function() {
		game.puntos = 2000;
		// Cargamos fondo y mostramos mensaje final agregando instrucciones para reiniciar el juego
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
        game.titulo = game.add.text(80, 80, 'Mejoras de Nave', { font: '54px Arial', fill: 'white' });
        game.puntosTexto = game.add.text(80, 200, 'Puntos: ' + game.puntos, {font: '34px Arial', fill: 'white' });
		game.escudosNave = game.add.text(80, 325, 'Escudos Nv. 1 (1000)', {font: '24px Arial', fill: 'white' });
		game.velocidadDisparo = game.add.text(80, 400, 'Disparo Nv. 1 (1000)', {font: '24px Arial', fill: 'white' });
		game.velocidadNave = game.add.text(80, 475, 'Velocidad Nv. 1 (1000)', {font: '24px Arial', fill: 'white' });
		// Agregamos botones y manejadores para controlar sus eventos
		game.btnContinuar = game.add.button(game.world.centerX + 100, 350, 'botonContinuar', this.manejadorClickBotonContinuar, this, 0, 1, 0);
		game.btnContinuar.onInputOver.add(this.manejadorOverBoton, this);
		game.btnVolver = game.add.button(game.world.centerX + 100, 450, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		// Iniciamos la carga de las estrellas en pantalla
		this.cargarEstrellas();
    },
    
	/**
	 * Método ejecutado cada frame para actualizar la lógica del juego
	 * @method update
	 */
    update: function() {
		// Actualizamos estrellas mostradas en interfaz
		this.actualizarEstrellas();
	},
	
	/**
	 * Función usada controlar el evento hover en todos los botones a nivel general
	 * @method manejadorOverBoton
	 */
	manejadorOverBoton: function() {
		game.sfxHover.play();
	},

	/**
	 * Función usada controlar el evento click en el botón continuar
	 * @method manejadorClickBotonContinuar
	 */
	manejadorClickBotonContinuar: function() {
		// Reproducimos audio y llamamos al estado nivel 2 para seguir jugando
		game.sfxStart.play();
		game.state.start('level1');
	},
	
	/**
	 * Función usada controlar el evento click en el botón volver
	 * @method manejadorClickBotonVolver
	 */
	manejadorClickBotonVolver: function() {
		// Reproducimos audio y llamamos al estado menu para volver al inicio
		game.sfxStart.play();
		game.state.start('menu');
	},
	
	/**
	 * Función usada para cargar un halo de estrellas creando así una sensación de velocidad
	 * @method cargarEstrellas
	 */
	cargarEstrellas: function() {
		// Variables vector que contienen las estrellas y sus coordenadas
		game.estrellas = [];
		game.estrellasX = [];
		game.estrellasY = [];
		game.estrellasZ = [];
		// Variables usadas para almacenar parámetros de las estrellas 
		game.distanciaEstrellas = 300;
		game.velocidadEstrellas = 1;
		game.maxEstrellas = 1000;
		var sprites = game.add.spriteBatch();
		for (var i = 0; i < game.maxEstrellas; i++) {
			// Cargamos las coordenadas de las estrellas aleatoriamente
			game.estrellasX[i] = Math.floor(Math.random() * 800) - 400;
			game.estrellasY[i] = Math.floor(Math.random() * 600) - 300;
			game.estrellasZ[i] = Math.floor(Math.random() * 1700) - 100;
			var star = game.make.sprite(0, 0, 'star');
			star.anchor.set(0.5);
			sprites.addChild(star);
			// Y las añadimos al vector principal
			game.estrellas.push(star);
		}
	},
	
	/**
	 * Función usada para actualizar el halo de estrellas mostrado durante el juego
	 * @method actualizarEstrellas
	 */
	actualizarEstrellas: function() {
		// Recorremos vector de estrellas
		for (var i = 0; i < game.maxEstrellas; i++) {
			// Y las trasladamos para dar sensación de movimiento
			game.estrellas[i].perspective = game.distanciaEstrellas / (game.distanciaEstrellas - game.estrellasZ[i]);
			game.estrellas[i].x = game.world.centerX + game.estrellasX[i] * game.estrellas[i].perspective;
			game.estrellas[i].y = game.world.centerY + game.estrellasY[i] * game.estrellas[i].perspective;
			game.estrellasZ[i] += game.velocidadEstrellas;
			if (game.estrellasZ[i] > 290) {
				game.estrellasZ[i] -= 600;
			}
			game.estrellas[i].alpha = Math.min(game.estrellas[i].perspective / 2, 1);
			game.estrellas[i].scale.set(game.estrellas[i].perspective / 2);
			game.estrellas[i].rotation += 0.1;
		}
		// Posicionamos por encima los botones y texto mostrados
		game.world.bringToTop(game.titulo);
		game.world.bringToTop(game.btnContinuar);
		game.world.bringToTop(game.btnVolver);
	}
}
