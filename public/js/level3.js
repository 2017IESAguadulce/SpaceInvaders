// Variable estado usada para cargar el nivel 3 del juego
var level3State = {
	/**
	 * Metodo usado para cargar el juego
	 * @method create
	 */
    create: function() {
		// Cargamos e iniciamos las diferentes variables usadas por el juego
		this.cargarInterfaz();
		this.cargarNave();
		this.cargarJefe();
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
			game.jefe.body.acceleration.x = 0;
			// Si el jefe esta vivo gestionamos su lógica
			if (game.jefe.alive) {
				//game.jefe.rayLeft.update();
				//game.jefe.rayRight.update();
				if (game.jefe.y > 140) {
					game.jefe.body.acceleration.y = -80;
				} else if (game.jefe.y < 140) {
					game.jefe.body.acceleration.y = 80;
				}
				if (game.jefe.x > game.nave.x + 50) {
					game.jefe.body.acceleration.x = -50;
				} else if (game.jefe.x < game.nave.x - 50) {
					game.jefe.body.acceleration.x = 50;
				} else {
					game.jefe.body.acceleration.x = 0;
				}
				// Creamos efecto de rotación en jefe para simular movimiento
				var rotacion = game.jefe.body.velocity.x / 400;
				game.jefe.scale.x = 0.6 - Math.abs(rotacion) / 3;
				game.jefe.angle = 180 - rotacion * 20;
				game.jefeEstela.x = game.jefe.x + -5 * rotacion;
				game.jefeEstela.y = game.jefe.y + 10 * Math.abs(rotacion) - game.jefe.height / 2;
				// Capturamos ángulos para lanzar el disparo del jefe si la nave está en posición
				var anguloHaciaJugador = game.math.radToDeg(game.physics.arcade.angleBetween(game.jefe, game.nave)) - 90;
				var puntoAngular = 180 - Math.abs(game.jefe.angle);
				if (puntoAngular - anguloHaciaJugador < 18) {
					this.disparoJefe();
				}
			}
			// Gestionamos movimiento de nave si estamos en una plataforma móvil
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
			// Giramos nave, sincronizamos estela y estrellas
			this.girarNave();
			game.naveEstela.x = game.nave.x;
			game.global.actualizarEstrellas();
			// Controlamos colisiones de objetos en sus diferentes metodos
			game.physics.arcade.overlap(game.jefe, game.balas, this.manejadorDisparoNave, this.comprobarColisionJefe, this);
			//game.physics.arcade.overlap(game.nave, game.jefe.rayLeft, this.manejadorDisparoJefe, null, this);
			//game.physics.arcade.overlap(game.nave, game.jefe.rayRight, this.manejadorDisparoJefe, null, this);
			game.physics.arcade.overlap(game.nave, game.rayo, this.manejadorDisparoJefe, null, this);
			//game.physics.arcade.overlap(game.nave, game.rayoDer, this.manejadorDisparoJefe, null, this);
			//game.physics.arcade.overlap(game.nave, game.rayoIzq, this.manejadorDisparoJefe, null, this);
			game.physics.arcade.overlap(game.nave, game.jefe.rayoDer, this.manejadorDisparoJefe, null, this);
			game.physics.arcade.overlap(game.nave, game.jefe.rayoIzq, this.manejadorDisparoJefe, null, this);
			//game.physics.arcade.overlap(game.balasAlien, game.nave, this.manejadorDisparoEnemigo, null, this);
			//game.physics.arcade.overlap(game.balasAlien, game.muros, this.manejadorColisionMuro, null, this);
			game.physics.arcade.overlap(game.balas, game.muros, this.manejadorColisionMuro, null, this);
			// Posicionamos por encima botones y texto mostrados
			game.world.bringToTop(game.balas);
			game.world.bringToTop(game.puntosTexto);
			game.world.bringToTop(game.vidasTexto);
			game.world.bringToTop(game.btnVolver);
			game.world.bringToTop(game.btnSilenciar);
		}
	},
	
	/**
	 * Función usada para gestionar las colisiones producidas entre nuestras balas y el jefe
	 * @method manejadorDisparoNave
	 * @param {} jefe
	 * @param {} bala
	 */
	manejadorDisparoNave: function(jefe, bala) {
		// Eliminamos bala y alien colisionados
		bala.kill();
		game.sfxExplosion.play();
		// Lanzamos animación de impacto en el jefe
		var explosion = game.explosiones.getFirstExists(false);
		explosion.reset(bala.body.x + bala.body.halfWidth, bala.body.y + bala.body.halfHeight);
		explosion.alpha = 0.7;
		explosion.play('boom', 30, false, true);
		// Asignamos daño y comprobamos si hemos destruído al jefe
		jefe.vida -= jefe.danioRecibido;
		if (jefe.vida < 1) {
			this.destruirJefe();
		}
	},
	
	/**
	 * Función usada para gestionar las colisiones producidas entre las balas del jefe y nuestra nave
	 * @method manejadorDisparoJefe
	 * @param {} nave
	 * @param {} bala
	 */
	manejadorDisparoJefe: function(nave, bala) {
		console.log("manejadorDisparoJefe");
		// Eliminamos bala y reproducimos sonido
		bala.kill();
		game.sfxExplosion.play();
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
			//game.playerDeath.x = nave.x;
			//game.playerDeath.y = nave.y;
			//game.playerDeath.start(false, 1000, 10, 10);
			this.perderPartida(nave);
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
		this.mostrarLetraPorLetra(game.mapaTitulo, '  Nivel 3    ');
		game.puntosTexto = game.add.text(10, 10, 'Puntos: ' + game.puntos, { font: '34px Arial', fill: '#fff' });
		game.vidas = game.add.group();
		game.vidasTexto = game.add.text(game.world.width - 140, 10, 'Escudos: ', { font: '30px Arial', fill: '#fff' });
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
		// Variables referentes a las balas de nuestra nave
		game.balas = game.add.group();
		game.balas.enableBody = true;
		game.balas.physicsBodyType = Phaser.Physics.ARCADE;
		game.balas.createMultiple(20, 'bala');
		game.balas.setAll('anchor.x', 0.5);
		game.balas.setAll('anchor.y', 1);
		game.balas.setAll('outOfBoundsKill', true);
		game.balas.setAll('checkWorldBounds', true);
		//game.physics.arcade.gravity.y = 50;
	},
	
	/**
	 * Función usada para crear e inicializar los parámetos del jefe de nivel
	 * @method cargarJefe
	 */
	cargarJefe: function() {
		game.jefe = game.add.sprite(0, 0, 'boss');
		game.jefe.exists = false;
		game.jefe.alive = false;
		game.jefe.dying = false;	
		game.jefe.danioRecibido = 50;	
		game.jefe.anchor.setTo(0.5, 0.5);
		game.jefe.angle = 180;
		game.jefe.scale.x = 0.6;
		game.jefe.scale.y = 0.6;
		game.horaDisparoJefe = 0;
		game.physics.enable(game.jefe, Phaser.Physics.ARCADE);
		game.jefe.body.maxVelocity.setTo(100, 80);
		// Variables relativas a las estelas del jefe
		game.jefeEstela = game.add.emitter(game.jefe.body.x, game.jefe.body.y - game.jefe.height / 2);
		game.jefeEstela.width = 0;
		game.jefeEstela.makeParticles('jefeEstela');
		game.jefeEstela.forEach(function(p) {
			// Creamos 2 estelas con valores aleatorios para la cola de la nave del jefe
			p.crop({x: 120, y: 0, width: 45, height: 50});
			p.anchor.x = game.rnd.pick([1,-1]) * 0.95 + 0.5;
			p.anchor.y = 0.75;
		});
		game.jefeEstela.setXSpeed(0, 0);
		game.jefeEstela.setRotation(0,0);
		game.jefeEstela.setYSpeed(-30, -50);
		game.jefeEstela.gravity = 0;
		game.jefeEstela.setAlpha(1, 0.1, 400);
		game.jefeEstela.setScale(0.3, 0, 0.7, 0, 5000, Phaser.Easing.Quadratic.Out);
		game.jefe.bringToTop();
		// Asignamos una explosión grande para cuando venzamos al jefe
		game.bossDeath = game.add.emitter(game.jefe.x, game.jefe.y);
		game.bossDeath.width = game.jefe.width / 2;
		game.bossDeath.height = game.jefe.height / 2;
		game.bossDeath.makeParticles('boom', [0,1,2,3,4,5,6,7], 20);
		game.bossDeath.setAlpha(0.9, 0, 900);
		game.bossDeath.setScale(0.3, 1.0, 0.3, 1.0, 1000, Phaser.Easing.Quintic.Out);
		
		game.rayoIzq = game.add.group();
		game.rayoIzq.enableBody = true;
		game.rayoIzq.physicsBodyType = Phaser.Physics.ARCADE;
		game.rayoIzq.createMultiple(5, 'rayoMuerte');
		game.rayoIzq.setAll('anchor.x', 0.5);
		game.rayoIzq.setAll('anchor.y', 1);
		game.rayoIzq.setAll('outOfBoundsKill', true);
		game.rayoIzq.setAll('checkWorldBounds', true);
		game.rayoDer = game.add.group();
		game.rayoDer.enableBody = true;
		game.rayoDer.physicsBodyType = Phaser.Physics.ARCADE;
		game.rayoDer.createMultiple(5, 'rayoMuerte');
		game.rayoDer.setAll('anchor.x', 0.5);
		game.rayoDer.setAll('anchor.y', 1);
		game.rayoDer.setAll('outOfBoundsKill', true);
		game.rayoDer.setAll('checkWorldBounds', true);
		
		this.iniciarJefe();
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
		game.sfxDisparo = game.add.audio('disparo');
		game.sfxExplosion = game.add.audio('explosion');
		game.sfxMuro = game.add.audio('muro');
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
			game.joystick = game.gamepad.addJoystick(150, 500, 1.2, 'gamepad');
			game.botonA = game.gamepad.addButton(650, 500, 1.0, 'gamepad');
		}
	},	
	
	/**
	 * Función usada para lanzar al jefe del nivel
	 * @method iniciarJefe
	 */
	iniciarJefe: function() {
		game.jefe.reset(game.width / 2, -game.jefe.height);
		game.jefeEstela.start(false, 1000, 10);
		game.jefe.vida = 500;
		game.horaDisparoJefe = game.time.now + 5000;
	},
	
	/**
	 * Función usada para gestionar la destrucción del jefe de nivel
	 * @method destruirJefe
	 */
	destruirJefe: function() {
		// Si el jefe no esta muerto
		if (!game.jefe.dying) {
			// Actualizamos valores de referencia
			game.jefe.dying = true;
			game.bossDeath.x = game.jefe.x;
			game.bossDeath.y = game.jefe.y;
			game.bossDeath.start(false, 1000, 50, 20);
			// Y destruímos a jefe tras animación
			game.time.events.add(1000, function() {
				// Lanzamos animación de explosión en el jefe
				var explosion = game.explosiones.getFirstExists(false);
				var auxEscalaX = game.explosiones.scale.x;
				var auxEscalaY = game.explosiones.scale.y;
				var auxAlfa = game.explosiones.alpha;
				explosion.reset(game.jefe.body.x + game.jefe.body.halfWidth, game.jefe.body.y + game.jefe.body.halfHeight);
				explosion.alpha = 0.4;
				explosion.scale.x = 3;
				explosion.scale.y = 3;
				var animacion = explosion.play('boom', 30, false, true);
				animacion.onComplete.addOnce(function(){
					explosion.scale.x = auxEscalaX;
					explosion.scale.y = auxEscalaY;
					explosion.alpha = auxAlfa;
				});
				game.jefe.kill();
				game.jefeEstela.kill();
				game.jefe.dying = false;
				game.bossDeath.on = false;
				
			});
			// Lanzamos función ganarPartida tras 3 segundos de delay
			game.time.events.add(3000, this.ganarPartida);
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
	 * Función usada para comprobar la correcta colisión de las balas contra el jefe
	 * @method comprobarColisionJefe
	 * @param {} jefe
	 * @param {} bala
	 */
	comprobarColisionJefe: function(jefe, bala) {
		if ((bala.x > jefe.x + jefe.width / 5 && bala.y > jefe.y) ||
			(bala.x < jefe.x - jefe.width / 5 && bala.y > jefe.y)) {
			return false;
		} else {
			return true;
		}
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
	 * Función usada para controlar los disparos del jefe de nivel
	 * @method disparoJefe
	 */
	disparoJefe: function() {
		if (game.time.now > game.horaDisparoJefe) {
			// Lanzamos animaciones para mostrar los rayos
			this.animacionCargaDisparo('Right');
			this.animacionCargaDisparo('Left');
			game.horaDisparoJefe = game.time.now + 3000;
		}
	},
	
	/**
	 * Función usada para cargar la animación de carga y disparo del jefe
	 * @method animacionCargaDisparo
	 * @param {} lado
	 */
	animacionCargaDisparo: function(lado) {
		this.crearRayo(1);
		this.crearRayo(-1);
		if (lado == 'Right') {
			game.jefe.rayoDer = game.rayo;
		} else {
			game.jefe.rayoIzq = game.rayo;
		}
		rayo = game.jefe['ray' + lado];
		rayo.name = lado;
		rayo.revive();
		rayo.y = 80;
		rayo.alpha = 0;
		rayo.scale.y = 13;
		//rayo.reset(game.jefe.x, game.jefe.y + 8);
		// Eventos de disparo de rayo
		game.add.tween(rayo).to({alpha: 1}, 1500, Phaser.Easing.Linear.In, true).onComplete.add(function(rayo) {
			rayo.scale.y = 150;
			game.add.tween(rayo).to({y: -1500}, 1500, Phaser.Easing.Linear.In, true).onComplete.add(function(rayo) {
				rayo.kill();
			});
		});
	},
	
	/**
	 * Función usada para crear los rayos disparados por el jefe
	 * @method crearRayo
	 * @param {} disparo
	 */
	crearRayo: function(disparo) {
		var rayo = game.add.sprite(disparo * game.jefe.width * 0.75, 0, 'rayoMuerte');
		rayo.alive = false;
		rayo.visible = false;
		game.jefe.addChild(rayo);
		rayo.crop({x: 0, y: 0, width: 40, height: 40});
		rayo.anchor.x = 0.5;
		rayo.anchor.y = 0.5;
		rayo.scale.x = 2.5;
		rayo.danioRecibido = game.jefe.danioRecibido;
		game.physics.enable(rayo, Phaser.Physics.ARCADE);
		rayo.body.setSize(rayo.width / 5, rayo.height / 4);
		//rayo.reset(game.jefe.x, game.jefe.y + 8);
		if (disparo > 0) {
			game.jefe.rayoDer = rayo;
		} else {
			game.jefe.rayoIzq = rayo;
		}
		game.jefe['ray' + (disparo > 0 ? 'Right' : 'Left')] = rayo;
		//return rayo;
		// var bala;
		// if (disparo > 0) {
			// bala = game.rayoDer.getFirstExists(false);
		// } else {
			// bala = game.rayoIzq.getFirstExists(false);
		// }
		// if (bala) {
			// game.sfxDisparo.play();
			// bala.reset(game.jefe.x, game.jefe.y + 8);
			// bala.body.velocity.y = 1000;
		// }
	},
	
	/**
	 * Función usada para mostrar animación de texto cargando un mensaje letra a letra
	 * @method mostrarLetraPorLetra
	 * @param {} mapaTexto
	 * @param {} mensaje
	 * @param {} locY
	 */
	mostrarLetraPorLetra: function(mapaTexto, mensaje) {
		game.time.events.repeat(200, mensaje.length + 1, this.mostrarLetraSiguiente, { mapaTexto: mapaTexto, mensaje: mensaje, contador: 1 , total: mensaje.length });
	},
	
	/**
	 * Función auxiliar usada para mostrar la siguiente letra sobreescribiendo el valor del mensaje inicial
	 * @method mostrarLetraSiguiente
	 */
	mostrarLetraSiguiente: function() {
		if (this.contador > this.total) {
			this.mapaTexto.text = '';
		} else {
			this.mapaTexto.text = this.mensaje.substr(0, this.contador);
			this.contador += 1;
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
		// Lanzamos el estado lose
		game.state.start('lose');
	},
	
	/**
	 * Función usada para gestionar la partida ganada
	 * @method ganarPartida
	 */
	ganarPartida: function() {
		// Agregamos puntos a marcador
		game.puntos += 2000;
		game.puntosTexto.text = 'Puntos: ' + game.puntos;
		// Lanzamos el estado win
		game.state.start('win');
	}
}
