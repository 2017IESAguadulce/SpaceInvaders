// Variable estado usada para cargar los recursos usados en el juego
var loadState = {
	/**
	 * Método estándar de Phaser usado para definir y precargar los recursos utilizados en el proyecto
	 * @method preload
	 */
	preload: function() {
		var cargando = game.add.text(80, 50, 'Cargando...', { font: '34px Arial', fill: 'white' });
		game.load.audio('hiloMusical', 'assets/audio/MagPri86a96.mp3');
		game.load.audio('botonHover', 'assets/audio/SoundEffects/boton_hover.ogg');
		game.load.audio('botonCancel', 'assets/audio/SoundEffects/boton_cancel.ogg');
		game.load.audio('botonStart', 'assets/audio/SoundEffects/boton_click.ogg');
		game.load.audio('ayuda', 'assets/audio/SoundEffects/objeto.wav');
		game.load.audio('disparo', 'assets/audio/SoundEffects/blaster.mp3');
		game.load.audio('explosion', 'assets/audio/SoundEffects/alien_muerte.wav');
		game.load.audio('muro', 'assets/audio/SoundEffects/colision_muro.mp3');
		game.load.audio('invasor', 'assets/audio/SoundEffects/invasor_aparece.mp3');
		game.load.audio('torpedo', 'assets/audio/SoundEffects/disparo_torpedo.mp3');
		game.load.audio('cargaTorpedo', 'assets/audio/SoundEffects/carga_torpedo.mp3');
		game.load.audio('jefeMuerte', 'assets/audio/SoundEffects/jefe_muerte.mp3');
		game.load.image('bala', 'assets/games/invaders/bullet.png');
		game.load.image('nave', 'assets/games/invaders/player.png');
		game.load.image('invasor', 'assets/games/invaders/invader.png');
		game.load.image('fondo', 'assets/games/invaders/starfield.png');
		game.load.image('100', 'assets/sprites/100.png');
		game.load.image('200', 'assets/sprites/200.png');
		game.load.image('300', 'assets/sprites/300.png');
		game.load.image('500', 'assets/sprites/500.png');
		game.load.image('muro', 'assets/sprites/muro.png');
		game.load.image('skin1', 'assets/skins/skin1.jpg');
		game.load.image('skin2', 'assets/skins/skin2.jpg');
		game.load.image('skin3', 'assets/skins/skin3.jpg');
		game.load.image('star', 'assets/sprites/star2.png');
		game.load.image('logo', 'assets/sprites/logo.png');
		game.load.image('boss', 'assets/sprites/boss.png');
		game.load.image('laser', 'assets/games/invaders/laser.png');
		game.load.image('laserEfecto', 'assets/sprites/death-ray.png');
		game.load.image('jefeEstela', 'assets/sprites/enemy-blue-bullet.png');
		game.load.image('balaAlien', 'assets/games/invaders/enemy-bullet.png');
		game.load.spritesheet('alien', 'assets/games/invaders/invader32x32x4.png', 32, 32);
		game.load.spritesheet('alien2', 'assets/games/invaders/invader232x32x4.png', 32, 32);
		game.load.spritesheet('boom', 'assets/games/invaders/explode.png', 128, 128);
		game.load.spritesheet('botonJugar', 'assets/buttons/boton_jugar.png', 193, 71);
		game.load.spritesheet('botonOpciones', 'assets/buttons/boton_opciones.png', 193, 71);
		game.load.spritesheet('botonPuntuaciones', 'assets/buttons/boton_puntuaciones.png', 193, 71);
		game.load.spritesheet('botonVolver', 'assets/buttons/boton_volver.png', 193, 71);
		game.load.spritesheet('botonContinuar', 'assets/buttons/boton_continuar.png', 193, 71);
		game.load.spritesheet('botonPantalla', 'assets/buttons/boton_pantalla.png', 193, 71);
		game.load.spritesheet('botonReiniciar', 'assets/buttons/boton_reiniciar.png', 193, 71);
		game.load.spritesheet('botonEnviar', 'assets/buttons/boton_enviar.png', 193, 71);
		game.load.spritesheet('botonPantallaCompleta', 'assets/buttons/boton_pantalla_completa.png', 193, 71);
		game.load.spritesheet('botonSkin', 'assets/buttons/boton_skin.png', 193, 71);
		game.load.spritesheet('botonMejora1', 'assets/buttons/boton_1.png', 69, 50);
		game.load.spritesheet('botonMejora2', 'assets/buttons/boton_2.png', 69, 50);
		game.load.spritesheet('botonMejora3', 'assets/buttons/boton_3.png', 69, 50);
		game.load.spritesheet('botonMejora4', 'assets/buttons/boton_4.png', 69, 50);
		game.load.spritesheet('botonMejora5', 'assets/buttons/boton_5.png', 69, 50);
		game.load.spritesheet('botonVolverPeq', 'assets/buttons/boton_volver2.png', 34, 34);
		game.load.spritesheet('botonSilenciar', 'assets/buttons/boton_volumen-mute.png', 34, 34);
		game.load.spritesheet('botonVolumen', 'assets/buttons/boton_volumen-sound.png', 34, 34);
		game.load.bitmapFont('gem', 'assets/fonts/bitmapFonts/gem.png', 'assets/fonts/bitmapFonts/gem.xml');
		// Si ejecutamos el juego desde el móvil cargamos el pad virtual
		if (!game.escritorio) {
			game.load.spritesheet('gamepad', 'assets/buttons/gamepad_spritesheet.png', 100, 100);
		}
	},
	
	/**
	 * Método usado para cargar el hilo musical de fondo para el juego
	 * @method cargarHiloMusical
	 */
	cargarHiloMusical: function() {
		// Creamos hilo de fondo musical, le activamos el modo bucle y lo reproducimos
		game.hiloMusical = game.add.audio('hiloMusical');
		game.hiloMusical.loopFull();
		game.hiloMusical.play();
	},
	
	/**
	 * Método usado para llamar al siguiente estado de juego
	 * @method create
	 */
	create: function() {
		// Creamos referencias a variables de skins de pantalla y demás
		game.skinsTotal = 3;
		game.skinSeleccionada = 1;
		game.topMaximo = 5;
		// Activamos el hilo musical y llamamos al estado menu
		this.cargarHiloMusical();
		game.state.start('menu');
	}
};
