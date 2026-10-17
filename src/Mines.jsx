import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import mineSfx from 'assets/384113__microsoftsam__bang01.wav'
import safeSfx from 'assets/523425__andersmmg__ding-2.wav'
import nukeSfx from 'assets/587190__derplayer__explosion_04.wav'
import giftSfx from 'amie-babie/src/assets/620668__s11it0__happy-coin.wav'
import shieldSfx from 'amie-babie/src/assets/418194__deleted_user_3656686__hard-glass-impact.wav'
import { 
  Bomb, RefreshCw, Gift, Heart, HeartCrack, Gem, Egg, EggFried, 
  Smile, Frown, Bone, ShieldPlus, FireExtinguisher, Flame, Ham, 
  CircleArrowLeft, ArrowRight, Users, User, Radiation, Zap, IceCreamCone,
  ShieldCheck, TriangleAlert, Cake
} from 'lucide-react';
import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

// Socket instance initialized outside component to prevent multiple connections on re-render
const socket = io('https://amie-server-mdhz.onrender.com', {
  autoConnect: false,
  transports: ['websocket']
});

// Power-up active counters for execution
let shieldCount = 1;
let pickaxeTriggerChance = 0;
let minesLocatable = 0;
let giftCount = 0;

const Mines = () => {
  // Navigation & Mode State
  const [activeTab, setActiveTab] = useState('singleplayer'); // 'singleplayer' | 'multiplayer'
  const [isJoined, setIsJoined] = useState(false);

  // Power-Up Lists
  const minRowCol = 2;
  const powerUps = [
    { 
      type: "Shield", 
      value: 1, 
      description: (val) => `Protects you from blowing up on your first ${val === 1 ? "mine hit" : `${val} mines hit`}. Shields cannot protect you from a nuke!` 
    },
    { 
      type: "Pickaxe", 
      value: 1, 
      description: (val) => `Gives a ${val * 100}% chance to automatically reveal an extra safe tile on click.` 
    },
    { 
      type: "Mine Locator", 
      value: 1, 
      description: (val) => `Reveals the location of ${val === 1 ? `${val} mine` : `${val} mines`} on your board at game start.` 
    },
    { 
      type: "Gift", 
      value: 1, 
      description: (val) => `Places ${val === 1 ? `${val} tile` : `${val} tiles`} on the board that award ${giftMultiplier}x the points when clicked.` 
    },
    { 
      type: "None", 
      value: 0, 
      description: () => "No special power-up equipped." 
    }
  ];

  const multiplayerPowerUps = [
    { 
      type: "Extra Mines", 
      value: 2, 
      description: (val) => `Adds ${val === 1 ? `an extra mine` : `${val} extra mines`} to all opponents' boards.` 
    },
    { 
      type: "Shield", 
      value: 1, 
      description: (val) => `Protects you from blowing up on your first ${val === 1 ? "mine hit" : `${val} mines hit`}. Shields cannot protect you from a nuke!` 
    },
    { 
      type: "Pickaxe", 
      value: 1, 
      description: (val) => `Gives a ${val * 100}% chance to automatically reveal an extra safe tile on click.` 
    },
    { 
      type: "Mine Locator", 
      value: 2, 
      description: (val) => `Reveals the location of ${val === 1 ? `${val} mine` : `${val} mines`} on your board at game start.` 
    },
    { 
      type: "Gift", 
      value: 2, 
      description: (val) => `Places ${val === 1 ? `${val} tile` : `${val} tiles`} on the board that award ${giftMultiplier}x the points when clicked.` 
    },
    { 
      type: "Nuke", 
      value: 1, 
      description: (val) => `Adds ${val === 1 ? `a nuke tile` : `${val} nuke tiles`} to all opponents' boards that reduces their total points by 1/${nukePointPenality} if detonated. Shields cannot protect against a nuke.` 
    },
    { 
      type: "None", 
      value: 0, 
      description: () => "No special power-up equipped." 
    }
  ];
  const giftMultiplier = 10;
  const nukePointPenality = 2;

  // Board Icons & Game State
  const [SafeIcon, setSafeIcon] = useState(() => Gem);
  const [BombIcon, setBombIcon] = useState(() => Bomb);
  const [NukeIcon, setNukeIcon] = useState(() => Radiation);
  const [GiftIcon, setGiftIcon] = useState(() => Gift);
  const [ShieldIcon, setShieldIcon] = useState(() => ShieldPlus);
  const [gameStatus, setGameStatus] = useState("Lobby");
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [minesCount, setMinesCount] = useState(4);
  const [nukeCount, setNukeCount] = useState(0);
  const [roundsCount, setRoundsCount] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedPowerUp, setSelectedPowerUp] = useState({ type: "None", value: 0 });
  const [showDescription, setShowDescription] = useState(false);

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

  // Default Initial Board Layout
  const [board, setBoard] = useState([
    [
      { row: 0, col: 0, isMine: false, isGift: false, isNuke: false, isShield: false, visible: true },
      { row: 0, col: 1, isMine: false, isGift: false, isNuke: false, isShield: false, visible: true },
    ],
    [
      { row: 1, col: 0, isMine: false, isGift: false, isNuke: false, isShield: false, visible: true },
      { row: 1, col: 1, isMine: true, isGift: false, isNuke: false, isShield: false, visible: true },
    ]
  ]);

  // Socket Lifecycle Management
  useEffect(() => {
    if (!isJoined || activeTab !== 'multiplayer') return;

    socket.connect();

    socket.emit('joinGame', {
      roomID: RoomID,
      playerID: playerID,
      nickname: nickname,
      status: gameStatus,
      selectedPowerUp: selectedPowerUp
    });

    socket.on('room_settings_update', (roomData) => {
      setPlayersList(roomData.players || {});
      setRoundsCount(roomData.rounds);

      const myData = roomData.players?.[playerID];
      if (myData && roomData.state === "Lobby") {
        if (myData.rows) setRows(myData.rows);
        if (myData.cols) setCols(myData.cols);
        if (myData.mines) setMinesCount(myData.mines);
        if (myData.nukes !== undefined) setNukeCount(myData.nukes);
      }
    });

    socket.on('room_status_update', (roomData) => {
      setPlayersList(roomData.players || {});
      setRoundsCount(roomData.rounds);
    });

    socket.on('start_game', ({ room }) => {
      const myData = room.players[playerID];
      if (myData) {
        setRows(myData.rows);
        setCols(myData.cols);
        setMinesCount(myData.mines);
        setNukeCount(myData.nukes);
        if (myData.powerUp) {
          setSelectedPowerUp(myData.powerUp);
        }
      }
      handleStartNewGame(myData);
    });

    socket.on('round_over', (room) => {
      setPlayersList(room.players || {});
    });

    return () => {
      socket.off('room_status_update');
      socket.off('start_game');
      socket.off('round_over');
      socket.disconnect();
    };
  }, [isJoined, activeTab, RoomID, playerID, nickname]);

  // Sync settings whenever inputs or powerup choices change in multiplayer lobby
  useEffect(() => {
    if (isJoined && activeTab === 'multiplayer' && RoomID) {
      resetPowerUpUsages();

      socket.emit('changeSettings', {
        roomID: RoomID,
        rows: rows,
        cols: cols,
        mines: minesCount,
        rounds: roundsCount,
        selectedPowerUp: selectedPowerUp,
        playerID: playerID
      });
    }
  }, [rows, cols, minesCount, roundsCount, selectedPowerUp, isJoined, activeTab, RoomID]);

  // Sync selection between tabs
  useEffect(() => {
    const currentList = activeTab === "multiplayer" ? multiplayerPowerUps : powerUps;
    const match = currentList.find((p) => p.type === selectedPowerUp.type);

    if (match) {
      setSelectedPowerUp(match);
      resetPowerUpUsages();
    } else {
      setSelectedPowerUp({ type: "None", value: 0 });
    }
  }, [activeTab]);

  const revealBoard = () => {
    for (const i of board) {
      for (const j of i) {
        j.visible = true;
      }
    }
  };

  const resetPowerUpUsages = (settings = null) => {
    const currentList = activeTab === "multiplayer" ? multiplayerPowerUps : powerUps;
    const activePowerUp = settings?.powerUp ?? selectedPowerUp;
    const match = currentList.find((p) => p.type === activePowerUp.type) || activePowerUp;

    shieldCount = match.type === "Shield" ? match.value : 0;
    pickaxeTriggerChance = match.type === "Pickaxe" ? match.value : 0;
    minesLocatable = match.type === "Mine Locator" ? match.value : 0;
    giftCount = match.type === "Gift" ? match.value : 0;
  };

  const handleStartNewGame = (settings = null) => {
    // 1. Explicit Fallback Parameters (Prevents NaN)
    const targetRows = settings?.rows !== undefined ? settings.rows : rows;
    const targetCols = settings?.cols !== undefined ? settings.cols : cols;
    const targetMines = settings?.mines !== undefined ? settings.mines - (settings?.powerUp.type === "Extra Mines" ? settings.powerUp.value : 0) : minesCount;
    const targetNukes = settings?.nukes !== undefined ? settings.nukes - (settings?.powerUp.type === "Nuke" ? settings.powerUp.value : 0) : nukeCount;
    const targetRounds = settings?.rounds !== undefined ? settings.rounds : roundsCount;

    setNukeCount(targetNukes);

    const sanitizeData = (data, min) => {
      data = Number(data);
      return isNaN(data) || data < min ? min : Math.floor(data);
    };
    
    const createCell = (r, c) => ({
      row: r,
      col: c,
      isMine: false,
      isGift: false,
      isNuke: false,
      isShield: false,
      visible: false,
    });

    const randomizeBoard = (boardArr, rCount, cCount, mCount, nCount) => {
      let len = rCount * cCount;
      let listOfVals = Array.from({ length: len }, (_, index) => index);
      
      // Place Mines & Nukes
      for (let i = 0; i < mCount + nCount; i++) {
        if (len <= 0) break;
        let index = Math.floor(Math.random() * len);
        let number = listOfVals[index];

        let r = Math.floor(number / cCount);
        let c = Math.floor(number % cCount);

        if (i < nCount) {
          boardArr[r][c].isNuke = true;
        } else {
          if ((i - nCount) < minesLocatable) {
            boardArr[r][c].visible = true;
          }
          boardArr[r][c].isMine = true;
        }

        listOfVals.splice(index, 1);
        len--;
      }

      // Place Gifts
      let availableSpace = len;
      for (let i = 0; i < Math.min(giftCount, availableSpace); i++) {
        let index = Math.floor(Math.random() * len);
        let number = listOfVals[index];

        let r = Math.floor(number / cCount);
        let c = Math.floor(number % cCount);

        boardArr[r][c].isGift = true;

        listOfVals.splice(index, 1);
        len--;
      }
    };

    const randomizeIcons = () => {
      let randomNum = Math.floor(Math.random() * 101);
      if (randomNum < 50) {
        if (randomNum < 25) {
          setSafeIcon(() => Heart);
          setBombIcon(() => HeartCrack);
          if(randomNum === 0){
            setGiftIcon(() => Cake)
          }
        } else {
          setSafeIcon(() => Gem);
          setBombIcon(() => Bomb);
          if(randomNum === 32){
            setGiftIcon(() => IceCreamCone)
          }
        }
      } else {
        if (randomNum < 76) {
          if (randomNum > 50) {
            setSafeIcon(() => Smile);
            setBombIcon(() => Frown);
            if(randomNum === 75){
              setNukeIcon(() => TriangleAlert)
            }
          } else {
            setSafeIcon(() => FireExtinguisher);
            setBombIcon(() => Flame);
          }
        } else {
          if (randomNum === 100) {
            setSafeIcon(() => Egg);
            setBombIcon(() => EggFried);
          } else {
            setSafeIcon(() => Ham);
            setBombIcon(() => Bone);
            if(randomNum === 78){
              setShieldIcon(() => ShieldCheck);
            }
          }
        }
      }
    };

    if (gameStatus === "Lobby") {
      setPoints(0);
      socket.emit('resetPoints', { roomID: RoomID, playerID: playerID });
      setCurrentRound(1);
      setGameStatus("In Game");
      socket.emit('statusUpdate', { roomID: RoomID, playerID: playerID, status: "In Game" });
    } else {
      if (targetRounds > 0 && currentRound >= targetRounds) {
        setGameStatus("Lobby");
        socket.emit('statusUpdate', { roomID: RoomID, playerID: playerID, status: "Lobby" });
      } else {
        setCurrentRound((prev) => prev + 1);
        setGameStatus("In Game");
        socket.emit('statusUpdate', { roomID: RoomID, playerID: playerID, status: "In Game" });
      }
    }

    setClicks(0);
    setRoundsCount(Number(targetRounds));

    resetPowerUpUsages(settings);

    let validRows = sanitizeData(targetRows, minRowCol);
    setRows(validRows);
    let validCols = sanitizeData(targetCols, minRowCol);
    setCols(validCols);

    const minMines = Math.floor(Math.sqrt(validRows * validCols - 1));
    let validMinesCount = sanitizeData(targetMines, minMines);

    if (validMinesCount >= (validRows * validCols - targetNukes)) {
      validMinesCount = Math.max(1, validRows * validCols - targetNukes - 1);
    }
    setMinesCount(validMinesCount);

    let tempBoard = [];
    for (let i = 0; i < validRows; i++) {
      let row = [];
      for (let j = 0; j < validCols; j++) {
        row.push(createCell(i, j));
      }
      tempBoard.push(row);
    }

    randomizeIcons();
    randomizeBoard(tempBoard, validRows, validCols, validMinesCount, targetNukes);

    setBoard(tempBoard);
  };

  const handleCellClick = (rowIndex, colIndex, isUserClick = true) => {
    const [playMine] = useSound(mineSfx);
    const [playGift] = useSound(giftSfx);
    const [playSafe] = useSound(safeSfx);
    const [playNuke] = useSound(nukeSfx);
    const [playShield] = useSound(shieldSfx);

    const handleMine = () => {
      if (shieldCount > 0) {
        playShield();
        shieldCount -= 1;
        board[rowIndex][colIndex].isShield = true;
        board[rowIndex][colIndex].isMine = false;
        setPoints(points + 1);
        return;
      }
      playMine();
      setGameStatus("Blown Up");
      revealBoard();

      if (activeTab === 'multiplayer' && isJoined) {
        socket.emit('endGame', {
          roomID: RoomID,
          playerID: playerID,
          score: points, 
          status: "Blown Up"
        });
      }
    };

    const handleNuke = () => {
      playNuke();
      setGameStatus("Obliterated");
      revealBoard();

      let newPoints = points / nukePointPenality;
      setPoints(newPoints);

      if (activeTab === 'multiplayer' && isJoined) {
        socket.emit('endGame', {
          roomID: RoomID,
          playerID: playerID,
          score: newPoints, 
          status: "Obliterated"
        });
      }
    };

    const handleSafeCell = (multiplier) => {
      let turnsLeft = rows * cols - minesCount - nukeCount - clicks - (pickaxeTriggerChance > 0 ? 1 : 0);
      let earnedPoints = (100 * minesCount * multiplier) / Math.max(1, turnsLeft);
      
      const updatedPoints = points + earnedPoints;
      setPoints(updatedPoints);

      if (turnsLeft <= 1) {
        setGameStatus("Victory");
        revealBoard();

        if (activeTab === 'multiplayer' && isJoined) {
          socket.emit('endGame', {
            roomID: RoomID,
            playerID: playerID,
            score: updatedPoints,
            status: "Victory"
          });
        }
      }
    };

    const handlePickaxe = (chance) => {
      let len = rows * cols;
      let listOfVals = Array.from({ length: len }, (_, index) => index);
      if (Math.random() <= chance) {
        for (let i = 0; i < rows * cols; i++) {
          let index = Math.floor(Math.random() * len);
          let number = listOfVals[index];

          let row = Math.floor(number / cols);
          let col = Math.floor(number % cols);

          if (board[row][col].isMine || board[row][col].isNuke || board[row][col].visible) {
            listOfVals.splice(index, 1);
            len--;
          } else {
            handleCellClick(row, col, false);
            return;
          }  
        }
      }
    };

    if (!board[rowIndex][colIndex].visible) {
      board[rowIndex][colIndex].visible = true;
      if (board[rowIndex][colIndex].isMine) {
        handleMine();
      } else {
        if (board[rowIndex][colIndex].isNuke) {
          handleNuke();
        } else {
          if (board[rowIndex][colIndex].isGift) {
            playGift();
            handleSafeCell(giftMultiplier);
          } else {
            if(isUserClick){
              playSafe();
              handleSafeCell(1);
            } else {
              handleSafeCell(2.1);
            }
          }
        }
      }
      if (!board[rowIndex][colIndex].isShield) {
        setClicks(clicks + 1);
      }
      if (pickaxeTriggerChance > 0 && isUserClick) {
        handlePickaxe(pickaxeTriggerChance);
        handleSafeCell(1);
      }
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
    <div className='min-h-screen bg-rose-50 pb-12'>
      {/* NAV BAR */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-rose-500 font-serif text-xl font-bold flex items-center gap-2">
          <Heart size={20} className="text-blue-400 fill-blue-400" /> Amie + Trevor <Heart size={20} className="text-green-400 fill-green-400" />
        </h1>
        <Menu as="div" className="relative">
          <MenuButton className="text-rose-500 border-b-2 border-rose-500 hover:scale-105 transition-all">💣 Mines 💣</MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 bg-white border border-rose-100 shadow-xl rounded-xl overflow-hidden z-50 hover:scale-105 transition-all">
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
          <>
            {/* GAME HEADER */}
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

            {/* INPUT CONTROLS GRID */}
            {gameStatus === "Lobby" && (
              <div className="grid grid-cols-2 gap-2 mb-6">
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
                    min={Math.floor(Math.sqrt(rows * cols - 1))}
                    max={rows * cols - 1}
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
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Equipped Power-Up
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowDescription((prev) => !prev)}
                      className="text-[10px] font-bold uppercase text-rose-500 hover:text-rose-600 transition-colors cursor-pointer outline-none"
                    >
                      {showDescription ? "Hide Description" : "Show Description"}
                    </button>
                  </div>
                  
                  <select
                    value={selectedPowerUp.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const currentList = activeTab === "multiplayer" ? multiplayerPowerUps : powerUps;
                      const foundOption = currentList.find((p) => p.type === newType);

                      if (foundOption) {
                        setSelectedPowerUp(foundOption);
                      }
                    }}
                    className="w-full p-2 bg-rose-50 rounded-xl text-center font-bold text-slate-700 outline-none invalid:text-red-500"
                  >
                    {(activeTab === "multiplayer" ? multiplayerPowerUps : powerUps).map((option) => (
                      <option
                        key={option.type}
                        value={option.type}
                        className="w-full p-2 bg-rose-50 rounded-xl text-center font-bold text-slate-700 outline-none"
                      >
                        {option.type} ({option.value > 0 ? `+${option.value}` : 'None'})
                      </option>
                    ))}
                  </select>

                  {/* CONDITIONAL DESCRIPTION DISPLAY */}
                  {showDescription && (
                    <div className="mt-2 p-2.5 bg-rose-50/80 border border-rose-100 rounded-xl text-xs text-slate-600 animate-fadeIn">
                      <span className="font-bold text-rose-500 block mb-0.5">
                        {selectedPowerUp.type}
                      </span>
                      {typeof selectedPowerUp.description === 'function'
                        ? selectedPowerUp.description(selectedPowerUp.value)
                        : selectedPowerUp.description || "No description available."}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RETURN TO LOBBY BUTTON */}
            {gameStatus !== "Lobby" && (
              <button 
                onClick={() => {
                  setGameStatus("Lobby");
                  socket.emit('statusUpdate', { roomID: RoomID, playerID: playerID, status: "Lobby" });
                }}
                className="w-full py-3 bg-rose-400 text-white font-bold rounded-xl shadow-md shadow-rose-200 hover:bg-rose-500 transition-all flex items-center justify-center gap-2 mb-6 hover:scale-105"
              >
                <CircleArrowLeft size={18} /> Return To Lobby
              </button>
            )}

            {/* START / NEXT ROUND BUTTON */}
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
              {roundsCount > 0 && roundsCount >= currentRound && gameStatus !== "Lobby" ? (
                <span className="flex items-center gap-1.5"> Next Round <ArrowRight size={18}/> </span>
              ) : (
                <span className='flex items-center gap-1.5'> New Game <RefreshCw size={18} /> </span>
              )}
            </button>

            {/* BOARD GRID DISPLAY */}
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
                            ? 'bg-rose-200 text-white' 
                            : cell.isShield 
                              ? 'bg-emerald-400 text-green-500' 
                              : 'bg-white text-slate-600'
                          : 'bg-rose-300 hover:bg-rose-400 text-transparent'
                      }`}
                    >
                      {cell.visible ? (
                        cell.isMine ? (
                          <BombIcon size={20} className={gameStatus === "Victory" ? "text-green-500" : "text-red-500"} />
                        ) : cell.isNuke ? (
                          <NukeIcon size={20} className={gameStatus === "Victory" ? "text-green-500" : "text-red-500"} />
                        ) : cell.isGift ? (
                          <GiftIcon size={20} className={gameStatus === "Blown Up" || gameStatus === "Obliterated" ? "text-red-500" : "text-green-500"} />
                        ) : cell.isShield ? (
                          <ShieldIcon size={20} className={gameStatus === "Victory" ? "text-slate-600" : "text-red-500"} />
                        ) : (
                          <SafeIcon size={20} className={gameStatus === "Victory" ? "text-green-500" : gameStatus === "Blown Up" || gameStatus === "Obliterated" ? "text-red-500" : "text-slate-600"} />
                        )
                      ) : '?'}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* LEADERBOARD & STATS FOOTER */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-3">
              {activeTab === 'multiplayer' ? (
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
                    <span>Leaderboard</span>
                    {gameStatus !== "Lobby" && 
                      (<span className="text-[10px] text-slate-400 font-normal">
                        Mines: {minesCount} | Nukes: {nukeCount}
                      </span>)
                    }
                  </h4>
                  <div className="space-y-2">
                    {Object.values(playersList)
                      .sort((a, b) => (b.score || 0) - (a.score || 0))
                      .map((player, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg shadow-sm border border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{player.nickname || 'Player'}</span>
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                              {player.status || 'Lobby'}
                            </span>
                            {player.powerUp?.type && player.powerUp?.type !== "None" && gameStatus !== "Lobby" && player.status !== "Lobby" && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
                                <Zap size={10} /> {player.powerUp.type}
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-rose-500">
                            {Math.round((player.score || 0) * 100) / 100} pts
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
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