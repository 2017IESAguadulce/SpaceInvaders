// Variable global usada para almacenar la propia referencia al juego y sus métodos internos
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'space', { preload: preload, create: create, update: update });

/**
 * Método usado para precargar los recursos utilizados en el proyecto
 * @method preload
 */
function preload() {
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
//// INTRO ////
	game.load.image('star', 'assets/sprites/star2.png');
	game.load.image('logo_phaser', 'assets/sprites/phaser.png');
}

// Variables globales utilizadas de forma estática
var nave;
var naveVelocidad = 200;
var naveBalasRatio = 300;
var aliens;
var balas;
var balaHora = 0;
var cursores;
var botonDisparo;
var explosiones;
var fondo;
var puntos = 0;
var puntosTexto;
var vidas;
var ayudas;
var balaAlien;
var disparoHora = 0;
var textoResultado;
var velocidadMov = 2000;
var movimientoAlienX;
var movimientoAlienY;
var enemigosVivos = [];
//// INTRO ////
	// variables para las estrellas
	var distance = 300;//distacia
	var speed_stars = 1;//velocidad estrellas
	max = 1000;//cantida de estrellas
	var xx = [];
	var yy = [];
	var zz = [];
	// variables para las logo phaser
	var speed_phaser = 0.1;
	var logo_phaser;

/**
 * Método usado para crear y cargar los recursos usados por el juego
 * @method create
 */
function create() {



    //Uso el Scale Manager para definir el modo de escalado 
    //y que se muestre todo el Canvas en pantalla
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //Para centrar el Canvas en la pantalla horizontal y verticalmente
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.refresh();


    game.physics.startSystem(Phaser.Physics.ARCADE);
    fondo = game.add.tileSprite(0, 0, 800, 600, 'fondo');
	
    balas = game.add.group();
    balas.enableBody = true;
    balas.physicsBodyType = Phaser.Physics.ARCADE;
    balas.createMultiple(30, 'bala');
    balas.setAll('anchor.x', 0.5);
    balas.setAll('anchor.y', 1);
    balas.setAll('outOfBoundsKill', true);
    balas.setAll('checkWorldBounds', true);	
	
    nave = game.add.sprite(400, 500, 'nave');
    nave.anchor.setTo(0.5, 0.5);
    game.physics.enable(nave, Phaser.Physics.ARCADE);
	nave.body.collideWorldBounds = true;
	
    balasAlien = game.add.group();
    balasAlien.enableBody = true;
    balasAlien.physicsBodyType = Phaser.Physics.ARCADE;
    balasAlien.createMultiple(30, 'balaAlien');
    balasAlien.setAll('anchor.x', 0.5);
    balasAlien.setAll('anchor.y', 1);
    balasAlien.setAll('outOfBoundsKill', true);
    balasAlien.setAll('checkWorldBounds', true);

    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
    crearAliens();

    puntosTexto = game.add.text(10, 10, 'Puntos: ' + puntos, { font: '34px Arial', fill: '#fff' });
    vidas = game.add.group();
    game.add.text(game.world.width - 115, 10, 'Vidas: ', { font: '34px Arial', fill: '#fff' });

    textoResultado = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    textoResultado.anchor.setTo(0.5, 0.5);
    textoResultado.visible = false;

    for (var i = 0; i < 3; i++) {
        var naveImagen = vidas.create(game.world.width - 100 + (30 * i), 60, 'nave');
        naveImagen.anchor.setTo(0.5, 0.5);
        naveImagen.angle = 90;
        naveImagen.alpha = 0.4;
    }
	
	ayudas = game.add.group();
    ayudas.enableBody = true;
	ayudas.physicsBodyType = Phaser.Physics.ARCADE;
	game.physics.arcade.gravity.y = 50;

    explosiones = game.add.group();
    explosiones.createMultiple(30, 'boom');
    explosiones.forEach(configurarExplosion, this);

	game.sfxAyuda = game.add.audio('ayuda');
	game.sfxDisparo = game.add.audio('disparo');
	game.sfxExplosion = game.add.audio('explosion');
	
    cursores = game.input.keyboard.createCursorKeys();
    botonDisparo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	create_stars();
}

/**
 * Método ejecutado cada frame para actualizar la lógica del juego
 * @method update
 */
function update() {
	
		update_stars();


    if (nave.alive) {
		fondo.tilePosition.y += 2;
        nave.body.velocity.setTo(0, 0);
        if (cursores.left.isDown) {
            nave.body.velocity.x = -naveVelocidad;
        } else if (cursores.right.isDown) {
            nave.body.velocity.x = naveVelocidad;
        }
		
        if (botonDisparo.isDown) {
            dispararBala();
        }
        if (game.time.now > disparoHora) {
            disparoEnemigo();
        }

		girarNave();
		game.physics.arcade.overlap(nave, ayudas, manejadorColisionNaveAyuda, null, this);
        game.physics.arcade.overlap(balas, aliens, manejadorDisparoNave, null, this);
        game.physics.arcade.overlap(balasAlien, nave, manejadorDisparoEnemigo, null, this);

}
}

/**
 * Función usada para gestionar las colisiones producidas entre nuestras balas y los aliens
 * @method manejadorDisparoNave
 * @param {} bala
 * @param {} alien
 */
function manejadorDisparoNave(bala, alien) {
	lanzarAyuda(alien);
    bala.kill();
    alien.kill();
    puntos += 20;
	game.sfxExplosion.play();
    puntosTexto.text = 'Puntos: ' + puntos;

    var explosion = explosiones.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('boom', 30, false, true);
	
    if (aliens.countLiving() == 0) {
        puntos += 1000;
        puntosTexto.text = 'Puntos: ' + puntos;
		game.tweens.remove(movimientoAlienX);
		game.time.events.remove(movimientoAlienY);
        balasAlien.callAll('kill',this);
        textoResultado.text = " ¡Has Ganado! \n Click para reiniciar";
        textoResultado.visible = true;
        game.input.onTap.addOnce(reiniciar,this);
    }
}

/**
 * Función usada para gestionar las colisiones producidas entre las balas enemigas y nuestra nave
 * @method manejadorDisparoEnemigo
 * @param {} nave
 * @param {} bala
 */
function manejadorDisparoEnemigo(nave, bala) {		
    bala.kill();
	game.sfxExplosion.play();
    vida = vidas.getFirstAlive();
    if (vida) {
        vida.kill();
    }
	
    var explosion = explosiones.getFirstExists(false);
    explosion.reset(nave.body.x, nave.body.y);
    explosion.play('boom', 30, false, true);
	
    if (vidas.countLiving() < 1) {
        nave.kill();
        balasAlien.callAll('kill');
		game.tweens.remove(movimientoAlienX);
		game.time.events.remove(movimientoAlienY);
        textoResultado.text=" Has Perdido. \n Click para reiniciar";
        textoResultado.visible = true;
        game.input.onTap.addOnce(reiniciar,this);
    }
}

/**
 * Función usada para gestionar las colisiones producidas entre nuestra nave y las ayudas
 * @method manejadorColisionNaveAyuda
 * @param {} nave
 * @param {} ayuda
 */
function manejadorColisionNaveAyuda(nave, ayuda) {
	ayuda.kill();
	game.sfxAyuda.play();
	if (ayuda.name == "mejoraVida") {
		if (vidas.countLiving() < 3) {
			var naveImagen = vidas.create(game.world.width - 100 + ((vidas.countLiving() == 1) ? 30 : 0), 60, 'nave');
			naveImagen.anchor.setTo(0.5, 0.5);
			naveImagen.angle = 90;
			naveImagen.alpha = 0.4;
		}
	} else if (ayuda.name == "mejoraArma") {
		naveBalasRatio /= 1.5;
	} else if (ayuda.name == "mejoraVelocidad") {
		naveVelocidad *= 1.5;
	}
}

/**
 * Función usada para crear los enemigos y posicionarlos en pantalla agregándoles movimiento
 * @method crearAliens
 */
function crearAliens() {
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 10; x++) {
            var alien = aliens.create(x * 48, y * 50, 'alien');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }
    aliens.x = 100;
    aliens.y = 50;	
	movimientoAlienX = game.add.tween(aliens).to( { x: 250 }, velocidadMov, Phaser.Easing.Linear.None, true, 0, velocidadMov, true);
	movimientoAlienY = game.time.events.loop(velocidadMov * 2, descender, this);
}

/**
 * Función usada para configurar objetos agregándoles una animación
 * @method configurarExplosion
 * @param {} objeto
 */
function configurarExplosion(objeto) {
    objeto.anchor.x = 0.5;
    objeto.anchor.y = 0.5;
    objeto.animations.add('boom');
}

/**
 * Función usada para controlar el descenso de los enemigos de tipo alien
 * @method descender
 */
function descender() {
    aliens.y += 30;
}

/**
 * Función usada para gestionar los disparos de los enemigos de tipo alien
 * @method disparoEnemigo
 */
function disparoEnemigo() {
    balaAlien = balasAlien.getFirstExists(false);
    enemigosVivos.length = 0;
    aliens.forEachAlive(function(alien){
        enemigosVivos.push(alien);
    });

    if (balaAlien && enemigosVivos.length > 0) {
        var aleatorio = game.rnd.integerInRange(0, enemigosVivos.length-1);
        var seleccion = enemigosVivos[aleatorio];
        balaAlien.reset(seleccion.body.x, seleccion.body.y);
        game.physics.arcade.moveToObject(balaAlien, nave, 120);
        disparoHora = game.time.now + 2000;
		game.sfxDisparo.play();
    }
}

/**
 * Función usada para controlar la aleatoriedad a la hora de lanzar los paquetes de ayuda
 * @method lanzarAyuda
 * @param {} alien
 */
function lanzarAyuda(alien) {
	var aleatorio = Math.random();
	if (aleatorio < 0.06) {
		var mejora = "mejoraVida";
		if (aleatorio < 0.04) {
			mejora = "mejoraArma";
		} else if (aleatorio < 0.02) {
			mejora = "mejoraVelocidad";
		}
		cargarPowerUp(mejora, alien.body.x, alien.body.y);
	}
}

/**
 * Función usada para cargar la ayuda en pantalla a partir de su nombre y localización
 * @method cargarPowerUp
 * @param {} tipoMejora
 * @param {} locX
 * @param {} locY
 */
function cargarPowerUp(tipoMejora, locX, locY) {
	console.log(tipoMejora);
	var objeto = ayudas.create(locX, locY, tipoMejora);
	objeto.name = tipoMejora;
	objeto.body.collideWorldBounds = false;
	objeto.alpha = 0.4;
	game.physics.arcade.gravity.y = 50;
}

/**
 * Función usada para disparar balas desde nuestra nave
 * @method dispararBala
 */
function dispararBala() {
    if (game.time.now > balaHora) {
        bala = balas.getFirstExists(false);
        if (bala) {
			game.sfxDisparo.play();
			bala.reset(nave.x, nave.y + 8);
            bala.body.velocity.y = -400;
            balaHora = game.time.now + naveBalasRatio;
        }
    }
}

/**
 * Función usada para girar la nave y dar la sensación de movilidad
 * @method girarNave
 */
function girarNave() {
	var giro = nave.body.velocity.x / 1000;
	nave.scale.x = 1 - Math.abs(giro) / 2;
	nave.angle = giro * 30;
}

/**
 * Función usada para eliminar la bala que sale del marco (actualmente no se usa)
 * @method reiniciarBala
 * @param {} bala
 */
function reiniciarBala(bala) {
    bala.kill();
}

/**
 * Función usada para reiniciar el juego una vez hayamos perdido o ganado la partida
 * @method reiniciar
 */
function reiniciar() {
    vidas.callAll('revive');
    aliens.removeAll();
    crearAliens();
    nave.revive();
    textoResultado.visible = false;
}

function create_stars() {
        
    var sprites = game.add.spriteBatch();

    stars = [];

    for (var i = 0; i < max; i++)
    {
        xx[i] = Math.floor(Math.random() * 800) - 400;
        yy[i] = Math.floor(Math.random() * 600) - 300;
        zz[i] = Math.floor(Math.random() * 1700) - 100;

        var star = game.make.sprite(0, 0, 'star');
        star.anchor.set(0.5);
		
        sprites.addChild(star);

        stars.push(star);
    }

logo_phaser = game.add.sprite(400, 300, 'logo_phaser');
logo_phaser.anchor.set(0.5);
logo_phaser.scale.x = 0.1;
logo_phaser.scale.y = 0.1;
	
}

function update_stars() {
	    for (var i = 0; i < max; i++)
    {
        stars[i].perspective = distance / (distance - zz[i]);
        stars[i].x = game.world.centerX + xx[i] * stars[i].perspective;
        stars[i].y = game.world.centerY + yy[i] * stars[i].perspective;

        zz[i] += speed_stars;

        if (zz[i] > 290)
        {
            zz[i] -= 600;
        }

        stars[i].alpha = Math.min(stars[i].perspective / 2, 1);
        stars[i].scale.set(stars[i].perspective / 2);
        stars[i].rotation += 0.1;

    }
	if (logo_phaser.scale.x<500){
	speed_phaser +=0.01;
	logo_phaser.scale.x += speed_phaser;
	logo_phaser.scale.y += speed_phaser;
	}
	
}