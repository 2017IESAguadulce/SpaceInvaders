// Variable estado usada para iniciar las físicas del juego
var bootState = {
	/**
	 * Método estándar llamado automáticamente por Phaser para crear y cargar los recursos usados
	 * @method create
	 */
	create: function() {
		//Usamos Scale Manager para definir el modo de escalado 
		//y que se muestre todo el Canvas en pantalla
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//Para centrar el Canvas en la pantalla horizontal y verticalmente
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.refresh();
		// Iniciamos el sistema de físicas del motor
		game.physics.startSystem(Phaser.Physics.ARCADE);
		// Llamamos al estado load
		game.state.start('load');
	}
};
