// Variable estado usada para cargar la pantalla de opciones
var optionsState = {
	/**
	 * Método usado para precargar los elementos del slider sólo en ésta vista
	 * @method preload
	 */
	preload: function() {
		game.slickUI.load('assets/ui/kenney/kenney.json');
	},
	
	/**
	 * Método usado para crear la ventana de opciones
	 * @method create
	 */
    create: function() {	
		// Mostramos mensajes por pantalla
        var titulo = game.add.text(80, 80, 'Opciones', { font: '54px Arial', fill: 'white' });
		var volumen = game.add.text(game.world.centerX + 150, 270, 'Volúmen', { font: '24px Arial', fill: 'white' });
		// Creamos slider para manejar el volúmen del audio y le asignamos su manejador
        var sliderVolumen = new SlickUI.Element.Slider(game.world.centerX + 95, 250, 200);
		game.slickUI.add(sliderVolumen);
		sliderVolumen.onDrag.add(this.manejadorControlVolumen, this);
		// Agregamos el botón volver y su manejador para controlar sus eventos over
		btnVolver = game.add.button(game.world.centerX + 100, 450, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
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
	},

	/**
	 * Función usada controlar el evento de arrastrado del slider
	 * @method manejadorControlVolumen
	 */
	manejadorControlVolumen: function() {
		// Cambiamos el volúmen de los audios a partir del valor del slider
		game.sound.volume = arguments[0];
	}
}
