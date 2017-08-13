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
		
		if (this.comprobarRecord(game.puntos)){
			game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, 'Introduce tus iniciales para almacenarlas');
			// habilitar campo de texto
			// habilitar botón enviar
		} else {
			game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, 'No has entrado en el Top ' + game.topMaximo);
		}
		
		//game.global.mostrarLetraPorLetra(game.mapaPuntuaciones, this.guardarPuntuacion('DDD', game.puntos));
		// Agregamos el botón volver y su manejador para controlar sus eventos
		game.btnVolver = game.add.button(game.world.width - 300, 575, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		// Iniciamos carga de estrellas en pantalla y posicionamos por encima botones y texto mostrados
		game.global.cargarEstrellas();
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
		if (localStorage.length < game.topMaximo) {
			sw = true;
		} else {
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
	 * @return
	 */
	guardarPuntuacion: function(jugador, puntos) {
		var mensaje = 'Has entrado en el Top ' + game.topMaximo;
		// Si hay menos del tope máximo de puntuaciones, almacenamos la nueva
		if (localStorage.length < game.topMaximo) {
			localStorage.setItem(jugador, puntos);
			//mensaje = 'Se ha guardado tu nuevo record';
		} else {
			// En caso contrario comprobamos que existe un nuevo record
			var sw = false;
			var ind = -1;
			var jugadores = [];
			// Obtenemos todos los nombres almacenados para comprobar si hay duplicidades
			for (var i = 0; i < localStorage.length; i++) {
				jugadores[i] = localStorage.key(i);
				if (jugador == jugadores[i]) {
					sw = true;
					ind = i;
				}
			}
			// Volvemos a recorrer las puntuaciones
			for (var i = 0; i < localStorage.length; i++) {
				// Si la nueva puntuación es mayor que la guardada
				if (puntos > localStorage.getItem(localStorage.key(i))) {
					// Y el nombre está duplicado
					if (sw) {
						// Borramos esa puntuación duplicada
						localStorage.removeItem(localStorage.key(ind));
					}
					// Almacenamos el nuevo record
					localStorage.setItem(jugador, puntos);
					//mensaje = 'Has entrado en el Top ' + game.topMaximo;
					break;
				}
			}
		}
		// no hace falta devolver nada pues siempre se entra en el top
		return mensaje;
	}
}
