// Variable estado usada para cargar la pantalla de puntuaciones
var scoreState = {
	/**
	 * Método usado para crear la interfaz de puntuaciones
	 * @method create
	 */
    create: function() {
		// Cargamos fondo y mostramos mensaje por pantalla
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
		game.mapaTitulo = game.add.bitmapText(100, 80, 'gem', '', 54);
		game.global.mostrarLetraPorLetra(game.mapaTitulo, 'Puntuaciones');
		// Agregamos el botón volver y su manejador para controlar sus eventos
		game.btnVolver = game.add.button(game.world.width - 300, 575, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		// Iniciamos la carga de las estrellas en pantalla
		game.global.cargarEstrellas();
    },

	/**
	 * Método ejecutado cada frame para actualizar la lógica del juego
	 * @method update
	 */
    update: function() {
		// Actualizamos estrellas mostradas y posicionamos por encima botones y texto mostrados
		game.global.actualizarEstrellas();
		game.world.bringToTop(game.mapaTitulo);
		game.world.bringToTop(game.btnVolver);
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
	}
}
