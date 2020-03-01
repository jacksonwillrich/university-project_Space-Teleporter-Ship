/// <reference path="phaser.min.js" />



var jogarState = {


    create: function () {

        this.criarMundo();
        jogo.global.pontuacao = 0;
        this.timeStart = jogo.time.now;

        this.jogador = jogo.add.sprite(50, jogo.height * 0.5, 'player');
        this.jogador.scale.setTo(0.17 / this.jogador.height * jogo.height, 0.27 / this.jogador.height * jogo.height);
        this.jogador.anchor.setTo(0.5, 0.5);
        jogo.physics.enable(this.jogador, Phaser.Physics.ARCADE);
        this.jogador.isAlive = true;


        this.alvoTeleporter = jogo.add.sprite(160, 100, 'alvo');
        this.alvoTeleporter.scale.setTo(0.13 / this.alvoTeleporter.height * jogo.height, 0.2 / this.alvoTeleporter.height * jogo.height);
        this.alvoTeleporter.anchor.setTo(0.5, 0.5);
        jogo.physics.enable(this.alvoTeleporter, Phaser.Physics.ARCADE);
        this.alvoTeleporter.body.velocity.y = 300;
        this.alvoTeleporter.animations.add('idle', [0, 1, 2], 15, true);
        this.alvoTeleporter.animations.play('idle');

        this.pontosAlvo = [];
        for (var i = 0; i < 5; i++) {
            this.pontosAlvo[i] = jogo.add.sprite(0, 0, 'ponto');
            this.pontosAlvo[i].anchor.setTo(0.5, 0.5);
            this.pontosAlvo[i].scale.setTo(0.03 / this.pontosAlvo[i].height * jogo.height, 0.03 / this.pontosAlvo[i].height * jogo.height);
        }

        this.cursor = jogo.input.keyboard.createCursorKeys();

        this.pontuacaoLabel = jogo.add.text(30, 30, 'Pontos: 0',
            { font: '18px Arial', fill: '#ffffff' });


        this.alertas = jogo.add.group();
        this.alertas.enableBody = true;
        this.alertas.createMultiple(10, 'alerta');
        var alerta = this.alertas.getFirstDead();
        alerta.anchor.setTo(0.5, 0.5);
        alerta.scale.setTo(0.15 / alerta.height * jogo.height, 0.15 / alerta.height * jogo.height);
        jogo.time.events.add(2000, this.adicionarAlerta, this);

        this.inimigos = jogo.add.group();
        this.inimigos.enableBody = true;
        this.inimigos.createMultiple(10, 'inimigo1');
        var inimigo = this.inimigos.getFirstDead();
        inimigo.anchor.setTo(0.5, 0.5);

        this.spaceKey = jogo.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jogo.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        
        this.somTeleport = jogo.add.audio('teleport');
        this.somExplosao= jogo.add.audio('explosao');
        this.somLevelUp = jogo.add.audio('levelup');

    },


    adicionarAlerta: function () {
        var alerta = this.alertas.getFirstDead();
        if (!alerta)
            return;

        alerta.reset(jogo.width - 30, jogo.rnd.integerInRange(30, jogo.height - 30));
        alerta.animations.add('idle', [0, 1, 2], 15, true);
        alerta.animations.play('idle');

        jogo.time.events.add(500, this.adicionarInimigo, this, alerta);
        jogo.time.events.add(jogo.rnd.integerInRange(500, 1500), this.adicionarAlerta, this);

    },

    adicionarInimigo: function (alerta) {
        
        var inimigo = this.inimigos.getFirstDead();
        if (!inimigo)
            return;

        inimigo.reset(alerta.x, alerta.y + 10);
        inimigo.body.velocity.x = -600;
        inimigo.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
        inimigo.animations.play('idle');
        inimigo.checkWorldBounds = true;
        inimigo.outOfBoundsKill = true;
        alerta.kill();
    },

    update: function () {

        if (this.jogador.isAlive) {
            if (this.alvoTeleporter.body.y < 10 && this.alvoTeleporter.body.velocity.y < 0)
                this.alvoTeleporter.body.velocity.y *= -1;
            else if (this.alvoTeleporter.body.y > jogo.height - 90 && this.alvoTeleporter.body.velocity.y > 0)
                this.alvoTeleporter.body.velocity.y *= -1;

            if (this.jogador.x > 50)
                this.jogador.x -= 7;

            this.alvoTeleporter.body.x = this.jogador.x + 110;

            var difX = this.alvoTeleporter.x - this.jogador.x;
            var difY = this.alvoTeleporter.y - this.jogador.y;
            var difXnormal = difX / (this.pontosAlvo.length + 3);
            var difYnormal = difY / (this.pontosAlvo.length + 3);
            for (var i = 0; i < 5; i++) {
                this.pontosAlvo[i].x = this.jogador.x + (i + 2) * difXnormal;
                this.pontosAlvo[i].y = this.jogador.y + (i + 2) * difYnormal;
            }

            var elapsedTime = jogo.time.elapsedSince(this.timeStart);
            var novaPontuacao = jogo.global.pontuacao + (elapsedTime * 0.000000000001);
            if (parseInt(novaPontuacao * 0.001) - parseInt(jogo.global.pontuacao * 0.001) > 0)
                this.passouPontuacao();

            jogo.global.pontuacao = novaPontuacao;
            this.pontuacaoLabel.text =/* 'Pontos: '*/ + parseInt(jogo.global.pontuacao);

            this.moverJogador();
        }

        if (this.pontuacaoLabel.fontSize > 18)
            this.pontuacaoLabel.fontSize -= 1;

        jogo.physics.arcade.overlap(this.jogador, this.inimigos,
            this.jogadorAtingido,
            null, // função extra de processamento. Se colidiu e esse processamento retorna true chama a função pegarMoeda
            this); // contexto

        this.moverBackground();

    },
    jogadorAtingido: function () {
        this.somExplosao.play();

        this.jogador.isAlive = false;
        this.jogador.kill();
        this.pontosAlvo.forEach(function (c) { c.kill();});
        this.alvoTeleporter.kill();

        this.explosao = jogo.add.sprite(this.jogador.x, this.jogador.y, 'explosao');
        this.explosao.scale.setTo(0.35 / this.explosao.height * jogo.height, 0.35 / this.explosao.height * jogo.height);
        this.explosao.anchor.setTo(0.5, 0.5);
        this.explosao.animations.add('idle', [0, 1, 2, 3, 4, 5, 7], 12, false);
        this.explosao.animations.play('idle');
        this.explosao.animations.currentAnim.onComplete.add(this.quandoJogadorMorrer);
    },

    quandoJogadorMorrer: function () {
        jogo.state.start('menu');
    },

    passouPontuacao: function () {
        this.somLevelUp.play();
        this.pontuacaoLabel.fontSize = 30;
    },

    moverBackground: function () {
        var that = this;
        if (this.bg != null)
            this.bg.forEach(function (item, index) {
                if (item.body.x <= -jogo.width) {
                    if (index % 2 == 0)
                        item.body.x = that.bg[index + 1].body.x + jogo.width
                    else
                        item.body.x = that.bg[index - 1].body.x + jogo.width
                }
            })
    },

    moverJogador: function () {

        if ((this.cursor.up.isDown || this.cursor.right.isDown || this.spaceKey.isDown) && !this.teleportou && this.jogador.x <= jogo.width - 350) {
            this.teleportar();
        }

        if (this.cursor.up.isUp && this.spaceKey.isUp && this.cursor.right.isUp) {
            this.teleportou = false;
        }
    },

    teleportar: function () {
        this.somTeleport.play();
        this.teleportou = true;
        this.jogador.x = this.alvoTeleporter.x;
        this.jogador.y = this.alvoTeleporter.y + 15;
    },

    criarMundo: function () {

        var alturaBg = jogo.height * 0.2;
        this.bg = [];
        this.bg[0] = jogo.add.sprite(0, 0, 'bgLayer1');
        this.bg[1] = jogo.add.sprite(jogo.width, 0, 'bgLayer1');
        this.bg[2] = jogo.add.sprite(0, alturaBg, 'bgLayer2');
        this.bg[3] = jogo.add.sprite(jogo.width, alturaBg, 'bgLayer2');
        this.bg[4] = jogo.add.sprite(0, alturaBg, 'bgLayer3');
        this.bg[5] = jogo.add.sprite(jogo.width, alturaBg, 'bgLayer3');
        this.bg[6] = jogo.add.sprite(0, jogo.height * 0.42, 'bgLayer4');
        this.bg[7] = jogo.add.sprite(jogo.width, jogo.height * 0.42, 'bgLayer4');

        var widthBg = 1 / this.bg[0].width * jogo.width;
        var heightBg = 0.9 / this.bg[0].height * jogo.height;

        this.bg[0].scale.setTo(widthBg, 1 / this.bg[0].height * jogo.height);
        this.bg[1].scale.setTo(widthBg, 1 / this.bg[1].height * jogo.height);
        this.bg[2].scale.setTo(widthBg, heightBg);
        this.bg[3].scale.setTo(widthBg, heightBg);
        this.bg[4].scale.setTo(widthBg, heightBg);
        this.bg[5].scale.setTo(widthBg, heightBg);
        this.bg[6].scale.setTo(widthBg, heightBg);
        this.bg[7].scale.setTo(widthBg, heightBg);


        jogo.physics.enable(this.bg[0], Phaser.Physics.ARCADE);
        jogo.physics.enable(this.bg[1], Phaser.Physics.ARCADE);
        jogo.physics.enable(this.bg[2], Phaser.Physics.ARCADE);
        jogo.physics.enable(this.bg[3], Phaser.Physics.ARCADE);
        jogo.physics.enable(this.bg[4], Phaser.Physics.ARCADE);
        jogo.physics.enable(this.bg[5], Phaser.Physics.ARCADE);
        jogo.physics.enable(this.bg[6], Phaser.Physics.ARCADE);
        jogo.physics.enable(this.bg[7], Phaser.Physics.ARCADE);

        var bgVelocity = -70;

        this.bg[0].body.velocity.x = bgVelocity;
        this.bg[1].body.velocity.x = bgVelocity;
        this.bg[2].body.velocity.x = bgVelocity * 2;
        this.bg[3].body.velocity.x = bgVelocity * 2;
        this.bg[4].body.velocity.x = bgVelocity * 3;
        this.bg[5].body.velocity.x = bgVelocity * 3;
        this.bg[6].body.velocity.x = bgVelocity * 5;
        this.bg[7].body.velocity.x = bgVelocity * 5;
    },

    reiniciar: function () {
        jogo.state.start('principal');
    },

};

