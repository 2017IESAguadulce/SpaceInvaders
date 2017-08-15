// Variable estado usada para cargar la pantalla de puntuaciones
var scoreState = {
	/**
	 * Método usado para crear la interfaz de puntuaciones
	 * @method create
	 */
    create: function() {
		// Cargamos fondo y mostramos mensajes por pantalla
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
		game.mapaTitulo = game.add.bitmapText(100, 80, 'gem', '', 54);
		game.global.mostrarLetraPorLetra(game.mapaTitulo, 'Puntuaciones');
		game.mapaPuntuaciones = game.add.bitmapText(250, 280, 'gem', '', 34);
		game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, this.leerPuntuaciones());
		// Agregamos botones y manejadores para controlar sus eventos
		game.btnReiniciar = game.add.button(game.world.width - 300, 475, 'botonReiniciar', this.manejadorClickBotonReiniciar, this, 0, 1, 0);
		game.btnReiniciar.onInputOver.add(this.manejadorOverBoton, this);
		game.btnVolver = game.add.button(game.world.width - 300, 575, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		// Iniciamos carga de estrellas en pantalla y posicionamos por encima botones y texto mostrados
		game.global.cargarEstrellas();
		game.world.bringToTop(game.mapaTitulo);
		game.world.bringToTop(game.btnReiniciar);
		game.world.bringToTop(game.btnVolver);
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
	 * Función usada para controlar el evento click en el botón reiniciar
	 * @method manejadorClickBotonReiniciar
	 */
	manejadorClickBotonReiniciar: function() {
		// Reproducimos audio, borramos datos y actualizamos mensaje
		game.sfxStart.play();
		localStorage.clear();
		game.state.start('score');
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
	 * Función usada para leer, ordenar y formatear las puntuaciones almacenadas
	 * @method leerPuntuaciones
	 * @return
	 */
	leerPuntuaciones: function() {
		var mensaje = "No hay datos guardados";
		// Si hay puntuaciones guardadas
		if (localStorage.length != 0) {
			mensaje = "";
			puntuaciones = this.ordenarPuntuaciones();
			// Formateamos puntuaciones ya ordenadas por puntos para poder mostrarlas por pantalla
			for (var key in puntuaciones) {
				if (puntuaciones.hasOwnProperty(key)) {
					mensaje += (Object.keys(puntuaciones).indexOf(key) + 1) + ". " + puntuaciones[key].nombre + "  " + puntuaciones[key].puntos + "\n";
				}
			}
		}
		return mensaje;
	},
	
	/**
	 * Función usada para obtener y ordenar las puntuaciones almacenadas
	 * @method ordenarPuntuaciones
	 * @return
	 */
	ordenarPuntuaciones: function() {
		var puntuaciones = [];
		// Obtenemos puntuaciones y las almacenamos en un vector asociativo
		for (var i = 0; i < localStorage.length; i++) {
			puntuaciones.push({
				nombre: localStorage.key(i),
				puntos: localStorage.getItem(localStorage.key(i))
			});
		}
		// Ordenamos colección y le damos la vuelta para devolverla descendentemente
		puntuaciones.sort(function(a, b) {
			return a.puntos - b.puntos;
		});
		return puntuaciones.reverse();
	}
}
