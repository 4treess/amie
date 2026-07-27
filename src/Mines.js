// import React, { useState, useEffect } from 'react';

const Mines = () => {
    

    const createGameBoard = (rows, cols, mines) => {
        const minVal = 2;
        const minMines = 1;

        const sanitizeData = (data, min) => {
            if(typeof(data) === "number"){
                if(data > min){
                    return Math.floor(data);
                }
            }
            return min;
        }
        
        const createCell = (r, c) => ({
            row: r,
            col: c,
            isMine: false,
            visible: false,
        });

        const randomizeMines = (board, mines, rows, cols) => {
            let len = rows*cols;
            let listOfVals = Array.from({length: len}, (_, index) => index);
            for(let i = 0; i < mines; i++){
                let index = Math.floor(Math.random() * (len));
                let number = listOfVals[index]

                let row = Math.floor(number / cols);
                let col = Math.floor(number % cols);

                board[row][col].isMine = true;

                listOfVals.splice(index, 1);
                len--;
            }
        }

        const handleMine = (board) => {
            for(const i of board){
                for(const j of i){
                    j.visible = true;
                }
            }
        }

        const handleSafeCell = (board, row, col) => {
            // For use for points
        }

        const clickOnCell = (board, row, col) => {
            board[row][col].visible = true;
            if(board[row][col].isMine === true){
                handleMine(board)
            }
        }

        rows = sanitizeData(rows, minVal);
        cols = sanitizeData(cols, minVal);
        mines = sanitizeData(mines, minMines);

        if(mines >= (rows * cols)){
            mines = rows * cols - 1;
        }

        let board = []
        for(let i = 0; i < rows; i++){
            let row = [];
            for(let j = 0; j < cols; j++){
                row.push(createCell(i, j));
            }
            board.push(row);
        }

        randomizeMines(board, mines, rows, cols);
        console.log(board);
        clickOnCell(board, 0, 0);
        console.log(board);
        return board;
    }
}

createGameBoard(2, 2, 1);
