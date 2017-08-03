// Variable estado usada para cargar el nivel 1 del juego
//Peque�o comentario: Juan Antonio
//Otro Comentario
//MAs comentarios
var level1State = {
	/**
	 * Método usado para cargar el juego
	 * @method create
	 */
    create: function() {				
		// Cargamos e iniciamos las diferentes variables usadas por el juego
		this.cargarInterfaz();
		this.cargarNave();
		this.cargarAliens();
		this.cargarAnimaciones();
		this.cargarAudios();
		this.cargarControles();
    },
	
	/**
	 * Método ejecutado cada frame para actualizar la lógica del juego
	 * @method update
	 */
    update: function() {
		// Si la nave esta viva
		if (game.nave.alive) {
			game.nave.body.velocity.setTo(0, 0);
			// Si estamos en el móvil
			if (!game.escritorio) {
				// Y si pulsamos el joystick
				if (game.joystick.properties.inUse) {
					// Controlamos el movimiento de la nave a partir del movimiento del pad
					if (game.joystick.properties.x < 0) {
						game.nave.body.velocity.x = -game.naveVelocidad;
					} else {
						game.nave.body.velocity.x = game.naveVelocidad;
					}
				}
				// Controlamos evento de disparo
				if (game.botonA.isDown) {
					this.dispararBala();
				}
			} else {
				// Controlamos movimiento de nave si estamos en entorno de escritorio
				if (game.cursores.left.isDown) {
					game.nave.body.velocity.x = -game.naveVelocidad;
				} else if (game.cursores.right.isDown) {
					game.nave.body.velocity.x = game.naveVelocidad;
				}
				// Controlamos evento de disparo
				if (game.botonDisparo.isDown) {
					this.dispararBala();
				}
			}
			// Controlamos evento de disparo de enemigos
			if (game.time.now > game.alienDisparoHora) {
				this.disparoEnemigo();
			}
			// Giramos nave y actualizamos estrellas mostradas en interfaz
			this.girarNave();
			this.actualizarEstrellas();
			// Controlamos colisiones de objetos en sus diferentes métodos
			game.physics.arcade.overlap(game.nave, game.ayudas, this.manejadorColisionNaveAyuda, null, this);
			game.physics.arcade.overlap(game.balas, game.aliens, this.manejadorDisparoNave, null, this);
			game.physics.arcade.overlap(game.balasAlien, game.nave, this.manejadorDisparoEnemigo, null, this);
		}
	},
	
	/**
	 * Función usada para gestionar las colisiones producidas entre nuestras balas y los aliens
	 * @method manejadorDisparoNave
	 * @param {} bala
	 * @param {} alien
	 */
	manejadorDisparoNave: function(bala, alien) {
		// Calculamos posibilidad de lanzar o no ayuda
		this.lanzarAyuda(alien);
		// Eliminamos bala y alien colisionados
		bala.kill();
		alien.kill();
		// Agregamos puntos a marcador y reproducimos audio
		game.puntos += 20;
		game.puntosTexto.text = 'Puntos: ' + game.puntos;
		game.sfxExplosion.play();
		// Lanzamos animación de explosión para ese alien concreto
		var explosion = game.explosiones.getFirstExists(false);
		explosion.reset(alien.body.x, alien.body.y);
		explosion.play('boom', 30, false, true);
		// Si no quedan aliens
		if (game.aliens.countLiving() == 0) {
			// Agregamos puntos a marcador
			game.puntos += 1000;
			game.puntosTexto.text = 'Puntos: ' + game.puntos;
			// Eliminamos eventos de movimiento en aliens
			game.tweens.remove(game.movimientoAlienX);
			game.time.events.remove(game.movimientoAlienY);
			game.balasAlien.callAll('kill', this);
			// Lanzamos el estado win
			game.state.start('win');
		}
	},

	/**
	 * Función usada para gestionar las colisiones producidas entre las balas enemigas y nuestra nave
	 * @method manejadorDisparoEnemigo
	 * @param {} nave
	 * @param {} bala
	 */
	manejadorDisparoEnemigo: function(nave, bala) {
		// Eliminamos bala y reproducimos sonido
		bala.kill();
		game.sfxExplosion.play();
		vida = game.vidas.getFirstAlive();
		if (vida) {
			// Si tenemos vidas quitamos una
			vida.kill();
		}
		// Mostramos la animación de explosión en las coordenadas de nuestra nave
		var explosion = game.explosiones.getFirstExists(false);
		explosion.reset(nave.body.x, nave.body.y);
		explosion.play('boom', 20, false, true);
		// Si no nos quedan vidas
		if (game.vidas.countLiving() < 1) {
			// Eliminamos la nave y removemos demás elementos de juego
			nave.kill();
			game.balasAlien.callAll('kill');
			game.tweens.remove(game.movimientoAlienX);
			game.time.events.remove(game.movimientoAlienY);
			// Lanzamos el estado lose
			game.state.start('lose');
		}
	},

	/**
	 * Función usada para gestionar las colisiones producidas entre nuestra nave y las ayudas
	 * @method manejadorColisionNaveAyuda
	 * @param {} nave
	 * @param {} ayuda
	 */
	manejadorColisionNaveAyuda: function(nave, ayuda) {
		// Eliminamos ayuda y reproducimos sonido
		ayuda.kill();
		game.sfxAyuda.play();
		// Si la ayuda es una mejora de vida
		if (ayuda.name == "mejoraVida") {
			// Y tenemos menos de 3
			if (game.vidas.countLiving() < 3) {
				// Cargamos una nueva vida en pantalla
				var img = game.vidas.create(game.world.width - 100 + ((game.vidas.countLiving() == 1) ? 30 : 0), 60, 'nave');
				img.anchor.setTo(0.5, 0.5);
				img.angle = 90;
				img.alpha = 0.4;
			}
		// Si la ayuda es una mejora de arma
		} else if (ayuda.name == "mejoraArma") {
			// Reducimos el ratio de las balas para aumentar su velocidad
			game.naveBalasRatio /= 1.5;
		// Si la ayuda es una mejora de velocidad
		} else if (ayuda.name == "mejoraVelocidad") {
			// Aumentamos la velocidad de la nave para que sea más rápida
			game.naveVelocidad *= 1.5;
		}
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
	 * Función usada controlar el evento click en el botón silenciar
	 * @method manejadorClickBotonSilenciar
	 */
	manejadorClickBotonSilenciar: function() {
		// Activamos o desactivamos el audio en nuestro juego y cambiamos la imagen mostrada
		game.sound.mute = !game.sound.mute;
		game.btnSilenciar.loadTexture((game.sound.mute) ? 'botonVolumen' : 'botonSilenciar');
		game.sfxStart.play();
	},
	
	/**
	 * Función usada para crear e inicializar las variables de la interfaz de juego
	 * @method cargarInterfaz
	 */
	cargarInterfaz: function() {
		// Agregamos skin de fondo a tablero
		game.skin = game.add.sprite(0, 0, 'skin' + game.skinSeleccionada);
		// Variables con textos y puntos mostrados por pantalla
		game.puntos = 0;
		game.puntosTexto = game.add.text(10, 10, 'Puntos: ' + game.puntos, { font: '34px Arial', fill: '#fff' });
		game.vidas = game.add.group();
		game.vidasTexto = game.add.text(game.world.width - 115, 10, 'Vidas: ', { font: '34px Arial', fill: '#fff' });
		// Mostramos las vidas del jugador
		for (var i = 0; i < 3; i++) {
			var img = game.vidas.create(game.world.width - 100 + (30 * i), 60, 'nave');
			img.anchor.setTo(0.5, 0.5);
			img.angle = 90;
			img.alpha = 0.4;
		}
		// Agregamos botón volver y silenciar junto con sus manejadores para controlar sus eventos
		game.btnVolver = game.add.button(game.world.left + 10, game.world.bottom - 50, 'botonVolverPeq', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		game.btnSilenciar = game.add.button(game.world.right - 50, game.world.bottom - 50, 'botonSilenciar', this.manejadorClickBotonSilenciar, this, 0, 1, 0);
		game.btnSilenciar.onInputOver.add(this.manejadorOverBoton, this);
		this.cargarEstrellas();
	},
	
	/**
	 * Función usada para crear e inicializar las variables de nuestra nave
	 * @method cargarNave
	 */
	cargarNave: function() {
		// Variables de nuestra nave
		game.nave = game.add.sprite(400, 500, 'nave');
		game.nave.anchor.setTo(0.5, 0.5);
		game.physics.enable(game.nave, Phaser.Physics.ARCADE);
		game.nave.body.collideWorldBounds = true;
		game.naveVelocidad = 200;
		game.naveBalasRatio = 1000;
		game.naveDisparoHora = 0;
		// Variables referentes a las balas de nuestra nave
		game.balas = game.add.group();
		game.balas.enableBody = true;
		game.balas.physicsBodyType = Phaser.Physics.ARCADE;
		game.balas.createMultiple(20, 'bala');
		game.balas.setAll('anchor.x', 0.5);
		game.balas.setAll('anchor.y', 1);
		game.balas.setAll('outOfBoundsKill', true);
		game.balas.setAll('checkWorldBounds', true);
		// Variables con las ayudas y powerups para nuestra nave
		game.ayudas = game.add.group();
		game.ayudas.enableBody = true;
		game.ayudas.physicsBodyType = Phaser.Physics.ARCADE;
		game.physics.arcade.gravity.y = 50;
	},
	
	/**
	 * Función usada para crear, inicializar y posicionar los enemigos en pantalla agregándoles movimiento
	 * @method cargarAliens
	 */
	cargarAliens: function() {
		// Variables de los aliens
		game.aliens = game.add.group();
		game.aliens.enableBody = true;
		game.aliens.physicsBodyType = Phaser.Physics.ARCADE;
		game.alienDisparoHora = 0;
		game.alienVelocidad = 2000;
		game.alienVivos = [];
		// Cargamos en filas de 4 y columnas de 10 a los enemigos
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 10; x++) {
				var alien = game.aliens.create(x * 48, y * 50, 'alien');
				alien.anchor.setTo(0.5, 0.5);
				alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
				alien.play('fly');
				alien.body.moves = false;
			}
		}
		// Asignamos coordenadas iniciales a grupo de enemigos de tipo alien
		game.aliens.x = 100;
		game.aliens.y = 50;	
		// Agregamos los eventos de movimiento horizontal y vertical para los aliens
		game.movimientoAlienX = game.add.tween(game.aliens).to( { x: 250 }, game.alienVelocidad, Phaser.Easing.Linear.None, true, 0, game.alienVelocidad, true);
		game.movimientoAlienY = game.time.events.loop(game.alienVelocidad * 2, this.descender, this);
		// Variables referentes a las balas de los aliens
		game.balasAlien = game.add.group();
		game.balasAlien.enableBody = true;
		game.balasAlien.physicsBodyType = Phaser.Physics.ARCADE;
		game.balasAlien.createMultiple(30, 'balaAlien');
		game.balasAlien.setAll('anchor.x', 0.5);
		game.balasAlien.setAll('anchor.y', 1);
		game.balasAlien.setAll('outOfBoundsKill', true);
		game.balasAlien.setAll('checkWorldBounds', true);
	},
	
	/**
	 * Función usada para crear y cargar las animaciones usadas en el juego
	 * @method cargarAnimaciones
	 */
	cargarAnimaciones: function() {
		// Variables con las animaciones de las explosiones para los objetos de juego
		game.explosiones = game.add.group();
		game.explosiones.createMultiple(30, 'boom');
		game.explosiones.forEach(this.configurarExplosion, this);
	},
	
	/**
	 * Función usada para crear e cargar los audios usados en el juego
	 * @method cargarAudios
	 */
	cargarAudios: function() {
		// Variables con los audios utilizados en el juego
		game.sfxAyuda = game.add.audio('ayuda');
		game.sfxDisparo = game.add.audio('disparo');
		game.sfxExplosion = game.add.audio('explosion');
	},
	
	/**
	 * Función usada para crear y cargar los controles de juego 
	 * @method cargarControles
	 */
	cargarControles: function() {
		// Preparamos los cursores y controles de juego
		game.cursores = game.input.keyboard.createCursorKeys();
		game.botonDisparo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		// Si ejecutamos la aplicación desde el móvil
		if (!game.escritorio) {
			// Agregamos un pad virtual con su joystick y botón
			game.gamepad = game.plugins.add(Phaser.Plugin.VirtualGamepad);
			game.joystick = game.gamepad.addJoystick(150, 500, 1.2, 'gamepad');
			game.botonA = game.gamepad.addButton(650, 500, 1.0, 'gamepad');
		}
	},	
	
	/**
	 * Función usada para configurar objetos agregándoles una animación
	 * @method configurarExplosion
	 * @param {} objeto
	 */
	configurarExplosion: function(objeto) {
		objeto.anchor.x = 0.5;
		objeto.anchor.y = 0.5;
		objeto.animations.add('boom');
	},

	/**
	 * Función usada para controlar el descenso de los enemigos de tipo alien
	 * @method descender
	 */
	descender: function() {
		game.aliens.y += 30;
	},

	/**
	 * Función usada para gestionar los disparos de los enemigos de tipo alien
	 * @method disparoEnemigo
	 */
	disparoEnemigo: function() {
		// Cargamos todos los aliens que quedan vivos en el vector
		game.alienVivos.length = 0;
		game.aliens.forEachAlive(function(alien){
			game.alienVivos.push(alien);
		});
		// Obtenemos la primera bala
		var balaAlien = game.balasAlien.getFirstExists(false);
		// Si no hay balas en pantalla y existen aliens vivos
		if (balaAlien && game.alienVivos.length > 0) {
			// Seleccionamos aleatoriamente un alien entre los que quedan vivos
			var aleatorio = game.rnd.integerInRange(0, game.alienVivos.length-1);
			var seleccion = game.alienVivos[aleatorio];
			// Y lanzamos la bala desde su posición hacia nuestra nave
			balaAlien.reset(seleccion.body.x, seleccion.body.y);
			game.physics.arcade.moveToObject(balaAlien, game.nave, 120);
			game.alienDisparoHora = game.time.now + 2000;
			game.sfxDisparo.play();
		}
	},

	/**
	 * Función usada para controlar la aleatoriedad a la hora de lanzar los paquetes de ayuda
	 * @method lanzarAyuda
	 * @param {} alien
	 */
	lanzarAyuda: function(alien) {
		// Obtenemos un número aleatorio entre 0 y 1
		var aleatorio = Math.random();
		// Si es menor que 0.06 lanzamos una mejora
		if (aleatorio < 0.06) {
			// Inicialmente cargamos una mejora de vida
			var mejora = "mejoraVida";
			// Si el número es menor que 0.04 lanzamos una mejora de arma
			if (aleatorio < 0.04) {
				mejora = "mejoraArma";
			// Si es menor que 0.02 lanzamos una mejora de velocidad
			} else if (aleatorio < 0.02) {
				mejora = "mejoraVelocidad";
			}
			this.cargarPowerUp(mejora, alien.body.x, alien.body.y);
		}
	},

	/**
	 * Función usada para cargar la ayuda en pantalla a partir de su nombre y localización
	 * @method cargarPowerUp
	 * @param {} tipoMejora
	 * @param {} locX
	 * @param {} locY
	 */
	cargarPowerUp: function(tipoMejora, locX, locY) {
		// Creamos una mejora del tipo especificado desde la localización concretada
		var objeto = game.ayudas.create(locX, locY, tipoMejora);
		objeto.name = tipoMejora;
		objeto.body.collideWorldBounds = false;
		// Y la hacemos semitransparente además de añadirle gravedad
		objeto.alpha = 0.4;
		game.physics.arcade.gravity.y = 50;
	},

	/**
	 * Función usada para disparar balas desde nuestra nave
	 * @method dispararBala
	 */
	dispararBala: function() {
		// Si ha pasado el tiempo suficiente
		if (game.time.now > game.naveDisparoHora) {
			// Obtenemos la primera bala
			var bala = game.balas.getFirstExists(false);
			if (bala) {
				game.sfxDisparo.play();
				// Y la lanzamos desde la ubicación de la nave
				bala.reset(game.nave.x, game.nave.y + 8);
				bala.body.velocity.y = -400;
				game.naveDisparoHora = game.time.now + game.naveBalasRatio;
			}
		}
	},

	/**
	 * Función usada para girar la nave y dar la sensación de movilidad
	 * @method girarNave
	 */
	girarNave: function() {
		// Dependiendo de la velocidad en el eje x de la nave
		var giro = game.nave.body.velocity.x / 1000;
		game.nave.scale.x = 1 - Math.abs(giro) / 2;
		// La movemos angularmente para girarla mientras nos desplazamos
		game.nave.angle = giro * 30;
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
		game.world.bringToTop(game.puntosTexto);
		game.world.bringToTop(game.vidasTexto);
		game.world.bringToTop(game.btnVolver);
		game.world.bringToTop(game.btnSilenciar);
	}
}
