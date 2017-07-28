// Variable estado usada para cargar el menú inicial de juego
var menuState = {	
	/**
	 * Método usado para cargar los diferentes elementos del menú principal
	 * @method create
	 */
	create: function() {
		// Mostramos el título y demás mensajes agregando instrucciones para iniciar el juego.
        var titulo = game.add.text(80, 80, 'Space Invaders', { font: '54px Arial', fill: 'white' });
        var inicio = game.add.text(80, game.world.height-100, 'Pulsa "Intro" para comenzar', {font: '30px Arial', fill: 'white' });
		// Asignamos velocidad inicial de logo mostrado y cargamos animaciones
		game.velocidadLogo = 0.1;
		this.cargarEstrellas();
        // Definimos la variable que captura la pulsación de la tecla intro
        var intro = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // Y le asignamos un evento para que comience el juego al pulsarla
        intro.onDown.addOnce(this.start, this);
	},
	
	/**
	 * Método ejecutado cada frame para actualizar la lógica del juego
	 * @method update
	 */
    update: function() {
		// Actualizamos estrellas y logo mostrado en interfaz
		this.actualizarEstrellas();
	},
	
	/**
	 * Función usada para mostrar un halo de estrellas que crea una sensación de velocidad
	 * @method cargarEstrellas
	 */
	cargarEstrellas: function() {
		// Variables referentes a las estrellas
		game.estrellas = [];
		game.estrellasX = [];
		game.estrellasY = [];
		game.estrellasZ = [];
		game.distanciaEstrellas = 300;
		game.velocidadEstrellas = 1;
		game.maxEstrellas = 1000;
		var sprites = game.add.spriteBatch();
		for (var i = 0; i < game.maxEstrellas; i++) {
			game.estrellasX[i] = Math.floor(Math.random() * 800) - 400;
			game.estrellasY[i] = Math.floor(Math.random() * 600) - 300;
			game.estrellasZ[i] = Math.floor(Math.random() * 1700) - 100;
			var star = game.make.sprite(0, 0, 'star');
			star.anchor.set(0.5);
			sprites.addChild(star);
			game.estrellas.push(star);
		}
		game.logo = game.add.sprite(400, 300, 'logo');
		game.logo.anchor.set(0.5);
		game.logo.scale.x = 0.1;
		game.logo.scale.y = 0.1;
	},
	
	/**
	 * Función usada para actualizar el halo de estrellas mostrado durante el juego
	 * @method actualizarEstrellas
	 */
	actualizarEstrellas: function() {
		for (var i = 0; i < game.maxEstrellas; i++) {
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
		if (game.logo.scale.x < 500) {
			game.velocidadLogo += 0.01;
			game.logo.scale.x += game.velocidadLogo;
			game.logo.scale.y += game.velocidadLogo;
		}
	},
	
	/**
	 * Método usado para llamar al siguiente estado de juego
	 * @method start
	 */
	start: function() {
		// Llamamos al estado play
		game.state.start('play');
	},
};
