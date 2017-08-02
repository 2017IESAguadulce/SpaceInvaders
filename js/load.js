// Variable estado usada para cargar los recursos usados en el juego
var loadState = {
	/**
	 * Método estándar de Phaser usado para definir y precargar los recursos utilizados en el proyecto
	 * @method preload
	 */
	preload: function() {
		var cargando = game.add.text(80, 50, 'Cargando...', { font: '34px Arial', fill: 'white' });
		game.load.image('bala', 'assets/games/invaders/bullet.png');
		game.load.image('balaAlien', 'assets/games/invaders/enemy-bullet.png');
		game.load.image('nave', 'assets/games/invaders/player.png');
		game.load.image('fondo', 'assets/games/invaders/starfield.png');
		game.load.image('mejoraVida', 'assets/games/invaders/player.png');
		game.load.image('mejoraArma', 'assets/sprites/pangball2.png');
		game.load.image('mejoraVelocidad', 'assets/sprites/pangball3.png');
		game.load.image('skin1', 'assets/skins/skin1.jpg');
		game.load.image('skin2', 'assets/skins/skin2.jpg');
		game.load.image('skin3', 'assets/skins/skin3.jpg');
		game.load.image('skin4', 'assets/skins/skin4.jpg');
		game.load.spritesheet('alien', 'assets/games/invaders/invader32x32x4.png', 32, 32);
		game.load.spritesheet('boom', 'assets/games/invaders/explode.png', 128, 128);
		game.load.spritesheet('botonJugar', 'assets/buttons/boton_jugar.png', 193, 71);
		game.load.spritesheet('botonOpciones', 'assets/buttons/boton_opciones.png', 193, 71);
		game.load.spritesheet('botonPuntuaciones', 'assets/buttons/boton_puntuaciones.png', 193, 71);
		game.load.spritesheet('botonVolver', 'assets/buttons/boton_volver.png', 193, 71);
		game.load.spritesheet('botonSkin', 'assets/buttons/boton_skin.png', 193, 71);
		game.load.spritesheet('botonVolverPeq', 'assets/buttons/boton_volver2.png', 34, 34);
		game.load.spritesheet('botonSilenciar', 'assets/buttons/boton_volumen-mute.png', 34, 34);
		game.load.spritesheet('botonVolumen', 'assets/buttons/boton_volumen-sound.png', 34, 34);
		game.load.audio('botonHover', 'assets/audio/SoundEffects/squit.ogg');
		game.load.audio('botonStart', 'assets/audio/SoundEffects/p-ping.mp3');
		game.load.image('star', 'assets/sprites/star2.png');
		game.load.image('logo', 'assets/sprites/phaser.png');
		game.load.audio('ayuda', 'assets/audio/SoundEffects/key.wav');
		game.load.audio('disparo', 'assets/audio/SoundEffects/blaster.mp3');
		game.load.audio('explosion', 'assets/audio/SoundEffects/alien_death1.wav');
		game.load.audio('hiloMusical', 'assets/audio/SpaceArp1Kit.mp3');
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
		// Creamos referencias a variables de skins de pantalla
		game.skinsTotal = 4;
		game.skinSeleccionada = 1;
		// Activamos el hilo musical y llamamos al estado menu
		this.cargarHiloMusical();
		game.state.start('menu');
	}
};
