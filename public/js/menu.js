// Variable estado usada para cargar el menú inicial de juego
var menuState = {	
	/**
	 * Método usado para crear los diferentes elementos del menú principal
	 * @method create
	 */
	create: function() {
		// Cargamos fondo y mostramos título y demás mensajes agregando instrucciones para iniciar el juego
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
		game.mapaTitulo = game.add.bitmapText(100, 80, 'gem', '', 54);
		this.mostrarLetraPorLetra(game.mapaTitulo, 'Space Invaders');
		// Agregamos botones para controlar las opciones de juego
		game.btnJugar = game.add.button(game.world.width - 300, 375, 'botonJugar', this.manejadorClickBotonJugar, this, 0, 1, 0);
		game.btnOpciones = game.add.button(game.world.width - 300, 475, 'botonOpciones', this.manejadorClickBotonOpciones, this, 0, 1, 0);
		game.btnPuntuaciones = game.add.button(game.world.width - 300, 575, 'botonPuntuaciones', this.manejadorClickBotonPuntuaciones, this, 0, 1, 0);
		// Controlamos los eventos over de los botones
		game.btnJugar.onInputOver.add(this.manejadorOverBoton, this);
		game.btnOpciones.onInputOver.add(this.manejadorOverBoton, this);
		game.btnPuntuaciones.onInputOver.add(this.manejadorOverBoton, this);
		// Inicializamos valores e iniciamos la carga de las estrellas en pantalla
		this.inicializarParametros();
		this.cargarIntro();
	},	
	
	/**
	 * Método ejecutado cada frame para actualizar la lógica del juego
	 * @method update
	 */
    update: function() {
		// Actualizamos estrellas y logo mostrado en interfaz
		this.actualizarIntro();
	},
	
	/**
	 * Función usada para controlar el evento hover en todos los botones a nivel general
	 * @method manejadorOverBoton
	 */
	manejadorOverBoton: function() {
		game.sfxHover.play();
	},

	/**
	 * Función usada para controlar el evento click en el botón jugar
	 * @method manejadorClickBotonJugar
	 */
	manejadorClickBotonJugar: function() {
		// Reproducimos audio y llamamos al estado nivel 1 y arrancamos juego
		game.sfxStart.play();
		game.state.start('level1');
	},
	
	/**
	 * Función usada para controlar el evento click en el botón opciones
	 * @method manejadorClickBotonOpciones
	 */
	manejadorClickBotonOpciones: function() {
		// Reproducimos audio y llamamos al estado options para mostrar la pantalla de opciones
		game.sfxStart.play();
		game.state.start('options');
	},
	
	/**
	 * Función usada para controlar el evento click en el botón puntuaciones
	 * @method manejadorClickBotonPuntuaciones
	 */
	manejadorClickBotonPuntuaciones: function() {
		// Reproducimos audio y llamamos al estado score para mostrar la pantalla de puntuaciones
		game.sfxStart.play();
		game.state.start('score');
	},
	
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
	 * Función usada para controlar el evento click en el botón puntuaciones
	 * @method inicializarParametros
	 */
	inicializarParametros: function() {
		// Cargamos parámetros iniciales de juego
		game.puntos = 0;
		game.nivelNaveEscudo = 1;
		game.nivelNaveDisparo = 1;
		game.nivelNaveVelocidad = 1;
		game.naveBalasRatio = 1000;
		game.naveVelocidad = 200;
		game.velocidadLogo = 0.1;
		game.siguienteNivel = 'level1';
		// Cargamos audios iniciales
		game.sfxHover = game.add.audio('botonHover');
		game.sfxStart = game.add.audio('botonStart');
		game.sfxCancel = game.add.audio('botonCancel');
	},
	
	/**
	 * Función usada para cargar un halo de estrellas creando así una sensación de velocidad
	 * @method cargarIntro
	 */
	cargarIntro: function() {
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
		// Si no hemos cargado previamente el logo
		if (!game.logoIntro) {
			// Lo cargamos en el menú inicial
			game.logo = game.add.sprite(game.world.width / 2, 425, 'logo');
			game.logo.anchor.set(0.5);
			game.logo.scale.x = 0.1;
			game.logo.scale.y = 0.1;
		}
	},
	
	/**
	 * Función usada para actualizar el halo de estrellas mostrado durante el juego
	 * @method actualizarIntro
	 */
	actualizarIntro: function() {
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
		// Si el ancho del logo no ha ocupado la pantalla
		if (game.logo.width < game.world.centerX * 2) { 
			// Ampliamos logo y obtenemos la hora para crear una animación de ampliación
			game.velocidadLogo += 0.005;
			game.logo.scale.x += game.velocidadLogo;
			game.logo.scale.y += game.velocidadLogo;
			game.logo.y -= 4;
			tiempo = this.game.time.totalElapsedSeconds();
		}
		// Si ha pasado 1 segundo y se cumple la segunda condición
		if (this.game.time.totalElapsedSeconds() > tiempo + 1 && game.logo.width < game.world.centerX * 300) {
			// Subimos logo para colocarlo encima de los botones
			game.velocidadLogo += 1;
			game.logo.scale.x += game.velocidadLogo;
			game.logo.scale.y += game.velocidadLogo;
			game.logo.y += 10;
		} 
		// Posicionamos por encima los botones y texto mostrados
		game.world.bringToTop(game.mapaTitulo);
		game.world.bringToTop(game.btnJugar);
		game.world.bringToTop(game.btnOpciones);
		game.world.bringToTop(game.btnPuntuaciones);
	}
};
