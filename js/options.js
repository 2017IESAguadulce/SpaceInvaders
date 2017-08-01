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
		// Cargamos skin y mostramos mensajes por pantalla
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
        game.titulo = game.add.text(80, 80, 'Opciones', { font: '54px Arial', fill: 'white' });
		game.volumen = game.add.text(game.world.centerX + 150, 300, 'Volúmen', { font: '24px Arial', fill: 'white' });
		// Creamos slider para manejar el volúmen del audio y le asignamos su manejador
        game.sliderVolumen = new SlickUI.Element.Slider(game.world.centerX + 95, 280, 200);
		game.slickUI.add(game.sliderVolumen);
		game.sliderVolumen.onDrag.add(this.manejadorControlVolumen, this);
		// Agregamos el botón volver y su manejador para controlar sus eventos
		game.btnVolver = game.add.button(game.world.centerX + 100, 450, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		// Agregamos el botón cambiar skin y su manejador para controlar sus eventos
		game.btnSkin = game.add.button(game.world.centerX + 100, 350, 'botonSkin', this.manejadorClickBotonSkin, this, 0, 1, 0);
		game.btnSkin.onInputOver.add(this.manejadorOverBoton, this);
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
	 * Función usada controlar el evento click en el botón cambiar skin
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
		game.world.bringToTop(game.volumen);
		game.world.bringToTop(game.btnVolver);
		game.world.bringToTop(game.btnSkin);
	}
}
