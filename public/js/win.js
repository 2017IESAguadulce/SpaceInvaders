// Variable estado usada para cargar la pantalla de juego ganado
var winState = {
	/**
	 * Método usado para cargar el mensaje de juego ganado
	 * @method create
	 */
    create: function() {
		// Cargamos fondo y mostramos mensaje final agregando instrucciones para reiniciar el juego
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
		game.mapaTitulo = game.add.bitmapText(100, 80, 'gem', '', 54);
		game.global.mostrarLetraPorLetra(game.mapaTitulo, '¡Has Ganado!');
		game.mapaPuntuaciones = game.add.bitmapText(250, 280, 'gem', '', 34);
		game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, 'Se ha guardado tu puntuación');
		// Agregamos el botón volver y su manejador para controlar sus eventos
		game.btnVolver = game.add.button(game.world.width - 300, 575, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		// Iniciamos carga de estrellas en pantalla y posicionamos por encima botones y texto mostrados
		game.global.cargarEstrellas();
		game.world.bringToTop(game.mapaTitulo);
		game.world.bringToTop(game.mapaPuntuaciones);
		game.world.bringToTop(game.btnVolver);
		// Guardamos puntuaciones de 						prueba
		this.guardarPuntuacion('Lorem', 10000);
		this.guardarPuntuacion('Jugador', game.puntos);
    },
    
	/**
	 * Método ejecutado cada frame para actualizar la lógica del juego
	 * @method update
	 */
    update: function() {
		// Actualizamos estrellas mostradas
		game.global.actualizarEstrellas();
	},
	
	/**
	 * Función usada para controlar el evento hover en todos los botones a nivel general
	 * @method manejadorOverBoton
	 */
	manejadorOverBoton: function() {
		game.sfxHover.play();
	},

	/**
	 * Función usada para controlar el evento click en el botón volver
	 * @method manejadorClickBotonVolver
	 */
	manejadorClickBotonVolver: function() {
		// Reproducimos audio y llamamos al estado menu para volver al inicio
		game.sfxStart.play();
		game.state.start('menu');
	},
	
	/**
	 * Función usada para guardar la puntuación del jugador
	 * @method guardarPuntuacion
	 * @param {} jugador
	 * @param {} puntos
	 */
	guardarPuntuacion: function(jugador, puntos) {
		if (jugador.length != 0 && puntos != null) {
			localStorage.setItem(jugador, puntos);
			console.log(jugador + " -> " + puntos);
		} else {
			console.log("Datos incorrectos");
		}
	}
}
