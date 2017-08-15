// Variable estado usada para cargar el nivel 1 del juego
var level1State = {
	/**
	 * Metodo usado para cargar el juego
	 * @method create
	 */
    create: function() {
		// Cargamos e iniciamos las diferentes variables usadas por el juego
		this.cargarInterfaz();
		this.cargarNave();
		this.cargarAliens();
		this.cargarMuros();
		this.cargarAnimaciones();
		this.cargarAudios();
		this.cargarControles();
    },
	
	/**
	 * Metodo ejecutado cada frame para actualizar la logica del juego
	 * @method update
	 */
    update: function() {
		// Si la nave esta viva
		if (game.nave.alive) {
			game.nave.body.velocity.setTo(0, 0);
			// Si estamos en el movil
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
			// Giramos nave, sincronizamos estela y estrellas
			this.girarNave();
			game.naveEstela.x = game.nave.x;
			game.global.actualizarEstrellas();
			// Controlamos colisiones de objetos en sus diferentes metodos
			game.physics.arcade.overlap(game.nave, game.ayudas, this.manejadorColisionNaveAyuda, null, this);
			game.physics.arcade.overlap(game.balas, game.aliens, this.manejadorDisparoNave, null, this);
			game.physics.arcade.overlap(game.balasAlien, game.nave, this.manejadorDisparoEnemigo, null, this);
			game.physics.arcade.overlap(game.nave, game.aliens, this.manejadorColisionNaveAlien, null, this);
			game.physics.arcade.overlap(game.balasAlien, game.muros, this.manejadorColisionMuro, null, this);
			game.physics.arcade.overlap(game.balas, game.muros, this.manejadorColisionMuro, null, this);
			game.physics.arcade.overlap(game.balas, game.invasor, this.manejadorColisionInvasor, null, this);
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
		// Si no quedan aliens llamamos al método ganarPartida
		if (game.aliens.countLiving() == 0) {
			this.ganarPartida();
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
		vida = game.vidas.getAt(game.vidas.length-1);
		// Si tenemos vidas eliminamos una
		if (vida) {
			vida.destroy();
		}
		// Mostramos la animación de explosión en las coordenadas de nuestra nave
		var explosion = game.explosiones.getFirstExists(false);
		explosion.reset(nave.body.x, nave.body.y);
		explosion.play('boom', 20, false, true);
		// Si no nos quedan vidas llamamos al método perderPartida
		if (game.vidas.countLiving() < 1) {
			this.perderPartida(nave);
		}
	},

	/**
	 * Función usada para gestionar las colisiones producidas entre nuestra nave y las ayudas
	 * @method manejadorColisionNaveAyuda
	 * @param {} nave
	 * @param {} ayudaPuntos
	 */
	manejadorColisionNaveAyuda: function(nave, ayudaPuntos) {
		// Eliminamos ayuda y reproducimos sonido
		ayudaPuntos.kill();
		game.sfxAyuda.play();
		// Agregamos puntos a marcador y reproducimos audio
		game.puntos += parseInt(ayudaPuntos.name);
		game.puntosTexto.text = 'Puntos: ' + game.puntos;
	},

	/**
	 * Función usada para gestionar las colisiones producidas entre nuestra nave y los aliens
	 * @method manejadorColisionNaveAlien
	 * @param {} nave
	 * @param {} alien
	 */
	manejadorColisionNaveAlien: function(nave, alien) {
		// Eliminamos alien, reproducimos sonido y agregamos puntos a marcador
		alien.kill();
		game.sfxExplosion.play();
		game.puntos += 20;
		game.puntosTexto.text = 'Puntos: ' + game.puntos;
		vida = game.vidas.getFirstAlive();
		// Si tenemos vidas eliminamos una
		if (vida) {
			vida.kill();
		}
		// Mostramos la animación de explosión en las coordenadas de nuestra nave
		var explosion = game.explosiones.getFirstExists(false);
		explosion.reset(nave.body.x, nave.body.y);
		explosion.play('boom', 20, false, true);
		// Si no nos quedan vidas llamamos al método perderPartida
		if (game.vidas.countLiving() < 1) {
			this.perderPartida(nave);
		// Si no quedan aliens llamamos al método ganarPartida
		} else if (game.aliens.countLiving() == 0) {
			this.ganarPartida();
		}
	},
	
	/**
	 * Función usada para gestionar las colisiones producidas entre las balas y los muros
	 * @method manejadorColisionMuro
	 * @param {} bala
	 * @param {} muro
	 */
	manejadorColisionMuro: function(bala, muro) {
		var factorRedondeo = 3;
		// Obtenemos elemento colisionado, referencia de puntos de colisión y colores alrededor de ese punto
 		var muroMapa = game.muroMapas[game.muros.getChildIndex(muro)];
		var puntoX = Math.round(bala.x - muroMapa.worldX);
		var puntoY = Math.round(bala.y - muroMapa.worldY);
		var colorMapaCen = muroMapa.bmp.getPixelRGB(puntoX, puntoY);
		var colorMapaIzq = muroMapa.bmp.getPixelRGB(puntoX - factorRedondeo, puntoY);
		var colorMapaDer = muroMapa.bmp.getPixelRGB(puntoX + factorRedondeo, puntoY);
		var colorMapaArr = muroMapa.bmp.getPixelRGB(puntoX, puntoY + factorRedondeo);
		var colorMapaAba = muroMapa.bmp.getPixelRGB(puntoX, puntoY - factorRedondeo);
		// Si el canal rojo indica que no hemos destruído esa zona del mapa de bits
		if (colorMapaCen.r > 0 || colorMapaIzq.r > 0 || colorMapaDer.r > 0 || colorMapaArr.r > 0 || colorMapaAba.r > 0) {
			// Pintamos la colisión, reproducimos audio y destruímos la bala
			muroMapa.bmp.draw(game.muroDanio, puntoX - 8, puntoY - 8);
			muroMapa.bmp.update();
			game.sfxMuro.play();
			bala.kill();
		}
	},
	
	/**
	 * Función usada para gestionar las colisiones producidas entre las balas y el invasor superior
	 * @method manejadorColisionInvasor
	 * @param {} bala
	 * @param {} invasor
	 */
	manejadorColisionInvasor: function(bala, invasor) {
		// Eliminamos bala y reproducimos sonido
		bala.kill();
		game.sfxExplosion.play();
		// Mostramos la animación de explosión en las coordenadas del invasor
		var explosion = game.explosiones.getFirstExists(false);
		explosion.reset(invasor.body.x, invasor.body.y);
		explosion.play('boom', 20, false, true);
		// Lanzamos paquete de puntos y eliminamos al insavor
		this.cargarPowerUp('500', invasor.body.x, invasor.body.y);
		game.sfxInvasor.stop();
		invasor.kill();
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
		game.sfxInvasor.stop();
		game.state.start('menu');
	},
	
	/**
	 * Función usada para controlar el evento click en el botón silenciar
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
		game.mapaTitulo = game.add.bitmapText(game.world.centerX - 100, 450, 'gem', '', 36);
		game.global.mostrarLetraPorLetraNivel(game.mapaTitulo, '  Nivel 1    ');
		game.puntosTexto = game.add.bitmapText(10, 10, 'gem', 'Puntos: ' + game.puntos, 32);
		game.vidas = game.add.group();
		game.vidasTexto = game.add.bitmapText(game.world.width - 140, 10, 'gem', 'Escudos: ', 32);
		// Mostramos las vidas del jugador
		for (var i = 0; i < game.nivelNaveEscudo; i++) {
			var img = game.vidas.create(game.world.width - 135 + (23 * i), 60, 'nave');
			img.anchor.setTo(0.5, 0.5);
			img.angle = 90;
			img.alpha = 0.4;
		}
		// Agregamos botón volver y silenciar junto con sus manejadores para controlar sus eventos
		game.btnVolver = game.add.button(game.world.left + 10, game.world.height - 50, 'botonVolverPeq', this.manejadorClickBotonVolver, this, 0, 1, 0);
		game.btnVolver.onInputOver.add(this.manejadorOverBoton, this);
		game.btnSilenciar = game.add.button(game.world.right - 40, game.world.height - 50, 'botonSilenciar', this.manejadorClickBotonSilenciar, this, 0, 1, 0);
		game.btnSilenciar.onInputOver.add(this.manejadorOverBoton, this);
		game.global.cargarEstrellas();
	},
	
	/**
	 * Función usada para crear e inicializar las variables de nuestra nave
	 * @method cargarNave
	 */
	cargarNave: function() {
		// Variables de nuestra nave
		game.nave = game.add.sprite(game.world.centerX, game.world.height - 100, 'nave');
		game.nave.anchor.setTo(0.5, 0.5);
		game.physics.enable(game.nave, Phaser.Physics.ARCADE);
		game.nave.body.collideWorldBounds = true;
		game.naveDisparoHora = 0;
		// Creamos una estela que sigue a la nave
		game.naveEstela = game.add.emitter(game.nave.x, game.nave.y + 10, 400);
		game.naveEstela.width = 10;
		game.naveEstela.makeParticles('bala');
		game.naveEstela.setXSpeed(30, -30);
		game.naveEstela.setYSpeed(200, 180);
		game.naveEstela.setRotation(50,-50);
		game.naveEstela.setAlpha(1, 0.01, 800);
		game.naveEstela.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
		game.naveEstela.start(false, 5000, 10);
		// Asignamos una explosión grande para cuando seamos vencidos
		game.naveMuerte = game.add.emitter(game.nave.x, game.nave.y);
		game.naveMuerte.width = 50;
		game.naveMuerte.height = 50;
		game.naveMuerte.makeParticles('boom', [0,1,2,3,4,5,6,7], 10);
		game.naveMuerte.setAlpha(0.9, 0, 800);
		game.naveMuerte.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);
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
		game.alienVelocidad = 4000;
		game.alienVivos = [];
		// Cargamos en filas de 4 y columnas de 10 a los enemigos
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 10; x++) {
				var alien = game.aliens.create(x * 48, y * 50, 'alien');
				alien.anchor.setTo(0.5, 0.5);
				alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
				alien.play('fly');
				alien.body.moves = false;
				// Agregamos movimiendo de vaivén en aliens
				game.add.tween(alien).to( { y: alien.body.y + 5 }, 500, Phaser.Easing.Sinusoidal.InOut, true, game.rnd.integerInRange(0, 500), 1000, true);
			}
		}
		// Asignamos coordenadas iniciales a grupo de enemigos de tipo alien
		game.aliens.x = 100;
		game.aliens.y = 120;
		// Agregamos los eventos de movimiento horizontal y vertical para los aliens
		game.add.tween(game.aliens).to( { x: 500 }, game.alienVelocidad, Phaser.Easing.Sinusoidal.InOut, true, 0, game.alienVelocidad, true);
		game.time.events.loop(game.alienVelocidad * 2, function() { this.descender(30); }, this);
		// Variables referentes a las balas de los aliens
		game.balasAlien = game.add.group();
		game.balasAlien.enableBody = true;
		game.balasAlien.physicsBodyType = Phaser.Physics.ARCADE;
		game.balasAlien.createMultiple(30, 'balaAlien');
		game.balasAlien.setAll('anchor.x', 0.5);
		game.balasAlien.setAll('anchor.y', 1);
		game.balasAlien.setAll('outOfBoundsKill', true);
		game.balasAlien.setAll('checkWorldBounds', true);
		var tMin = 10;
		var tMax = 30;
		// Generamos disparador de evento de forma aleatoria entre los segundos 10 y 30 de juego
		var tiempo = Math.floor(Math.random() * (tMax - tMin + 1) + tMin);
		game.time.events.add(Phaser.Timer.SECOND * tiempo, this.cargarAlienTop, this);
	},
	
	/**
	 * Función usada para crear y configurar el alien que aparece en la parte superior de la pantalla
	 * @method cargarAliens
	 */
	cargarAlienTop: function() {
		// Configuramos los parámetros iniciales del invasor
		game.invasor = game.add.sprite(0, 80, 'invasor');
		game.invasor.anchor.setTo(0.5, 0.5);
		game.physics.enable(game.invasor, Phaser.Physics.ARCADE);
		game.invasor.body.collideWorldBounds = false;
		game.physics.arcade.enable(game.invasor);
		game.invasor.body.allowGravity = false;
		var bucle = 1;
		// Le asignamos los eventos de movimiento para que sólo se produzca un bucle de transición hasta que desaparezca
		movimientoAlienTop = game.add.tween(game.invasor).to( { x: game.width - game.invasor.width }, game.alienVelocidad * 5, Phaser.Easing.Linear.None, true, 0, game.alienVelocidad, true);
		movimientoAlienTop.onRepeat.add( function() { if (bucle == 0) { game.tweens.remove(movimientoAlienTop); game.invasor.kill(); } bucle--; }, this);
		game.sfxInvasor.play();
	},
	
	/**
	 * Función usada para cargar los muros utilizados para proteger a la nave
	 * @method cargarMuros
	 */
	cargarMuros: function() {
		// Cargamos valores iniciales
		var totalBases = 4;
		var muroY = game.world.height - 170;
		var ancho = 48;
		var alto = 32;
		// Creamos grupo de muros y mapas de bits para almacenar las imagénes a mostrar
        game.muros = game.add.group();
        game.muros.enableBody = true;
        game.muroDanio = game.make.bitmapData(ancho, alto);
        game.muroDanio.circle(8, 8, 8, 'rgba(0, 27, 7, 1)');  // rgba(255,0,255,0.2)
        game.muroMapas = [];
		// Creamos tantos muros en pantalla como hayamos descrito
        for (var x = 1; x <= totalBases; x++) {
            var muroMapa = game.make.bitmapData(ancho, alto);
            muroMapa.draw('muro', 0, 0, ancho, alto);
            muroMapa.update();
			// Posicionamos los muros y les agregamos y configuramos el sistema de físicas
            var muroX = (x * game.width / (totalBases + 1)) - (ancho / 2);
            var muro = game.add.sprite(muroX, muroY, muroMapa);
			game.physics.arcade.enable(muro);
			muro.body.allowGravity = false;
            game.muros.add(muro);
            game.muroMapas.push( { bmp: muroMapa, worldX: muroX, worldY: muroY });
        }
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
		game.sfxMuro = game.add.audio('muro');
		game.sfxInvasor = game.add.audio('invasor');
	},
	
	/**
	 * Función usada para crear y cargar los controles de juego 
	 * @method cargarControles
	 */
	cargarControles: function() {
		// Preparamos los cursores y controles de juego
		game.cursores = game.input.keyboard.createCursorKeys();
		game.botonDisparo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		// Si ejecutamos la aplicacion desde el movil
		if (!game.escritorio) {
			// Agregamos un pad virtual con su joystick y botón
			game.gamepad = game.plugins.add(Phaser.Plugin.VirtualGamepad);
			game.joystick = game.gamepad.addJoystick(game.world.left + 150, game.world.height - 100, 1.2, 'gamepad');
			game.botonA = game.gamepad.addButton(game.world.right - 150, game.world.height - 100, 1.0, 'gamepad');
		}
		// Posicionamos por encima botones y texto mostrados
		game.world.bringToTop(game.balas);
		game.world.bringToTop(game.balasAlien);
		game.world.bringToTop(game.ayudas);
		game.world.bringToTop(game.aliens);
		game.world.bringToTop(game.puntosTexto);
		game.world.bringToTop(game.vidasTexto);
		game.world.bringToTop(game.btnVolver);
		game.world.bringToTop(game.btnSilenciar);
	},	
	
	/**
	 * Función usada para configurar objetos agregándoles una animación
	 * @method configurarExplosion
	 * @param {} objeto
	 */
	configurarExplosion: function(objeto) {
		objeto.alpha = 0.7;
		objeto.anchor.x = 0.5;
		objeto.anchor.y = 0.5;
		objeto.animations.add('boom');
	},

	/**
	 * Función usada para controlar el descenso de los enemigos de tipo alien
	 * @method descender
	 * @param {} descensoY
	 */
	descender: function(descensoY) {
		game.add.tween(game.aliens).to( { y: game.aliens.y + descensoY }, 2500, Phaser.Easing.Linear.None, true, 0, 0, false);
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
			// Y lanzamos la bala desde su posicion hacia nuestra nave
			balaAlien.reset(seleccion.body.x, seleccion.body.y);
			game.physics.arcade.moveToObject(balaAlien, game.nave, 300);
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
		// Obtenemos un número aleatorio entre 0 y 1 y si es menor que 0.15 lanzamos una mejora
		var aleatorio = Math.random();
		if (aleatorio < 0.15) {
			// Inicialmente cargamos una mejora con 100 puntos
			var mejora = "100";
			// Si el número está entre 0.05 y 0.1 cargamos una mejora de 200 puntos
			if (aleatorio > 0.05 && aleatorio < 0.1) {
				mejora = "200";
			// Si es menor de 0.05 cargamos una mejora de 300 puntos
			} else if (aleatorio <= 0.05) {
				mejora = "300";
			}
			this.cargarPowerUp(mejora, alien.body.x, alien.body.y);
		}
	},

	/**
	 * Función usada para cargar la ayuda en pantalla a partir de su nombre y localizacion
	 * @method cargarPowerUp
	 * @param {} tipoMejora
	 * @param {} locX
	 * @param {} locY
	 */
	cargarPowerUp: function(tipoMejora, locX, locY) {
		// Creamos una mejora del tipo especificado desde la localizacion concretada
		var objeto = game.ayudas.create(locX, locY, tipoMejora);
		objeto.name = tipoMejora;
		objeto.body.collideWorldBounds = false;
		objeto.alpha = 0.4;
		// Le agregamos velocidad
		objeto.body.velocity.y = 100;
		objeto.body.gravity.y = Math.random() * 100;
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
				// Y la lanzamos desde la ubicacion de la nave
				bala.reset(game.nave.x, game.nave.y + 8);
				bala.body.velocity.y = -400;
				game.naveDisparoHora = game.time.now + game.naveBalasRatio;
			}
		}
	},
	
	/**
	 * Función usada para girar la nave y dar la sensacion de movilidad
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
	 * Función usada para gestionar la partida perdida
	 * @method perderPartida
	 * @param {} nave
	 */
	perderPartida: function(nave) {
		// Eliminamos la nave y removemos demás elementos de juego
		nave.kill();
		game.naveEstela.kill();
		game.sfxInvasor.stop();
		game.balasAlien.callAll('kill');
		game.naveMuerte.x = nave.x;
		game.naveMuerte.y = nave.y;
		game.naveMuerte.start(false, 1000, 10, 10);
		// Lanzamos estado lose tras 2 segundos de delay
		game.time.events.add(2000, function() {
			game.state.start('lose');
		});
	},
	
	/**
	 * Función usada para gestionar la partida ganada
	 * @method ganarPartida
	 */
	ganarPartida: function() {
		// Agregamos puntos a marcador
		game.puntos += 500;
		game.puntosTexto.text = 'Puntos: ' + game.puntos;
		game.balasAlien.callAll('kill', this);
		game.sfxInvasor.stop();
		game.siguienteNivel = 'level2';
		// Lanzamos estado levelUp tras 2 segundos de delay
		game.time.events.add(2000, function() {
			game.state.start('levelUp');
		});
	}
}
