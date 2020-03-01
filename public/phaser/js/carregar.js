/// <reference path="phaser.min.js" />

var carregarState = {

    preload: function () {

        var loadingLabel = jogo.add.text(jogo.width * 0.5, 150,
            'carregando...', { font: '30px Arial', fill: '#ffffff' });

        loadingLabel.anchor.setTo(0.5, 0.5);

        jogo.load.image('bgLayer1', 'assets/imagens/bgLayer1.png');
        jogo.load.image('bgLayer2', 'assets/imagens/bgLayer2.png');
        jogo.load.image('bgLayer3', 'assets/imagens/bgLayer3.png');
        jogo.load.image('bgLayer4', 'assets/imagens/bgLayer4.png');

        jogo.load.image('background', 'assets/imagens/background.png');

        jogo.load.image('player', 'assets/imagens/spaceship.png');
        jogo.load.spritesheet('alvo', 'assets/imagens/alvo.png', 810, 529);

        jogo.load.image('ponto', 'assets/imagens/ponto.png');

        jogo.load.spritesheet('alerta', 'assets/imagens/alerta.png', 490, 390);
        jogo.load.spritesheet('inimigo1', 'assets/imagens/bullet1.png', 48, 48);

        jogo.load.spritesheet('explosao', 'assets/imagens/explosao.png', 97, 140);

        jogo.load.audio('teleport', ['assets/sons/teleport.wav']);
        jogo.load.audio('explosao', ['assets/sons/explosao.mp3']);
        jogo.load.audio('levelup', ['assets/sons/levelup.mp3']);

        jogo.load.audio('music', ['assets/sons/music.wav']);


    },

    create: () => {
        jogo.state.start('menu');
    }

}