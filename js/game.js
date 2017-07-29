// Variable global usada para almacenar la propia referencia al juego y sus métodos,
// los dos primeros enteros son las dimensiones del tamaño en píxeles del contenedor
// de juego, el tercer parámetro es el método de renderizado, y el cuarto el nombre
// del elemento que tiene nuestro contenedor, al estar vacío se insertará en el body del index
var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

// Agregamos cada estado de juego para modular la aplicación
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('options', optionsState);
game.state.add('score', scoreState);
game.state.add('level1', level1State);
game.state.add('win', winState);
game.state.add('lose', loseState);

// Comenzamos inicialmente llamando al estado boot
game.state.start('boot');
