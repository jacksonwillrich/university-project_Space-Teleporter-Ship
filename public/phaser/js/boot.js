var bootState = {

    preload: function () {
        jogo.load.image('progressBar', 'assets/imagens/progressBar.png');
    },

    create: function () {
        jogo.stage.backgroundColor = '#3498DB';
        jogo.physics.startSystem(Phaser.Physics.ARCADE);
        jogo.state.start('carregar');

    }

};