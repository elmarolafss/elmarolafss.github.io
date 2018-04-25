var config = {//confic hjá mér er copy paste frá tutorial sem eg fylgdi í byrjun
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);


function preload ()//preloadaðar myndir frá phaser
{
    this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('sky', 'assets/sets/background.png');
    this.load.image('sky2', 'assets/skies/sky4.png')
    this.load.image('ground', 'assets/sets/objects/platform2.png');
    this.load.image('daimond', 'assets/sprites/diamond.png');
    this.load.image('saw', 'assets/sprites/saw.png');
    this.load.image('exit', 'assets/sprites/flectrum2.png');
    this.load.image('space', 'assets/skies/space3.png');
    this.load.image('gem', 'assets/sprites/loop.png');
    this.load.image('plane', 'assets/sprites/plane.png');
    this.load.image('ball', 'assets/sprites/purple_ball.png')
    this.load.image('steel', 'assets/sprites/steelbox.png')

    this.load.spritesheet('dude', 'assets/sprites/dude.png',{ frameWidth: 32, frameHeight: 48 });
}
var score = 0;
function create ()
{
    gameOver = false;

    var scoreText;

    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(300, 600, 'ground').setScale(1.5).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(190, 250, 'ground');
    platforms.create(750, 200, 'ground');

    exit = this.physics.add.staticGroup();

    exit.create(795, 104, 'exit');

    enemy = this.physics.add.image(450, -15, 'saw');

    enemy.setVelocity(100, 100);
    enemy.setBounce(1, 1);
    enemy.setCollideWorldBounds(true);

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.anims.create({//hér kemur sprite animation, anims
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player,enemy, hitSaw, null, this);//hitsaw fall er kallað ef sög hittir þig
    this.physics.add.collider(player, exit, level2, null, this);//leikmaður hittir exit þá fer hann í lvl 2

    cursors = this.input.keyboard.createCursorKeys();

    points = this.physics.add.group({
        key: 'daimond',
        repeat: 4,
        setXY: { x: 150, y: 50, stepX: 150}
    });

    points.children.iterate(function (child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(points, platforms);

    this.physics.add.overlap(player, points, collectPoint, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    function hitSaw(){//í hitsaw fallinu er síðuni endurhlaðið, þú byrjar uppá nýtt
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
        location.reload();
    }

    function collectPoint (player, points){
        points.disableBody(true, true)
        score +=10;
        scoreText.setText('Score: ' + score);
    }

}
function level2(){
    var scoreText;
    enemy.destroy();
    this.add.image(400, 300, 'sky2');
    platslevel2 = this.physics.add.staticGroup();
    platslevel2.create(100, 600, 'ground');
    platslevel2.create(160, 250, 'ground');
    platslevel2.create(750, 200, 'ground');
    platslevel2.create(400, 500, 'plane');
    platslevel2.create(650, 400, 'plane');
    platslevel2.create(450, 300, 'plane');

    enemy = this.physics.add.staticGroup();
    enemy.create(370, 600, 'saw');
    enemy.create(450, 600, 'saw');
    enemy.create(550, 600, 'saw');
    enemy.create(650, 600, 'saw');
    enemy.create(750, 600, 'saw');

    exit = this.physics.add.staticGroup();

    exit.create(795, 104, 'exit');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    points = this.physics.add.group({
        key: 'gem',
        repeat: 4,
        setXY: { x: 90, y: 50, stepX: 150}
    });

    points.children.iterate(function (child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(player, platslevel2);
    this.physics.add.collider(points, platslevel2);
    this.physics.add.collider(player,enemy, hitSaw, null, this);
    this.physics.add.collider(player, exit, level3, null, this);

    this.physics.add.overlap(player, points, collectPoint, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    function collectPoint (player, points){
        points.disableBody(true, true)
        score +=10;
        scoreText.setText('Score: ' + score);
    }

    function hitSaw(){
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
        location.reload();
    }
}
function level3 (){
    var scoreText;
    this.add.image(400, 300, 'space');

    enemy = this.physics.add.staticGroup();
    enemy.create(170, 650, 'saw');
    enemy.create(0, 650, 'saw');
    enemy.create(70, 650, 'saw');
    enemy.create(270, 650, 'saw');
    enemy.create(370, 650, 'saw');
    enemy.create(450, 650, 'saw');
    enemy.create(550, 650, 'saw');
    enemy.create(650, 650, 'saw');
    enemy.create(750, 650, 'saw');
    enemy.create(400, 500, 'saw');
    enemy.create(150, -15, 'saw');

    exit = this.physics.add.staticGroup();

    exit.create(25, 25, 'exit');

    platslevel3 = this.physics.add.staticGroup();
    platslevel3.create(750, 250, 'steel');
    platslevel3.create(500, 400, 'steel');
    platslevel3.create(400, 250, 'steel');
    platslevel3.create(100, 250, 'steel');


    moveplat = this.physics.add.image(100, 600, 'steel');
    moveplat.setVelocity(150, 0);
    moveplat.setCollideWorldBounds(true);

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    points = this.physics.add.group({
        key: 'ball',
        repeat: 2,
        setXY: { x: 90, y: 50, stepX: 350}
    });

    points.children.iterate(function (child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    
    this.physics.add.collider(points, platslevel3);
    this.physics.add.collider(player, platslevel3);
    this.physics.add.collider(moveplat, player);
    this.physics.add.collider(player, enemy, hitSaw, null, this);
    this.physics.add.collider(player, exit, level4, null, this);
    this.physics.add.overlap(player, points, collectPoint, null, this);

    scoreText = this.add.text(620, 16, 'score: 0', { fontSize: '32px', fill: '#ffffff' });

    function collectPoint (player, points){
        points.disableBody(true, true)
        score +=10;
        scoreText.setText('Score: ' + score);
    }

    function hitSaw(){
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        location.reload();
    }
}
function level4(){//ætti að koma total score eftir level 3 en það kemur ekki..
    var scoreText;
    scoreText = this.add.text(100, 200, 'Total score: ' + score, { fontSize: '40px', fill: '#ffffff' });
    scoreText = this.add.text(100, 300, 'Game Over', { fontSize: '0px', fill: '#ffffff' });
}

function update ()
{
    if (cursors.left.isDown)//movement
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.space.isDown && player.body.touching.down)//leikmaður er kyrr og hoppar þá verður velocitu -250
    {
        player.setVelocityY(-250);
    }
    if (cursors.space.isDown && player.body.touching.down && (cursors.left.isDown || cursors.right.isDown))//ef leikmaður er að hlaupa og hoppar þá fer það í -330
    {
        player.setVelocityY(-330);
    }
}
