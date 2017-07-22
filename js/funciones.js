var game = new Phaser.Game(800, 600, Phaser.AUTO, 'space', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('bala', 'assets/games/invaders/bullet.png');
    game.load.image('balaAlien', 'assets/games/invaders/enemy-bullet.png');
    game.load.image('nave', 'assets/games/invaders/player.png');
    game.load.image('fondo', 'assets/games/invaders/starfield.png');
    game.load.spritesheet('alien', 'assets/games/invaders/invader32x32x4.png', 32, 32);
	game.load.spritesheet('boom', 'assets/games/invaders/explode.png', 128, 128);
	game.load.audio('disparo', 'assets/audio/SoundEffects/blaster.mp3');
	game.load.audio('explosion', 'assets/audio/SoundEffects/alien_death1.wav');
}

var nave;
var aliens;
var balas;
var balaHora = 0;
var cursores;
var botonDisparo;
var explosiones;
var fondo;
var puntos = 0;
var puntosCadena = '';
var puntosTexto;
var vidas;
var balaAlien;
var disparoHora = 0;
var textoResultado;
var velocidadMov = 2000;
var enemigosVivos = [];

function create() {
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

    balasAlien = game.add.group();
    balasAlien.enableBody = true;
    balasAlien.physicsBodyType = Phaser.Physics.ARCADE;
    balasAlien.createMultiple(30, 'balaAlien');
    balasAlien.setAll('anchor.x', 0.5);
    balasAlien.setAll('anchor.y', 1);
    balasAlien.setAll('outOfBoundsKill', true);
    balasAlien.setAll('checkWorldBounds', true);

    nave = game.add.sprite(400, 500, 'nave');
    nave.anchor.setTo(0.5, 0.5);
    game.physics.enable(nave, Phaser.Physics.ARCADE);

    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
    crearAliens();

    puntosCadena = 'Puntos: ';
    puntosTexto = game.add.text(10, 10, puntosCadena + puntos, { font: '34px Arial', fill: '#fff' });

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

    explosiones = game.add.group();
    explosiones.createMultiple(30, 'boom');
    explosiones.forEach(setupInvader, this);

	game.sfxDisparo = game.add.audio('disparo');
	game.sfxExplosion = game.add.audio('explosion');
	
    cursores = game.input.keyboard.createCursorKeys();
    botonDisparo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

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
    
	var movimientoX = game.add.tween(aliens).to( { x: 200 }, velocidadMov, Phaser.Easing.Linear.None, true, 0, velocidadMov, true);
	var movimientoY = game.time.events.loop(velocidadMov * 2, descender, this);
}

function setupInvader(alien) {
    alien.anchor.x = 0.5;
    alien.anchor.y = 0.5;
    alien.animations.add('boom');
}

function descender() {
    aliens.y += 20;
}

function update() {
    fondo.tilePosition.y += 2;
    if (nave.alive) {
        nave.body.velocity.setTo(0, 0);
        if (cursores.left.isDown) {
            nave.body.velocity.x = -200;
        } else if (cursores.right.isDown) {
            nave.body.velocity.x = 200;
        }

        if (botonDisparo.isDown) {
            dispararBala();
        }

        if (game.time.now > disparoHora) {
            disparoEnemigo();
        }

        game.physics.arcade.overlap(balas, aliens, manejadorDisparoNave, null, this);
        game.physics.arcade.overlap(balasAlien, nave, manejadorDisparoEnemigo, null, this);
    }
}

function render() {
    // for (var i = 0; i < aliens.length; i++) {
    //     game.debug.body(aliens.children[i]);
    // }
}

function manejadorDisparoNave(bala, alien) {
    bala.kill();
    alien.kill();
    puntos += 20;
	game.sfxExplosion.play();
    puntosTexto.text = puntosCadena + puntos;
    var explosion = explosiones.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('boom', 30, false, true);
    if (aliens.countLiving() == 0) {
        puntos += 1000;
        puntosTexto.text = puntosCadena + puntos;
        balasAlien.callAll('kill',this);
        textoResultado.text = " ¡Has Ganado! \n Click para reiniciar";
        textoResultado.visible = true;
        game.input.onTap.addOnce(reiniciar,this);
    }
}

function manejadorDisparoEnemigo(nave,bala) {
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
        textoResultado.text=" Has Perdido. \n Click para reiniciar";
        textoResultado.visible = true;
        game.input.onTap.addOnce(reiniciar,this);
    }
}

function disparoEnemigo() {
    balaAlien = balasAlien.getFirstExists(false);
    enemigosVivos.length=0;
    aliens.forEachAlive(function(alien){
        enemigosVivos.push(alien);
    });

    if (balaAlien && enemigosVivos.length > 0) {
        var aleatorio=game.rnd.integerInRange(0,enemigosVivos.length-1);
        var seleccion=enemigosVivos[aleatorio];
        balaAlien.reset(seleccion.body.x, seleccion.body.y);
        game.physics.arcade.moveToObject(balaAlien,nave,120);
        disparoHora = game.time.now + 2000;
		game.sfxDisparo.play();
    }
}

function dispararBala() {
    if (game.time.now > balaHora) {
        bala = balas.getFirstExists(false);
        if (bala) {
			game.sfxDisparo.play();
            bala.reset(nave.x, nave.y + 8);
            bala.body.velocity.y = -400;
            balaHora = game.time.now + 200;
        }
    }
}

function reiniciarBala(bala) {
    bala.kill();
}

function reiniciar () {
    vidas.callAll('revive');
    aliens.removeAll();
    crearAliens();
    nave.revive();
    textoResultado.visible = false;
}