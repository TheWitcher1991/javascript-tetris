/* eslint-disable no-mixed-spaces-and-tabs, no-console, no-undef, no-unreachable */
/* eslint-env node, mocha */

'use strict'

import Game from './game.js'
import View from './view.js'

const root = document.querySelector('#root')

const game = new Game()
const view = new View(root, 480, 470, 20, 10)

window.game = game
window.view = view

document.addEventListener('keydown', event => {
    switch(event.keyCode) {
        case 37: 
            game.movePieceLeft()
            view.renderMainScreen(game.getState())
            break
        case 38:
            game.rotatePiece()
            view.renderMainScreen(game.getState())
            break
        case 39:  
            game.movePieceRight()
            view.renderMainScreen(game.getState())
            break 
        case 40:  
            game.movePieceDown()
            view.renderMainScreen(game.getState())
            break     
    }
}, false)

console.log(game)
console.log(view)