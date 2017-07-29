// Variable estado usada para cargar la pantalla de juego ganado
var winState = {
	/**
	 * Método usado para cargar el mensaje de juego ganado
	 * @method create
	 */
    create: function() {	
		// Mostramos mensaje final agregando instrucciones para reiniciar el juego.
        var titulo = game.add.text(80, 80, '¡Has Ganado!', { font: '54px Arial', fill: 'white' });
        var inicio = game.add.text(80, game.world.height-100, 'Pulsa "Intro" para volver al menú', {font: '30px Arial', fill: 'white' });
		// Definimos la variable que captura la pulsación de la tecla intro
		var intro = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		// Y le asignamos un evento para que lance el menú de juego al pulsarla
		intro.onDown.addOnce(this.restart, this);
    },
    
	/**
	 * Función usada para cargar de nuevo el menú principal
	 * @method restart
	 */
    restart: function () {
		// Lanzamos el estado menu
        game.state.start('menu');
		// Queda pendiente implementar el resto de niveles, jefes, etc..
    }
}
