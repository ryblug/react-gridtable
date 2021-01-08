import React, { useState, useEffect } from 'react'
import Cell from './cell';

function Table(props) {
  const [started, setStarted] = useState(false)
  const [mode, setMode] = useState(true)
  const [coords, setCoords] = useState({
    startRow: -1,
    endRow: -1,
    startCol: -1,
    endCol: -1
  })
  const [localCells, setLocalCells] = useState([])
  useEffect(() => {

    window.addEventListener("mouseup", handleTouchEnd);
    window.addEventListener("touchend", handleTouchEnd);

    return function cleanup() {
      window.removeEventListener("mouseup", handleTouchEnd);
      window.removeEventListener("touchend", handleTouchEnd);
    }
  })

  const calcCellIndex = (rowIndex, cellIndex) => {
    return rowIndex * props.rowCount + cellIndex + rowIndex
  }

  const isClick = event => {
    return event.button === 0 || event.type !== 'mousedown'
  }

  const calcRanges = (value1, value2) => {
    if (value1 <= value2) return { start: value1, end: value2 }
    return { start: value2, end: value1 }
  }

  const handleTouchStart = (event, rowIndex, cellIndex) => {
    if (!started && isClick(event)) {
      event.preventDefault();
      const mode = !props.cells[calcCellIndex(rowIndex, cellIndex)]
      const localCells = [...props.cells]
      localCells[calcCellIndex(rowIndex, cellIndex)] = mode
      setStarted(true)
      setCoords({
        startRow: rowIndex,
        startCol: cellIndex,
        endRow: rowIndex,
        endCol: cellIndex
      })
      setMode(mode)
      setLocalCells(localCells)
    }
  }

  const handleTouchEnd = event => {
    if (started && isClick(event)) {
      const rowIndexes = calcRanges(coords.startRow, coords.endRow)
      const colIndexes = calcRanges(coords.startCol, coords.endCol)
      for (let rowIndex = rowIndexes.start; rowIndex <= rowIndexes.end; rowIndex++) {
        for (let colIndex = colIndexes.start; colIndex <= colIndexes.end; colIndex++) {
          props.cells[calcCellIndex(rowIndex, colIndex)] =
            localCells[calcCellIndex(rowIndex, colIndex)]
        }
      }
      setStarted(false)
      setLocalCells([])
    }
  }

  const handleTouchMove = (event, rowIndex, cellIndex) => {
    if (started) {
      event.preventDefault();

      const newCoords = { ...coords, endRow: rowIndex, endCol: cellIndex }
      const newLocalCells = [...localCells]

      const rowIndexes = calcRanges(newCoords.startRow, newCoords.endRow)
      const colIndexes = calcRanges(newCoords.startCol, newCoords.endCol)

      for (let rowIndex = 0; rowIndex < props.rowCount; rowIndex++) {
        for (let colIndex = 0; colIndex < props.cellPerRow; colIndex++) {
          newLocalCells[calcCellIndex(rowIndex, colIndex)] = false
          if (rowIndex >= rowIndexes.start && rowIndex <= rowIndexes.end &&
            colIndex >= colIndexes.start && colIndex <= colIndexes.end) {
            newLocalCells[calcCellIndex(rowIndex, colIndex)] = mode
          }
        }
      }

      setCoords(newCoords)
      setLocalCells(newLocalCells)
    }
  }

  const renderRow = (rowIndex) => {
    const renderCells = [...props.cells]
    if (localCells.length) {
      const rowIndexes = calcRanges(coords.startRow, coords.endRow)
      const colIndexes = calcRanges(coords.startCol, coords.endCol)
      for (let rowIndex = rowIndexes.start; rowIndex <= rowIndexes.end; rowIndex++) {
        for (let colIndex = colIndexes.start; colIndex <= colIndexes.end; colIndex++) {
          renderCells[calcCellIndex(rowIndex, colIndex)] =
            localCells[calcCellIndex(rowIndex, colIndex)]
        }
      }
    }

    return (
      <tr key={rowIndex}>
        {[...Array(props.cellPerRow).keys()].map((_, cellIndex) => (
          <Cell
            onTouchStart={(e) => handleTouchStart(e, rowIndex, cellIndex)}
            onTouchMove={(e) => handleTouchMove(e, rowIndex, cellIndex)}
            index={calcCellIndex(rowIndex, cellIndex)}
            status={renderCells[calcCellIndex(rowIndex, cellIndex)]}
          />
        ))}
      </tr>
    )
  }

  return (
    <div>
      <table style={{ width: '300px', cursor: 'pointer' }} border="1">
        {[...Array(props.rowCount).keys()].map((_, index) => (
          renderRow(index)
        ))}
      </table>
    </div>
  )

}

export default Table