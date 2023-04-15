import React from 'react';
import { useState } from 'react';
import ReactSwitch from 'react-switch';

function Square({ value, onSquareClick, className }) {
  //className - 'class' keyword equivalent in React
  //<button> - JSX element
  if (className) {
    return (
      <button className={`square ${className}`} onClick={onSquareClick}>{value}</button>
    )
  }
  return <button className='square' onClick={onSquareClick}>{value}</button>
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return

    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  const winRow = calculateWinner(squares)

  function checkSquare(a, b, c, square, index) {
    if ((a === index && squares[a] === square) || (b === index && squares[b] === square) || (c === index && squares[c] === square)) { // winningRow[0] = a ... a === index && squares[a] == square
      return true
    } else {
      return false
    }
  }

  //2. Rewrite Board to use two loops to make the squares instead of hardcoding them.
  let status
  const rows = [1, 2, 3]
  const board = rows.map(row => {
    const starting = (row - 1) * 3
    const ending = row * 3
    //console.log(ending)
    const sliced = squares.slice(starting, ending)
    //console.log(sliced) 
    return (
      <div className='board-row' key={row}>{
        sliced.map((square, index) => {

          //4. When someone wins, highlight the three squares that caused the win...
          if (winRow) {
            const winner = winRow.winner
            const winningRow = winRow.winningRow
            const [a, b, c] = winningRow
            status = "Winner: " + winner
            if (checkSquare(a, b, c, square, (starting + index))) {
              return <Square value={square} onSquareClick={() => handleClick(starting + index)} key={starting + index} className={'colored'} />
            } else {
              return <Square value={square} onSquareClick={() => handleClick(starting + index)} key={starting + index} className={''} />
            }
          } else {
            //4. ... and when no one wins, display a message about the result being a draw
            if (currentMove === 9 && !calculateWinner(squares)) {
              status = 'No winner'
            } else {
              status = "Next player: " + (xIsNext ? "X" : "O")
            }
            return <Square value={square} onSquareClick={() => handleClick(starting + index)} key={starting + index} className={''} />
          }

        })
      }
      </div>
    )
  })



  return (
    <div>
      <div className='status'>{status}</div>
      {board}
    </div>
  )
}


//export - makes the function accessible outside of App.js
//default - tells other files that it's the main function in App.js
export default function Game() {
  //Array(9).fill(null) creates an array with nine elements and sets each of them to null
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [checked, setChecked] = useState(true)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]
  //console.log(currentSquares)

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  function handleChange(val) {
    //console.log(val)
    setChecked(val)
  }


  //console.log(history[currentMove])
  const moves = history.map((squares, move) => {
    let description

    if (move > 0) {
      description = 'Go to move #' + move// + ' (' + positions[1 + move%3][0] + ', ' + positions[1 + move%3][1] + ')'
    } else {
      description = 'Go to game start'
    }

    //It’s strongly recommended that you assign proper keys whenever you build dynamic lists
    //1. For the current move only, show “You are at move #…” instead of a button.
    if (move === currentMove) {
      if (currentMove === 0) {
        description = 'You are at move #' + move
      } else {
        description = 'You are at move #' + move //+ ' (' + positions[move - 1][0] + ', ' + positions[move - 1][1] + ')'
      }
      return (
        <li key={move}>{description}</li>
      )
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  //3.Add a toggle button that lets you sort the moves in either ascending or descending order.
  const copyOfMoves = moves.slice(0).reverse()
  const renderMoves = () => {
    if (!checked) {
      return (
        <ol>{copyOfMoves}</ol>
      )
    } else {
      return (
        <ol>{moves}</ol>
      )
    }
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className='game-info'>
        {renderMoves()}
      </div>
      <div className='toggleSwitch'>
        <div className='app' style={{ textAlign: "center" }}>
          <ReactSwitch checked={checked} onChange={handleChange} />
        </div>
        <p className='status'>Sort ascending</p>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winRow = {
        winner: squares[a],
        winningRow: lines[i]
      }
      return winRow
    }
  }
  return null
}