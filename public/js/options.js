// Variable estado usada para cargar la pantalla de opciones
var optionsState = {
	/**
	 * Método usado para precargar los elementos del slider sólo en ésta vista
	 * @method preload
	 */
	preload: function() {
		// Cargamos skin y mensajes primero para minimizar el delay de la carga del controlador de volúmen
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
		// Cargamos y mostramos mensajes por pantalla
		game.mapaTitulo = game.add.bitmapText(100, 80, 'gem', '', 54);
		game.global.mostrarLetraPorLetra(game.mapaTitulo, 'Opciones');
		game.slickUI.load('assets/ui/kenney/kenney.json');
	},
	
	/**
	 * Método usado para crear la ventana de opciones
	 * @method create
	 */
    create: function() {
		// Creamos slider para manejar el volúmen del audio y le asignamos su manejador
        game.sliderVolumen = new SlickUI.Element.Slider(game.world.width - 310, 275, 200);
		game.slickUI.add(game.sliderVolumen);
		game.sliderVolumen.onDrag.add(this.manejadorControlVolumen, this);
		game.volumen = game.add.bitmapText(game.world.width - 250, 300, 'gem', 'Volúmen', 24);
		// Iniciamos carga de estrellas en pantalla y posicionamos por encima botones y texto mostrados
		game.global.cargarEstrellas();
		// Si ejecutamos el juego desde el móvil cargamos el pad virtual
		if (game.escritorio) {
			game.btnPantalla = game.add.button(game.world.width - 300, 375, 'botonPantallaCompleta', this.manejadorClickBotonPantalla, this, 0, 1, 0);
			game.btnPantalla.onInputOver.add(this.manejadorOverBoton, this);
			game.world.bringToTop(game.btnPantalla);
		}
		// Agregamos botones y sus manejadores para controlar sus eventos
		game.btnSkin = game.add.button(game.world.width - 300, 475, 'botonSkin', this.manejadorClickBotonSkin, this, 0, 1, 0);
		game.btnSkin.onInputOver.add(this.manejadorOverBoton, this);
		game.btnVolver = game.add.button(game.world.width - 300, 575, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		game.global.actualizarEstrellas();
		game.world.bringToTop(game.mapaTitulo);
		game.world.bringToTop(game.volumen);
		game.world.bringToTop(game.btnVolver);
		game.world.bringToTop(game.btnSkin);
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
	 * Función usada para controlar el evento click en el botón cambiar pantalla
	 * @method manejadorClickBotonPantalla
	 */
	manejadorClickBotonPantalla: function() {
		// Reproducimos audio y cambiamos el modo de pantalla
		game.sfxStart.play();
		if (game.scale.isFullScreen) {
			game.scale.stopFullScreen();
		} else {
			game.scale.startFullScreen();
		}
		game.btnPantalla.loadTexture((game.scale.isFullScreen) ? 'botonPantallaCompleta' : 'botonPantalla');
	},
	
	/**
	 * Función usada para controlar el evento click en el botón cambiar skin
	 * @method manejadorClickBotonSkin
	 */
	manejadorClickBotonSkin: function() {
		// Reproducimos audio y cambiamos la skin a mostrar
		game.sfxStart.play();
		game.skinSeleccionada++;
		// Si la skin no esta entre las disponibles la reiniciamos a la inicial
		if (game.skinSeleccionada > game.skinsTotal) {
			game.skinSeleccionada = 1;
		}
		// Cargamos nueva skin por pantalla
		game.skin.loadTexture('skin' + game.skinSeleccionada);
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
	 * Función usada para controlar el evento de arrastrado del slider
	 * @method manejadorControlVolumen
	 */
	manejadorControlVolumen: function() {
		// Cambiamos el volúmen de los audios a partir del valor del slider
		game.sound.volume = arguments[0];
	}
}
