/// <reference path="phaser.min.js" />

window.addEventListener('load', body_onload);

var jogo;
function body_onload() {
    jogo = new Phaser.Game(700, 400, Phaser.AUTO, 'gameDiv');
    jogo.global = {
        pontuacao: 0
    };

    jogo.state.add('boot', bootState);
    jogo.state.add('carregar', carregarState);
    jogo.state.add('menu', menuState);
    jogo.state.add('jogar', jogarState);
    jogo.state.start('boot');
}