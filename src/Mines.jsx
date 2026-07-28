import React, { useState } from 'react';
import { Bomb, RefreshCw, Trophy, Heart} from 'lucide-react';
import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";
import { Link } from 'react-router-dom';

const Mines = () => {
  // 1. GAME CONTROLS STATE (Configuration inputs)
  const minRowCol = 2;

  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [minesCount, setMinesCount] = useState(4);

  // 2. BOARD STATE (Dummy visual layout to start)
  // In React, components re-render based on state updates rather than pure JS functions returning values.
  const [board, setBoard] = useState([
    [
      { row: 0, col: 0, isMine: false, visible: true },
      { row: 0, col: 1, isMine: true, visible: true },
    ],
    [
      { row: 1, col: 0, isMine: false, visible: false },
      { row: 1, col: 1, isMine: false, visible: true },
    ]
  ]);

  // 3. HANDLERS (Placeholders for your game logic)
  const handleStartNewGame = () => {
    console.log(`Starting new game with ${rows}x${cols} grid and ${minesCount} mines`);
        
        // Prevents the data from exceeding its bounds, and prevents fractional amounts
        const sanitizeData = (data, min) => {
            console.log(data, typeof(data));
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

        const randomizeMines = (board, rows, cols) => {
            let len = rows*cols;
            let listOfVals = Array.from({length: len}, (_, index) => index);
            for(let i = 0; i < minesCount; i++){
                let index = Math.floor(Math.random() * (len));
                let number = listOfVals[index]

                let row = Math.floor(number / cols);
                let col = Math.floor(number % cols);

                board[row][col].isMine = true;

                listOfVals.splice(index, 1);
                len--;
            }
        }

        let validRows = sanitizeData(rows, minRowCol);
        setRows(validRows);
        let validCols = sanitizeData(cols, minRowCol);
        setCols(validCols);

        const minMines = Math.floor(Math.sqrt(validRows*validCols -1));
        let validMinesCount = sanitizeData(minesCount, minMines);

        if(validMinesCount >= (validRows * validCols)){
            setMinesCount(validRows * validCols - 1);
        } else { 
            setMinesCount(validMinesCount);
        }

        let tempBoard = []
        for(let i = 0; i < validRows; i++){
            let row = [];
            for(let j = 0; j < validCols; j++){
                row.push(createCell(i, j));
            }
            tempBoard.push(row);
        }

        console.log(tempBoard, validCols, validRows, validMinesCount);

        randomizeMines(tempBoard, validRows, validCols);
        setBoard(tempBoard)
    // TODO: Call your board generation logic here and set setBoard(...)
  };

  const handleCellClick = (rowIndex, colIndex) => {
    console.log(`Clicked cell at row ${rowIndex}, col ${colIndex}`);
    // TODO: Handle cell click logic (check if mine, reveal cell, etc.)
  };

  return (
    <div className='min-h-screen bg-rose-50'>
      {/* NAV BAR */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-rose-500 font-serif text-xl font-bold flex items-center gap-2">
          <Heart size={20} className="text-blue-400 fill-blue-400" /> Amie + Trevor <Heart size={20} className="text-green-400 fill-green-400" />
        </h1>
        <Menu as="div" className="relative">
          <MenuButton className="text-rose-500 border-b-2 border-rose-500 hover:scale-105">💣 Mines 💣</MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 bg-white border border-rose-100 shadow-xl rounded-xl overflow-hidden z-50 hover:scale-105">
            <MenuItem>
                {({ active }) => (
                  <Link 
                    to="/" 
                    className={`block px-4 py-3 text-xs ${active ? 'bg-rose-50 text-rose-600' : 'text-slate-600'}`}
                  >
                    Relationship Timeline
                  </Link>
                )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <span className={`block px-4 py-3 text-xs ${active ? 'bg-rose-50 text-rose-600' : 'text-slate-600'}`}>
                  Coming Soon on Future Amieverseries!
                </span>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </nav>

      <div className="max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl border border-rose-100 font-sans text-slate-700">
        {/* HEADER & CONTROLS */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif text-slate-800 flex items-center justify-center gap-2">
            <Bomb className="text-rose-500" size={24} /> Mines!
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure your board and test your luck!</p>
        </div>

        {/* INPUT CONTROLS ROW */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Rows</label>
            <input 
              type="number" 
              min="2"
              value={rows} 
              onChange={(e) => setRows(e.target.value)}
              className="w-full p-2 bg-rose-50 rounded-xl text-center font-bold text-slate-700 outline-none invalid:text-red-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Cols</label>
            <input 
              type="number" 
              min="2"
              value={cols} 
              onChange={(e) => setCols(e.target.value)}
              className="w-full p-2 bg-rose-50 rounded-xl text-center font-bold text-slate-700 outline-none invalid:text-red-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Mines</label>
            <input 
              type="number" 
              min={Math.floor(Math.sqrt(rows*cols -1))}
              max={rows*cols - 1}
              value={minesCount} 
              onChange={(e) => setMinesCount(e.target.value)}
              className="w-full p-2 bg-rose-50 rounded-xl text-center font-bold text-slate-700 outline-non invalid:text-red-500"
            />
          </div>
        </div>

        {/* RESET / START BUTTON */}
        <button 
          onClick={handleStartNewGame}
          className="w-full py-3 bg-rose-400 text-white font-bold rounded-xl shadow-md shadow-rose-200 hover:bg-rose-500 transition-all flex items-center justify-center gap-2 mb-6 hover:scale-105"
        >
          <RefreshCw size={18} /> New Game
        </button>

        {/* THE GAME GRID DISPLAY */}
        <div className="flex justify-center mb-6">
          <div 
            className="grid gap-2 bg-rose-100 p-3 rounded-2xl"
            style={{ gridTemplateColumns: `repeat(${board[0]?.length || 2}, minmax(0, 1fr))` }}
          >
            {board.map((rowArray, rIdx) => 
              rowArray.map((cell, cIdx) => (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all shadow-sm ${
                    cell.visible 
                      ? cell.isMine 
                        ? 'bg-red-400 text-white' 
                        : 'bg-white text-slate-600'
                      : 'bg-rose-300 hover:bg-rose-400 text-transparent'
                  }`}
                >
                  {/* Visual content of the cell */}
                  {cell.visible ? (cell.isMine ? <Bomb size={20} /> : '✓') : '?'}
                </button>
              ))
            )}
          </div>
        </div>

        {/* SCORE / STATUS DISPLAY */}
        <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Trophy size={16} className="text-amber-400" /> Status:
          </div>
          <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
            In Progress
          </span>
        </div>

      </div>
    </div>
  );
};

export default Mines;