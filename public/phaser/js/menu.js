/// <reference path="phaser.min.js" />


var menuState = {

    create: () => {
        if(!jogo.global.pontuacao)
            jogo.global.pontuacao = 0;
        // note que nao usamos um sprite e sim uma image
        // z index é definido pela ordem de chamada do método image
        //jogo.add.image(0, 0, 'background');

        if (!jogo.music) {
            jogo.music = jogo.add.audio('music');
            jogo.music.volume *= 0.5;
            jogo.music.play();
        }

        var tituloLabel = jogo.add.text(jogo.width * 0.5, 80,
            'Space Teleporter Ship', {
                font: '50px Arial',
                fill: '#ffffff'
            });
        tituloLabel.anchor.setTo(0.5, 0.5);

        // #9
        // mover o titulo de -50 até 80 em 1 segundo
        var tween = jogo.add.tween(tituloLabel);
        tween.to({ y: 80 }, 1000);
        tween.easing(Phaser.Easing.Bounce.Out);
        tween.start();


        // utilizamos o objeto global para definir nossas variáveis compartilhadas
        var pontuacaoLabel = jogo.add.text(jogo.width / 2, jogo.height / 2,
            'Ultima pontuação: ' + parseInt(jogo.global.pontuacao),
            { font: '25px Arial', fill: '#FFFFFF' });

        pontuacaoLabel.anchor.setTo(0.5, 0.5);

        var iniciarLabel = jogo.add.text(jogo.width / 2, jogo.height - 80,
            'Pressione ESPAÇO para começar',
            { font: '25px Arial', fill: '#FFFFFF' });

        iniciarLabel.anchor.setTo(0.5, 0.5);

        var gameplayLabel = jogo.add.text(jogo.width / 2, jogo.height - 40,
            'Utilize ESPAÇO para teleportar durante o gameplay',
            { font: '25px Arial', fill: '#FFFFFF' });

        gameplayLabel.anchor.setTo(0.5, 0.5);

        var cimaKey = jogo.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        cimaKey.onDown.add(iniciar, jogo);

    },


    iniciar: () => {
        jogo.state.start('jogar');
    }


}

function iniciar() {
    jogo.state.start('jogar');
}