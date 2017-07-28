// Variable estado usada para cargar el juego en sí
var playState = {
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
			// Asignamos movimiento vertical de fondo y velocidad de nave
			game.fondo.tilePosition.y += 2;
			game.nave.body.velocity.setTo(0, 0);
			// Controlamos el movimiento de la nave
			if (game.cursores.left.isDown) {
				game.nave.body.velocity.x = -game.naveVelocidad;
			} else if (game.cursores.right.isDown) {
				game.nave.body.velocity.x = game.naveVelocidad;
			}
			// Controlamos eventos de juego
			if (game.botonDisparo.isDown) {
				this.dispararBala();
			}
			if (game.time.now > game.alienDisparoHora) {
				this.disparoEnemigo();
			}
			// Giramos la imagen de la nave y movemos estrellas para dar sensación de movimiento
			this.girarNave();
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
			// Llamamos a la función win para lanzar su estado
			this.win();
		}
	},

	/**
	 * Función usada para gestionar las colisiones producidas entre las balas enemigas y nuestra nave
	 * @method manejadorDisparoEnemigo
	 * @param {} nave
	 * @param {} bala
	 */
	manejadorDisparoEnemigo: function(nave, bala) {
		bala.kill();
		game.sfxExplosion.play();
		vida = game.vidas.getFirstAlive();
		if (vida) {
			vida.kill();
		}
		
		var explosion = explosiones.getFirstExists(false);
		explosion.reset(nave.body.x, nave.body.y);
		explosion.play('boom', 30, false, true);
		
		if (game.vidas.countLiving() < 1) {
			nave.kill();
			game.balasAlien.callAll('kill');
			game.tweens.remove(game.movimientoAlienX);
			game.time.events.remove(game.movimientoAlienY);
			game.textoResultado.text = " Has Perdido. \n Click para reiniciar";
			game.textoResultado.visible = true;
			// Definimos la variable que captura la pulsación de la tecla intro
			var intro = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			// Y le asignamos un evento para que comience el juego al pulsarla
			intro.onDown.addOnce(this.reiniciar, this);
		}
	},

	/**
	 * Función usada para gestionar las colisiones producidas entre nuestra nave y las ayudas
	 * @method manejadorColisionNaveAyuda
	 * @param {} nave
	 * @param {} ayuda
	 */
	manejadorColisionNaveAyuda: function(nave, ayuda) {
		ayuda.kill();
		game.sfxAyuda.play();
		if (ayuda.name == "mejoraVida") {
			if (game.vidas.countLiving() < 3) {
				var naveImagen = game.vidas.create(game.world.width - 100 + ((game.vidas.countLiving() == 1) ? 30 : 0), 60, 'nave');
				naveImagen.anchor.setTo(0.5, 0.5);
				naveImagen.angle = 90;
				naveImagen.alpha = 0.4;
			}
		} else if (ayuda.name == "mejoraArma") {
			game.naveBalasRatio /= 1.5;
		} else if (ayuda.name == "mejoraVelocidad") {
			game.naveVelocidad *= 1.5;
		}
	},

	/**
	 * Función usada para crear e inicializar las variables de la interfaz de juego
	 * @method cargarInterfaz
	 */
	cargarInterfaz: function() {
		// Agregamos imagen de fondo a tablero
		game.fondo = game.add.tileSprite(0, 0, 800, 600, 'fondo');
		// Variables con textos y puntos mostrados por pantalla
		game.puntos = 0;
		game.puntosTexto = game.add.text(10, 10, 'Puntos: ' + game.puntos, { font: '34px Arial', fill: '#fff' });
		game.vidas = game.add.group();
		game.add.text(game.world.width - 115, 10, 'Vidas: ', { font: '34px Arial', fill: '#fff' });
		game.textoResultado = game.add.text(game.world.centerX, game.world.centerY,' ', { font: '64px Arial', fill: '#fff' });
		game.textoResultado.anchor.setTo(0.5, 0.5);
		game.textoResultado.visible = false;
		// Mostramos las vidas del jugador
		for (var i = 0; i < 3; i++) {
			var naveImagen = game.vidas.create(game.world.width - 100 + (30 * i), 60, 'nave');
			naveImagen.anchor.setTo(0.5, 0.5);
			naveImagen.angle = 90;
			naveImagen.alpha = 0.4;
		}
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
		game.naveBalasRatio = 300;
		game.naveDisparoHora = 0;
		// Variables referentes a las balas de nuestra nave
		game.balas = game.add.group();
		game.balas.enableBody = true;
		game.balas.physicsBodyType = Phaser.Physics.ARCADE;
		game.balas.createMultiple(30, 'bala');
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
		
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 10; x++) {
				var alien = game.aliens.create(x * 48, y * 50, 'alien');
				alien.anchor.setTo(0.5, 0.5);
				alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
				alien.play('fly');
				alien.body.moves = false;
			}
		}
		
		game.aliens.x = 100;
		game.aliens.y = 50;	
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
		var balaAlien = game.balasAlien.getFirstExists(false);
		game.alienVivos.length = 0;
		game.aliens.forEachAlive(function(alien){
			//game.alienVivos.push(alien);
		});

		if (balaAlien && game.alienVivos.length > 0) {
			var aleatorio = game.rnd.integerInRange(0, game.alienVivos.length-1);
			var seleccion = game.alienVivos[aleatorio];
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
		var aleatorio = Math.random();
		if (aleatorio < 0.06) {
			var mejora = "mejoraVida";
			if (aleatorio < 0.04) {
				mejora = "mejoraArma";
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
		var objeto = game.ayudas.create(locX, locY, tipoMejora);
		objeto.name = tipoMejora;
		objeto.body.collideWorldBounds = false;
		objeto.alpha = 0.4;
		game.physics.arcade.gravity.y = 50;
	},

	/**
	 * Función usada para disparar balas desde nuestra nave
	 * @method dispararBala
	 */
	dispararBala: function() {
		if (game.time.now > game.naveDisparoHora) {
			var bala = game.balas.getFirstExists(false);
			if (bala) {
				game.sfxDisparo.play();
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
		var giro = game.nave.body.velocity.x / 1000;
		game.nave.scale.x = 1 - Math.abs(giro) / 2;
		game.nave.angle = giro * 30;
	},

	/**
	 * Función usada para reiniciar el juego una vez hayamos perdido o ganado la partida
	 * @method reiniciar
	 */
	reiniciar: function() {
		game.vidas.callAll('revive');
		game.aliens.removeAll();
		this.cargarAliens();
		game.nave.revive();
		game.textoResultado.visible = false;
	},
	
	/**
	 * Método usado para cargar el estado win
	 * @method Win
	 */
	win: function() {
		// Lanzamos el estado win
		game.state.start('win');
	}
}
