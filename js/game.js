// Variable global usada para almacenar la propia referencia al juego y sus métodos,
// los dos primeros enteros son las dimensiones x e y del tamaño en píxeles del contenedor
// del juego, el tercer parámetro es el método de renderizado del juego, y el cuarto 
// el nombre del elemento div que tiene nuestro contenedor principal
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'space');

// Agregamos cada estado de juego para modular la aplicación
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', winState);
game.state.add('lose', loseState);

// Comenzamos inicialmente llamando al estado boot
game.state.start('boot');
