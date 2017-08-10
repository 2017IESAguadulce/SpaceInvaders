// Variable global usada para almacenar la propia referencia al juego y sus métodos
var game = new Phaser.Game(1024, 768, Phaser.AUTO, '');

// Agregamos cada estado de juego para modular la aplicación
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('options', optionsState);
game.state.add('score', scoreState);
game.state.add('level1', level1State);
game.state.add('levelUp', levelUp);
game.state.add('level2', level2State);
game.state.add('level3', level3State);
game.state.add('win', winState);
game.state.add('lose', loseState);

// Comenzamos inicialmente llamando al estado boot
game.state.start('boot');

// Agregamos algunas funciones globales
game.global = {
	/**
	 * Función usada para mostrar animación de texto cargando un mensaje letra a letra
	 * @method mostrarLetraPorLetra
	 * @param {} mapaTexto
	 * @param {} mensaje
	 */
	mostrarLetraPorLetra: function(mapaTexto, mensaje) {
		game.time.events.repeat(150, mensaje.length, this.mostrarLetraSiguiente, { mapaTexto: mapaTexto, mensaje: mensaje, contador: 1 });
	},
	
	/**
	 * Función usada para mostrar la letra siguiente sobreescribiendo el valor del mensaje inicial
	 * @method mostrarLetraSiguiente
	 */
	mostrarLetraSiguiente: function() {
		this.mapaTexto.text = this.mensaje.substr(0, this.contador);
		this.contador += 1;
	},
	
	/**
	 * Función usada para mostrar animación de texto cargando un mensaje letra a letra
	 * @method mostrarLetraPorLetra
	 * @param {} mapaTexto
	 * @param {} mensaje
	 * @param {} locY
	 */
	mostrarLetraPorLetraNivel: function(mapaTexto, mensaje) {
		game.time.events.repeat(200, mensaje.length + 1, this.mostrarLetraSiguienteNivel, { mapaTexto: mapaTexto, mensaje: mensaje, contador: 1 , total: mensaje.length });
	},
	
	/**
	 * Función auxiliar usada para mostrar la siguiente letra sobreescribiendo el valor del mensaje inicial
	 * @method mostrarLetraSiguiente
	 */
	mostrarLetraSiguienteNivel: function() {
		if (this.contador > this.total) {
			this.mapaTexto.text = '';
		} else {
			this.mapaTexto.text = this.mensaje.substr(0, this.contador);
			this.contador += 1;
		}
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
	}
}
