// Variable estado usada para cargar los recursos usados en el juego
var loadState = {
	/**
	 * Método estándar de Phaser usado para definir y precargar los recursos utilizados en el proyecto
	 * @method preload
	 */
	preload: function() {
		var etiquetaCargando = game.add.text(80, 50, 'Cargando...', { font: '34px Arial', fill: 'white' });
		game.load.image('bala', 'assets/games/invaders/bullet.png');
		game.load.image('balaAlien', 'assets/games/invaders/enemy-bullet.png');
		game.load.image('nave', 'assets/games/invaders/player.png');
		game.load.image('fondo', 'assets/games/invaders/starfield.png');
		game.load.image('mejoraVida', 'assets/games/invaders/player.png');
		game.load.image('mejoraArma', 'assets/sprites/pangball2.png');
		game.load.image('mejoraVelocidad', 'assets/sprites/pangball3.png');
		game.load.spritesheet('alien', 'assets/games/invaders/invader32x32x4.png', 32, 32);
		game.load.spritesheet('boom', 'assets/games/invaders/explode.png', 128, 128);
		game.load.audio('ayuda', 'assets/audio/SoundEffects/key.wav');
		game.load.audio('disparo', 'assets/audio/SoundEffects/blaster.mp3');
		game.load.audio('explosion', 'assets/audio/SoundEffects/alien_death1.wav');
		game.load.image('star', 'assets/sprites/star2.png');
		game.load.image('logo', 'assets/sprites/phaser.png');
	},
	
	/**
	 * Método usado para llamar al siguiente estado de juego
	 * @method create
	 */
	create: function() {
		// Llamamos al estado menu
		game.state.start('menu');
	}
};
