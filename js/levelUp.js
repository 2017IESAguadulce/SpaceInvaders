// Variable estado usada para cargar la pantalla de nivel superado
var levelUp = {
	/**
	 * Método usado para cargar el mensaje de juego ganado
	 * @method create
	 */
    create: function() {
		// Cargamos fondo y mostramos mensaje final agregando instrucciones para reiniciar el juego
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
        game.titulo = game.add.text(80, 80, 'Mejoras de Nave', { font: '54px Arial', fill: 'white' });
        game.puntosTexto = game.add.text(80, 200, 'Puntos: ' + game.puntos, {font: '34px Arial', fill: 'white' });
		game.escudoNave = game.add.text(170, 325, 'Escudo Nv. ' + game.nivelNaveEscudo, {font: '24px Arial', fill: 'white' });
		game.velocidadDisparo = game.add.text(170, 400, 'Disparo Nv. ' + game.nivelNaveDisparo, {font: '24px Arial', fill: 'white' });
		game.velocidadNave = game.add.text(170, 475, 'Velocidad Nv. ' + game.nivelNaveVelocidad, {font: '24px Arial', fill: 'white' });
		// Agregamos botones y manejadores para controlar sus eventos
		game.costeEscudo = this.prepararBotonMejora("escudo", game.nivelNaveEscudo, 315);
		game.costeDisparo = this.prepararBotonMejora("disparo", game.nivelNaveDisparo, 390);
		game.costeVelocidad = this.prepararBotonMejora("velocidad", game.nivelNaveVelocidad, 465);
		game.btnContinuar = game.add.button(game.world.centerX + 100, 350, 'botonContinuar', this.manejadorClickBotonContinuar, this, 0, 1, 0);
		game.btnContinuar.onInputOver.add(this.manejadorOverBoton, this);
		game.btnVolver = game.add.button(game.world.centerX + 100, 450, 'botonVolver', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
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
		game.state.start('level1');
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
					game.costeEscudo.loadTexture('botonMejora' + game.nivelNaveEscudo);
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
					game.costeDisparo.loadTexture('botonMejora' + game.nivelNaveDisparo);
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
					game.costeVelocidad.loadTexture('botonMejora' + game.nivelNaveVelocidad);
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
			boton = game.add.button(80, coorY, 'botonMejora' + nivel, manejadorEvento, this, 0, 1, 0)
			boton.onInputOver.add(this.manejadorOverBoton, this);
		}
		return boton;
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
		game.world.bringToTop(game.btnContinuar);
		game.world.bringToTop(game.btnVolver);
	}
}
