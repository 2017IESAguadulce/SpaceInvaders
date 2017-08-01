// Variable estado usada para cargar la pantalla de puntuaciones
var scoreState = {
	/**
	 * Método usado para crear la interfaz de puntuaciones
	 * @method create
	 */
    create: function() {
		// Cargamos fondo y mostramos mensaje por pantalla
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
        var titulo = game.add.text(80, 80, 'Puntuaciones', { font: '54px Arial', fill: 'white' });
		// Agregamos el botón volver y su manejador
		btnVolver = game.add.button(game.world.centerX + 100, 450, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		// Y controlamos los eventos over del botón
		btnVolver.onInputOver.add(this.manejadorOverBoton, this);
    },

	/**
	 * Función usada controlar el evento hover en todos los botones a nivel general
	 * @method manejadorOverBoton
	 */
	manejadorOverBoton: function() {
		game.sfxHover.play();
	},

	/**
	 * Función usada controlar el evento click en el botón volver
	 * @method manejadorClickBotonVolver
	 */
	manejadorClickBotonVolver: function() {
		// Reproducimos audio y llamamos al estado menu para volver al inicio
		game.sfxStart.play();
		game.state.start('menu');
	}
}
