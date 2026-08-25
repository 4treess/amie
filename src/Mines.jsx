import React, { useState, useEffect } from 'react';
import { Bomb, RefreshCw, Trophy, Heart, HeartCrack, Gem, Egg, EggFried, Smile, Frown, Bone, Flower2, FireExtinguisher, Flame, Ham, CircleArrowLeft, ArrowRight, Users, User } from 'lucide-react';
import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

// Socket instance initialized outside component to prevent multiple connections on re-render
const socket = io('https://amie-server-mdhz.onrender.com', {
  autoConnect: false
});

const Mines = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('singleplayer'); // 'singleplayer' | 'multiplayer'
  const [isJoined, setIsJoined] = useState(false);

  // 1. GAME CONTROLS STATE (Configuration inputs)
  const minRowCol = 2;

  const [SafeIcon, setSafeIcon] = useState(() => Gem)
  const [BombIcon, setBombIcon] = useState(() => Bomb)
  const [gameStatus, setGameStatus] = useState("Lobby")
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [minesCount, setMinesCount] = useState(4);
  const [giftCount, setGiftCount] = useState(0);
  const [nukeCount, setNukeCount] = useState(0);
  const [roundsCount, setRoundsCount] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);

  // Multiplayer States
  const [RoomID, setRoomID] = useState("");
  const [nickname, setNickname] = useState("");
  const [playersList, setPlayersList] = useState({});

  // Persistent Player ID
  const [playerID] = useState(() => {
    let saved = localStorage.getItem('mines_player_id');
    if (!saved) {
      saved = crypto.randomUUID();
      localStorage.setItem('mines_player_id', saved);
    }
    return saved;
  });

  // 2. BOARD STATE (Dummy visual layout to start)
  const [board, setBoard] = useState([
    [
      { row: 0, col: 0, isMine: false, visible: true },
      { row: 0, col: 1, isMine: false, visible: true },
    ],
    [
      { row: 1, col: 0, isMine: false, visible: true },
      { row: 1, col: 1, isMine: true, visible: true },
    ]
  ]);

  // Socket connection lifecycle for Multiplayer Tab
  useEffect(() => {
    if (!isJoined || activeTab !== 'multiplayer') return;

    socket.connect();

    socket.emit('joinGame', {
      roomID: RoomID,
      playerID: playerID,
      nickname: nickname,
      status: gameStatus
    });

    socket.on('room_status_update', (roomData) => {
      setPlayersList(roomData.players || {});
      if (roomData.gameState) setGameStatus(roomData.gameState);
      setRoundsCount(roomData.rounds);

      const playerIDs = Object.keys(roomData.players || {});
      playerIDs.forEach(element => {
        if(element === playerID){
          if (roomData.players[element].rows) setRows(roomData.players[element].rows);
          if (roomData.players[element].cols) setCols(roomData.players[element].cols);
          if (roomData.players[element].mines) setMinesCount(roomData.players[element].mines);
          if (roomData.players[element].nukes !== undefined) setNukeCount(roomData.players[element].nukes);
          if (roomData.players[element].gifts !== undefined) setGiftCount(roomData.players[element].gifts);
        }
      });
    });

    socket.on('start_game', ({ room }) => {
      socket.emit('room_status_update', room);
      handleStartNewGame(room);
    });

    socket.on('round_over', ({ room }) => {
      socket.emit('room_status_update', room);

      if (room.gameState === "Lobby") {
        setGameStatus("Lobby");
      } else {
        setGameStatus("Finished");
      }
    });

    return () => {
      socket.off('room_status_update');
      socket.off('start_game');
      socket.off('round_over');
      socket.disconnect();
    };
  }, [isJoined, activeTab, RoomID, playerID, nickname]);

  // Sync settings when inputs change in multiplayer
  useEffect(() => {
    if (isJoined && activeTab === 'multiplayer' && RoomID) {
      socket.emit('changeSettings', {
        roomID: RoomID,
        rows: rows,
        cols: cols,
        mines: minesCount,
        rounds: roundsCount
      });
    }
  }, [rows, cols, minesCount, roundsCount, isJoined, activeTab, RoomID]);

  const revealBoard = () => {
      for(const i of board){
          for(const j of i){
              j.visible = true;
          }
      }
      if(roundsCount > 0){
        if(currentRound + 1 > roundsCount){
          setGameStatus("Lobby");
        } else {
          setCurrentRound(currentRound + 1);
        }
      }
    }

  // 3. HANDLERS (Placeholders for your game logic)
  const handleStartNewGame = (settings = null) => {
    
    const targetRows = settings?.rows ?? rows;
    const targetCols = settings?.cols ?? cols;
    const targetMines = settings?.mines ?? minesCount;
    const targetRounds = settings?.rounds ?? roundsCount;

        // Prevents the data from exceeding its bounds, and prevents fractional amounts
        const sanitizeData = (data, min) => {
            data = Number(data)
            if(data > min){
                return Math.floor(data);
            }
            return min;
        }
        
        const createCell = (r, c) => ({
            row: r,
            col: c,
            isMine: false,
            visible: false,
        });

        const handleRoundEnd = () => {
          if(targetRounds > 0){
            if(currentRound + 1 > targetRounds){
              setGameStatus("Lobby");
            } else {
              setCurrentRound(currentRound + 1);
            }
          }
        };

        // Randomizes the locations of the mines on the game board
        const randomizeMines = (board, rows, cols, mines) => {
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

        const randomizeIcons = () => {
          let randomNum = Math.floor(Math.random() * 101)
          if(randomNum < 50){
            if(randomNum < 25){
              setSafeIcon(() => Heart);
              setBombIcon(() => HeartCrack);
            }else{
              setSafeIcon(() => Gem);
              setBombIcon(() => Bomb);
            }
          }else{
            if(randomNum < 76){
              if(randomNum > 50){
                setSafeIcon(() => Smile);
                setBombIcon(() => Frown);
              }else{
                setSafeIcon(() => FireExtinguisher);
                setBombIcon(() => Flame);
              }
            } else{
              if(randomNum === 100){
                setSafeIcon(() => Egg);
                setBombIcon(() => EggFried);
              } else{
                setSafeIcon(() => Ham);
                setBombIcon(() => Bone);
              }
            }
          }
        }

        if(gameStatus === "Lobby"){
          setPoints(0);
          setCurrentRound(1);
        }
        if(gameStatus === "In Game" || gameStatus === "Waiting For Other Players"){
            handleRoundEnd();
        } else{
          setGameStatus("In Game")
        }
        setClicks(0);
        setRoundsCount(Number(targetRounds))

        let validRows = sanitizeData(targetRows, minRowCol);
        setRows(validRows);
        let validCols = sanitizeData(targetCols, minRowCol);
        setCols(validCols);

        const minMines = Math.floor(Math.sqrt(validRows*validCols -1));
        let validMinesCount = sanitizeData(targetMines, minMines);

        if(validMinesCount >= (validRows * validCols)){
            validMinesCount = validRows * validCols - 1;
        }
        setMinesCount(validMinesCount);
        console.log(`Starting new game with ${validRows}x${validCols} grid and ${validMinesCount} mines`);

        let tempBoard = []
        for(let i = 0; i < validRows; i++){
            let row = [];
            for(let j = 0; j < validCols; j++){
                row.push(createCell(i, j));
            }
            tempBoard.push(row);
        }

        randomizeIcons();
        randomizeMines(tempBoard, validRows, validCols, validMinesCount);

        setBoard(tempBoard);
  };

  const handleCellClick = (rowIndex, colIndex) => {
  const handleMine = () => {
    setGameStatus("Blown Up");
    revealBoard();

    if (activeTab === 'multiplayer' && isJoined) {
      // Emit the current accumulated points on mine hit
      socket.emit('endGame', {
        roomID: RoomID,
        playerID: playerID,
        score: points, 
        status: "Blown Up",
        rounds: roundsCount,
        currentRound: currentRound
      });
    }
  };

  const handleSafeCell = () => {
    let turnsLeft = rows * cols - minesCount - nukeCount - clicks;
    let earnedPoints = (100 * minesCount) / turnsLeft;
    
    // 1. Calculate the actual new score value synchronously
    const updatedPoints = points + earnedPoints;
    
    // 2. Update local state
    setPoints(updatedPoints);

    if (turnsLeft <= 1) {
      setGameStatus("Victory");
      revealBoard();

      // 3. Emit victory with the exact updatedPoints variable
      if (activeTab === 'multiplayer' && isJoined) {
        socket.emit('endGame', {
          roomID: RoomID,
          playerID: playerID,
          score: updatedPoints,
          status: "Victory",
          rounds: roundsCount,
          currentRound: currentRound
        });
      }
    }
  };

  if (!board[rowIndex][colIndex].visible) {
    board[rowIndex][colIndex].visible = true;
    if (board[rowIndex][colIndex].isMine) {
      handleMine();
    } else {
      handleSafeCell();
    }
    setClicks(clicks + 1);
  }
};

  const handleJoinMultiplayer = (e) => {
    e.preventDefault();
    if (!RoomID.trim() || !nickname.trim()) return;
    setIsJoined(true);
    setGameStatus("Lobby");
  };

  const handleLeaveMultiplayer = () => {
    socket.disconnect();
    setIsJoined(false);
    setGameStatus("Lobby");
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

      <div className="max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl border border-rose-100 font-sans text-slate-700 mt-6">
        {/* MODE TABS */}
        <div className="flex gap-2 border-b border-rose-100 mb-6">
          <button
            onClick={() => { setActiveTab('singleplayer'); handleLeaveMultiplayer(); }}
            className={`flex-1 py-2 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'singleplayer'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <User size={16} /> Singleplayer
          </button>
          <button
            onClick={() => setActiveTab('multiplayer')}
            className={`flex-1 py-2 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'multiplayer'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users size={16} /> Multiplayer
          </button>
        </div>

        {/* MULTIPLAYER PROMPT FORM */}
        {activeTab === 'multiplayer' && !isJoined ? (
          <form onSubmit={handleJoinMultiplayer} className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-serif font-bold text-slate-800">Join a Room</h3>
              <p className="text-xs text-slate-400">Enter a Room Name and your Nickname to get started.</p>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Multiplayer Room</label>
              <input 
                type="text" 
                required
                value={RoomID}
                onChange={(e) => setRoomID(e.target.value)}
                className="w-full p-2 bg-rose-50 rounded-xl text-center font-bold text-slate-700 outline-none"
                placeholder="e.g. ROOM123"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Multiplayer Name</label>
              <input 
                type="text" 
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-2 bg-rose-50 rounded-xl text-center font-bold text-slate-700 outline-none"
                placeholder="e.g. PlayerOne"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-rose-400 text-white font-bold rounded-xl shadow-md shadow-rose-200 hover:bg-rose-500 transition-all flex items-center justify-center gap-2 mt-4 hover:scale-105"
            >
              Enter Room 🚀
            </button>
          </form>
        ) : (
          /* GAME SCREEN (Identical for Singleplayer & Multiplayer) */
          <>
            {/* HEADER & CONTROLS */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif text-slate-800 flex items-center justify-center gap-2">
                <Bomb className="text-rose-500" size={24} /> Mines!
              </h2>
              <p className="text-xs text-slate-400 mt-1">Configure your board and test your luck!</p>
              {activeTab === 'multiplayer' && (
                <p className="text-xs font-bold text-rose-500 mt-1">
                  Room: {RoomID} | Player: {nickname}
                </p>
              )}
            </div>

            {/* INPUT CONTROLS ROW */}
            {gameStatus === "Lobby" && <div className="grid grid-cols-2 gap-2 mb-6">
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
                  className="w-full p-2 bg-rose-50 rounded-xl text-center font-bold text-slate-700 outline-none invalid:text-red-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Rounds</label>
                <input 
                  type="number" 
                  min="0"
                  max="10"
                  value={roundsCount} 
                  onChange={(e) => setRoundsCount(e.target.value)}
                  className="w-full p-2 bg-rose-50 rounded-xl text-center font-bold text-slate-700 outline-none invalid:text-red-500"
                />
              </div>
            </div>}

            {/* LOBBY / LEAVE BUTTON */}
            {gameStatus !== "Lobby" && <button 
              onClick={() => {
                setGameStatus("Lobby");
                if (activeTab === 'multiplayer');
              }}
              className="w-full py-3 bg-rose-400 text-white font-bold rounded-xl shadow-md shadow-rose-200 hover:bg-rose-500 transition-all flex items-center justify-center gap-2 mb-6 hover:scale-105"
            >
              <CircleArrowLeft size={18} /> Return To Lobby
            </button>}

            {/* RESET / START BUTTON */}
            {
              <button 
                onClick={() => {
                  if (activeTab === 'multiplayer' && gameStatus === "Lobby") {
                    socket.emit("startGame", { roomID: RoomID });
                  } else {
                    handleStartNewGame();
                  }
                }}
                className="w-full py-3 bg-rose-400 text-white font-bold rounded-xl shadow-md shadow-rose-200 hover:bg-rose-500 transition-all flex items-center justify-center gap-2 mb-6 hover:scale-105"
              >
              {roundsCount > 0 && roundsCount >= currentRound && gameStatus !== "Lobby" ? <span className="flex items-center gap-1.5"> Next Round <ArrowRight size={18}/> </span> : <span className='flex items-center gap-1.5'> New Game <RefreshCw size={18} /> </span>}
              </button>
            }

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
                            ? 'bg-black-500' 
                            : 'bg-white text-slate-600'
                          : 'bg-rose-300 hover:bg-rose-400 text-transparent'
                      }`}
                    >
                      {/* Visual content of the cell */}
                      {cell.visible ? (cell.isMine ? <BombIcon size={20} className={gameStatus === "Victory" ? "text-green-500" : "text-red-500"}/> : <SafeIcon size={20} className={gameStatus === "Victory" ? "text-green-500": gameStatus === "Blown Up" ? "text-red-500" : "text-black-500"}/>) : '?'}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* SCORE / STATUS DISPLAY */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-3">
              {activeTab === 'multiplayer' ? (
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    Leaderboard
                  </h4>
                  <div className="space-y-2">
                    {Object.values(playersList)
                      .sort((a, b) => (b.score || 0) - (a.score || 0)) // Sort highest score first
                      .map((player, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg shadow-sm border border-slate-100">
                          <div>
                            <span className="font-bold text-slate-800">{player.nickname || 'Player'}</span>
                            <span className="ml-2 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                              {player.status || 'Lobby'}
                            </span>
                          </div>
                          <div className="font-bold text-rose-500">
                            {Math.round((player.score || 0) * 100) / 100} pts
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                /* SINGLEPLAYER DISPLAY */
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <div>
                    Status: <span className="font-bold text-rose-500 uppercase">{gameStatus}</span>
                  </div>
                  {roundsCount > 0 && (
                    <div>
                      Round: <span className="font-bold text-rose-500">{currentRound} / {roundsCount}</span>
                    </div>
                  )}
                  <div>
                    Points: <span className="font-bold text-rose-500">{Math.round(points * 100) / 100}</span>
                  </div>
                </div>
              )}
            </div>
            
          </>
        )}

      </div>
    </div>
  );
};

export default Mines;