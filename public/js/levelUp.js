// Variable estado usada para cargar la pantalla de nivel superado
var levelUp = {
	/**
	 * Método usado para cargar el mensaje de juego ganado
	 * @method create
	 */
    create: function() {
		// Cargamos fondo y mostramos mensaje final agregando instrucciones para reiniciar el juego
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
		game.mapaTitulo = game.add.bitmapText(100, 80, 'gem', '', 54);
		game.global.mostrarLetraPorLetra(game.mapaTitulo, 'Mejoras de Nave');
		game.puntosTexto = game.add.bitmapText(120, 280, 'gem', 'Puntos: ' + game.puntos, 34);
		
		game.escudoNave = game.add.bitmapText(210, 440, 'gem', 'Escudo Nv. ' + ((game.nivelNaveEscudo <= 5) ? game.nivelNaveEscudo : "Máximo"), 24);
		game.velocidadDisparo = game.add.bitmapText(210, 515, 'gem', 'Disparo Nv. ' + ((game.nivelNaveDisparo <= 5) ? game.nivelNaveDisparo : "Máximo"), 24);
		game.velocidadNave = game.add.bitmapText(210, 590, 'gem', 'Velocidad Nv. ' + ((game.nivelNaveVelocidad <= 5) ? game.nivelNaveVelocidad : "Máximo"), 24);
		// Agregamos botones y manejadores para controlar sus eventos
		game.costeEscudo = this.prepararBotonMejora("escudo", game.nivelNaveEscudo, 430);
		game.costeDisparo = this.prepararBotonMejora("disparo", game.nivelNaveDisparo, 505);
		game.costeVelocidad = this.prepararBotonMejora("velocidad", game.nivelNaveVelocidad, 580);
		game.btnContinuar = game.add.button(game.world.width - 300, 475, 'botonContinuar', this.manejadorClickBotonContinuar, this, 0, 1, 0);
		game.btnContinuar.onInputOver.add(this.manejadorOverBoton, this);
		game.btnVolver = game.add.button(game.world.width - 300, 575, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		// Iniciamos carga de estrellas en pantalla y posicionamos por encima botones y texto mostrados
		game.global.cargarEstrellas();
		game.world.bringToTop(game.mapaTitulo);
		game.world.bringToTop(game.btnContinuar);
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
	 * Función usada para controlar el evento click en el botón continuar
	 * @method manejadorClickBotonContinuar
	 */
	manejadorClickBotonContinuar: function() {
		// Reproducimos audio y llamamos al estado nivel 2 para seguir jugando
		game.sfxStart.play();
		game.state.start(game.siguienteNivel);
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
	 * Función usada para controlar el evento click en los botones de mejora
	 * @method manejadorClickBotonMejora
	 * @param {} tipo
	 */
	manejadorClickBotonMejora: function(tipo) {
		sw = false;
		switch(tipo) {
			// En caso de tratarse de una mejora de tipo escudo
			case "escudo":
				// Comprobamos que tengamos los suficientes puntos y que el nivel de mejora sea menor de 6
				if (game.puntos >= game.nivelNaveEscudo * 1000 && game.nivelNaveEscudo <= 5) {
					// Restamos los puntos usados y aumentamos nivel de mejora
					game.puntos -= game.nivelNaveEscudo * 1000;
					game.nivelNaveEscudo++;
					// Cambiando los textos mostrados por pantalla
					game.costeEscudo.loadTexture((game.nivelNaveEscudo <= 5) ? 'botonMejora' + game.nivelNaveEscudo : null);
					game.escudoNave.text = "Escudo Nv. " + ((game.nivelNaveEscudo <= 5) ? game.nivelNaveEscudo : "Máximo");
					sw = true;
				}
			break;
			// En caso de tratarse de una mejora de tipo disparo
			case "disparo":
				if (game.puntos >= game.nivelNaveDisparo * 1000 && game.nivelNaveDisparo <= 5) {
					// Realizamos el mismo proceso que en el caso anterior
					game.puntos -= game.nivelNaveDisparo * 1000;
					game.nivelNaveDisparo++;
					game.costeDisparo.loadTexture((game.nivelNaveDisparo <= 5) ? 'botonMejora' + game.nivelNaveDisparo : null);
					game.velocidadDisparo.text= "Disparo Nv. " + ((game.nivelNaveDisparo <= 5) ? game.nivelNaveDisparo : "Máximo");
					game.naveBalasRatio /= 1.4;
					sw = true;
				}
			break;
			// En caso de tratarse de una mejora de tipo velocidad
			case "velocidad":
				if (game.puntos >= game.nivelNaveVelocidad * 1000 && game.nivelNaveVelocidad <= 5) {
					game.puntos -= game.nivelNaveVelocidad * 1000;
					game.nivelNaveVelocidad++;
					game.costeVelocidad.loadTexture((game.nivelNaveVelocidad <= 5) ? 'botonMejora' + game.nivelNaveVelocidad : null);
					game.velocidadNave.text= "Disparo Nv. " + ((game.nivelNaveVelocidad <= 5) ? game.nivelNaveVelocidad : "Máximo");
					game.naveVelocidad *= 1.2;
					sw = true;
				}
			break;
		}
		// Reproducimos un sonido u otro dependiendo de si hemos mejorado alguna habilidad o no
		(sw) ? game.sfxStart.play() : game.sfxCancel.play();
		// Actualizamos puntos en pantalla
		game.puntosTexto.text = "Puntos: " + game.puntos;
	},
	
	/**
	 * Función usada para controlar el evento click en el botón volver
	 * @method prepararBotonMejora
	 * @param {} tipo
	 * @param {} nivel
	 * @param {} coorY
	 * @return {} button
	 */
	prepararBotonMejora: function(tipo, nivel, coorY) {
		var boton = null;
		// Si el nivel de la mejora es inferior o igual al tope de 5
		if (nivel <= 5) {
			// Almacenamos manejador en variable y lo asignamos al botón para devolverlo
			var manejadorEvento = function() { this.manejadorClickBotonMejora(tipo); }.bind(this);
			boton = game.add.button(120, coorY, 'botonMejora' + nivel, manejadorEvento, this, 0, 1, 0)
			boton.onInputOver.add(this.manejadorOverBoton, this);
		}
		return boton;
	}
}
