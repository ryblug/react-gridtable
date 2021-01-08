import React from 'react'

function Cell(props) {
    return (
        <td
            style={{ height: '40px', width: '100px', backgroundColor: props.status ? 'green' : '' }}
            onMouseDown={props.onTouchStart}
            onMouseMove={props.onTouchMove}
        ></td>
    )
}

export default Cell;