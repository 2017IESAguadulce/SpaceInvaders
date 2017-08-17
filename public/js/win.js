// Variable estado usada para cargar la pantalla de juego ganado
var winState = {
	/**
	 * Método usado para precargar los elementos del slider sólo en ésta vista
	 * @method preload
	 */
	preload: function() {
		game.slickUI.load('assets/ui/kenney/kenney.json');
	},
	
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
		// Agregamos el botón volver y su manejador para controlar sus eventos
		game.btnVolver = game.add.button(game.world.width - 300, 575, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		game.global.cargarEstrellas();
		// Comprobamos si existe record para actualizar registros y demás
		if (this.comprobarRecord(game.puntos)) {
			// Cargamos mensajes, campos de texto para introducir datos y botón enviar
			game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, 'Introduce tus iniciales:');
			game.texto = new SlickUI.Element.TextField(game.world.centerX + 205, 280, 200, 40);
			game.slickUI.add(game.texto);
			game.btnEnviar = game.add.button(game.world.width - 300, 475, 'botonEnviar', this.manejadorClickBotonEnviar, this, 0, 1, 0);
			game.btnEnviar.onInputOver.add(this.manejadorOverBoton, this);
			game.world.bringToTop(game.btnEnviar);
		} else {
			game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, 'No has entrado en el Top ' + game.topMaximo);
		}
		// Posicionamos por encima botones y texto mostrados
		game.world.bringToTop(game.mapaTitulo);
		game.world.bringToTop(game.mapaPuntuaciones);
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
	 * Función usada para controlar el evento click en el botón enviar
	 * @method manejadorClickBotonEnviar
	 */
	manejadorClickBotonEnviar: function() {
		// Reproducimos audio y llamamos al estado menu para volver al inicio
		game.sfxStart.play();
		if (game.texto.value.length == 3) {
			// Comprobamos si el nombre indroducido está disponible
			var sw = false;
			for (var i = 0; i < localStorage.length; i++) {
				if (game.texto.value == localStorage.key(i)) {
					sw = true;
				}
			}
			// Si no esta en uso lo introducimos
			if (!sw) {
				this.guardarPuntuacion(game.texto.value, game.puntos);
				game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, 'Has entrado en el Top ' + game.topMaximo);
				game.texto.visible = false;
				game.btnEnviar.visible = false;
			} else {
				game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, 'Este nombre ya está en uso');
			}
		} else {
			game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, 'Introduce 3 caracteres');
		}
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
	 * Función usada para comprobar si el jugador ha batido el record o no
	 * @method comprobarRecord
	 * @param {} puntos
	 * @return
	 */
	comprobarRecord: function(puntos) {
		var sw = false;
		// Si no estan los registros llenos asignamos el valor true
		if (localStorage.length < game.topMaximo) {
			sw = true;
		} else {
			// En caso contrario comprobamos si la puntuación en el resto de registros
			for (var i = 0; i < localStorage.length; i++) {
				if (puntos > localStorage.getItem(localStorage.key(i))) {
					sw = true;
					break;
				}
			}
		}
		return sw;
	},
	
	/**
	 * Función usada para guardar la puntuación del jugador
	 * @method guardarPuntuacion
	 * @param {} jugador
	 * @param {} puntos
	 */
	guardarPuntuacion: function(jugador, puntos) {
		// Almacenamos puntuación actual en registro
		localStorage.setItem(jugador, puntos);
		// Si hay más registros del total máximo permitido
		if (localStorage.length > game.topMaximo) {
			menorPuntuacion = localStorage.getItem(localStorage.key(0));
			menorPuntuacionIndice = 0;
			// Obtenemos el registo de menor puntuación
			for (var i = 1; i < localStorage.length; i++) {
				// Si la nueva puntuación es mayor que la guardada, actualizamos su referencia
				if (menorPuntuacion > localStorage.getItem(localStorage.key(i))) {
					menorPuntuacion = localStorage.getItem(localStorage.key(i));
					menorPuntuacionIndice = i;
				}
			}
			// Para posteriormente eliminarlo
			localStorage.removeItem(localStorage.key(menorPuntuacionIndice));
		}
	}
}
