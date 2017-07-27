// Variable estado usada para iniciar las físicas del juego
var bootState = {
	/**
	 * Método estándar llamado automáticamente por Phaser para crear y cargar los recursos usados
	 * @method create
	 */
	create: function() {
		// Iniciamos el sistema de físicas del motor
		game.physics.startSystem(Phaser.Physics.ARCADE);
		// Llamamos al estado load
		game.state.start('load');
	}
};
