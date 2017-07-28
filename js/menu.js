// Variable estado usada para cargar el menú inicial de juego
var menuState = {	
	/**
	 * Método usado para cargar los diferentes elementos del menú principal
	 * @method create
	 */
	create: function() {
		// Mostramos el título y menú principal de juego.
        var titulo = game.add.text(80, 80, 'Space Invaders', { font: '50px Arial', fill: 'white' });
        // Añadiendo un mensaje decriptivo con instrucciones para poder comenzar
        var inicio = game.add.text(80, game.world.height-80, 'Pulsa "Intro" para comenzar', {font: '25px Arial', fill: 'white' });
        // Definimos la variable que captura la pulsación de la tecla intro
        var intro = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // Y le asignamos un evento para que comience el juego al pulsarla
        intro.onDown.addOnce(this.start, this);
	},
	
	/**
	 * Método usado para llamar al siguiente estado de juego
	 * @method start
	 */
	start: function() {
		// Llamamos al estado play
		game.state.start('play');
	},
};
