/* eslint-disable no-mixed-spaces-and-tabs, no-console, no-undef, no-unreachable, no-prototype-builtins */
/* eslint-env node, mocha */

'use strict'

export default class Game {

    constructor() {
        // Default settings
        this.score = 0
        this.lines = 19

        this.points = {
            '1': 40,
            '2': 100,
            '3': 300,
            '4': 1200
        }

        this.playfield = this.createPlayfield()
            
        this.activePiece = this.createPiece()
        this.nextPiece = this.createPiece()
    }

    get level () {
        return Math.floor(this.lines * 0.1)
    }

    getState() {
        const playfield = this.createPlayfield()
        const { x: pX, y: pY, blocks } = this.activePiece

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = []

            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x]
            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    playfield[pY + y][pX + x] = blocks[y][x]
                }
            }
        }

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playfield
        }
    }
    
    createPlayfield() {
        const playfield = []

        for (let y = 0; y < 20; y++) {
            playfield[y] = []

            for (let x = 0; x < 10; x++) {
                playfield[y][x] = 0
            }
        }

        return playfield
    }

    createPiece() {
        const index = Math.floor(Math.random () * 7)
        const type = 'IJLOSTZ'[index]
        const piece = { }

        switch(type) {
            case 'I': 
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
                break
            case 'J': 
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2]
                ]
                break
            case 'L': 
                piece.blocks = [
                    [0, 0, 0],
                    [3, 3, 3],
                    [4, 0, 0]
                ]
                break
            case 'O': 
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0]
                ]
                break
            case 'S': 
                piece.blocks = [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0]
                ]
                break
            case 'T':
                piece.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 6, 0]
                ] 
                break
            case 'Z': 
                piece.blocks = [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7]
                ]
                break
            default:
                throw new Error('Неизвестная фигура')
        }

        piece.x = Math.floor((10 - piece.blocks[0].length) / 2)
        piece.y = 0

        return piece
    }

    movePieceLeft() {
        this.activePiece.x -= 1

        if (this.hasCollision()) {
            this.activePiece.x += 1
        }
    }

    movePieceRight() {
        this.activePiece.x += 1

        if (this.hasCollision()) {
            this.activePiece.x -= 1
        }
    }

    movePieceDown() {
        this.activePiece.y += 1

        if (this.hasCollision()) {
            this.activePiece.y -= 1
            this.lockPiece()
            const clearedLines = this.clearLines()
            this.updateScore(clearedLines)
            this.updatePiece()
        }
    }

    rotatePiece() {
       this.rotateBlocks()

        if (this.hasCollision()) {
            this.rotateBlocks(false)
        }
    }

    rotateBlocks(clockwise = true) {
        const blocks = this.activePiece.blocks
        const length = blocks.length
        const x = Math.floor(length / 2)
        const y = length - 1

        for (let i = 0; i < x; i++) {
            for (let j = i; j < y - i; j++) {
                const temp = blocks[i][j]

                if (clockwise) {
                    blocks[i][j] = blocks[y - j][i]
                    blocks[y - j][i] = blocks[y - i][y - j]
                    blocks[y - i][y - j] = blocks[j][y - i]
                    blocks[j][y - i] = temp
                } else {
                    blocks[i][j] = blocks[j][y - i]
                    blocks[j][y - i] = blocks[y - i][y - j]
                    blocks[y - i][y - j] = blocks[y - j][i]
                    blocks[y - j][i] = temp
                }
            }
        }
    }

    hasCollision() {
        const playfield = this.playfield 
        const { x: pX, y: pY, blocks } = this.activePiece

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] &&
                    ((playfield[pY + y] === undefined || playfield[pY + y][pX + x] === undefined) || 
                    playfield[pY + y][pX + x])
                ) {
                    return true
                }
            }
        }

        return false
    }

    lockPiece() {
        const playfield = this.playfield 
        const { x: pX, y: pY, blocks } = this.activePiece

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    playfield[pY + y][pX + x] = blocks[y][x]
                }
            }
        }
    }

    clearLines () {
        const rows = 20
        const columns = 10
        let lines = []

        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0

            for (let x = 0; x < columns; x++) {
                if (this.playfield[y][x]) {
                    numberOfBlocks += 1 
                }
            }

            if (numberOfBlocks === 0) {
                break 
            } else if (numberOfBlocks < columns) {
                continue
            } else if (numberOfBlocks === columns) {
                lines.unshift(y)
            }
        }

        for (let index of lines) {
            this.playfield.splice(index, 1)
            this.playfield.unshift(new Array(columns).fill(0))
        }

        return lines.length
    }

    updateScore(clearedLines) {
        if (clearedLines > 0) {
            this.score = this.points[clearedLines] * (this.level + 1)
            this.lines += clearedLines            
        }
    }

    updatePiece() {
        this.activePiece = this.nextPiece 
        this.nextPiece = this.createPiece()
    }  

}

Game.extend = Game.prototype.extend = function (to, from) {
    if (typeof to === 'object' && typeof from === 'object') {
        for (var pro in from) {
            if (from.hasOwnProperty(pro)) {
                to[pro] = from[pro]
            }
        }
    }
}