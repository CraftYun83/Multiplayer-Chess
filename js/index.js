
var highlightedSlot = undefined
var boardColor = undefined
var rows = ["8", "7", "6", "5", "4", "3", "2", "1"]
var columns = ["a", "b", "c", "d", "e", "f", "g", "h"]
var layout = []
var hoverElement = undefined;
var color = undefined;

document.onmouseover = function(e) {
    hoverElement = e.target
}

function createBoard (top, bottom) {
    if (bottom == "black") {
        bottom = "green"
    }if (top == "black") {
        top = "green"
    }

    boardColor = bottom
    var tileColor = bottom
    for (var i = 0; i < 8; i++) {
        tileColor = bottom
        if (i % 2 == 1) {
            tileColor = top
        }
        for (var j = 0; j < 8; j++) {
            var tile = document.createElement("div")
            tile.classList.add("tile")
            tile.classList.add(tileColor)
            tile.style.top = (i*10+10).toString()+"vh"
            tile.style.left = (j*10+10).toString()+"vh"
            tile.id = i.toString()+j.toString()
            document.body.appendChild(tile)

            tile.setAttribute("onclick", "highlightSlot(this)")

            // Adding pieces

            if (i == 0 && j == 4) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${top}/king.png`
                tile.appendChild(piece)
            } if (i == 7 && j == 4) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${bottom}/king.png`
                tile.appendChild(piece)
            } if (i == 0 && j == 3) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${top}/queen.png`
                tile.appendChild(piece)
            } if (i == 7 && j == 3) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${bottom}/queen.png`
                tile.appendChild(piece)
            } if (i == 0 && (j == 0 || j == 7)) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${top}/rook.png`
                tile.appendChild(piece)
            } if (i == 7 && (j == 0 || j == 7)) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${bottom}/rook.png`
                tile.appendChild(piece)
            } if (i == 0 && (j == 2 || j == 5)) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${top}/bishop.png`
                tile.appendChild(piece)
            } if (i == 7 && (j == 2 || j == 5)) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${bottom}/bishop.png`
                tile.appendChild(piece)
            } if (i == 0 && (j == 1 || j == 6)) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${top}/knight.png`
                tile.appendChild(piece)
            } if (i == 7 && (j == 1 || j == 6)) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${bottom}/knight.png`
                tile.appendChild(piece)
            } if (i == 1) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${top}/pawn.png`
                tile.appendChild(piece)
            } if (i == 6) {
                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${bottom}/pawn.png`
                tile.appendChild(piece)
            }

            // --------------------

            if (tileColor == top) {
                tileColor = bottom
            } else {
                tileColor = top
            }
        }
    }

    if (bottom == "green") {
        bottom = "black"
    }if (top == "green") {
        top = "black"
    }

    layout = [
        ["r", "kn", "b", "q", "k", "b", "kn", "r"],
        ["p", "p", "p", "p", "p", "p", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["p", "p", "p", "p", "p", "p", "p", "p"],
        ["r", "kn", "b", "q", "k", "b", "kn", "r"],
    ]

    layout[0].forEach((element, ind) => {
        layout[0][ind] = top.split("")[0]+element
    })
    layout[1].forEach((element, ind) => {
        layout[1][ind] = top.split("")[0]+element
    })
    layout[6].forEach((element, ind) => {
        layout[6][ind] = bottom.split("")[0]+element
    })
    layout[7].forEach((element, ind) => {
        layout[7][ind] = bottom.split("")[0]+element
    })
}

function highlightSlot(element) {
    if (element.querySelector("img") == undefined) {
        if (highlightedSlot != undefined) {
            requestMove()
        }
        return false;
    }
    if (!element.querySelector("img").src.includes(boardColor)) {
        if (highlightedSlot != undefined) {
            requestMove()
        }
        return false;
    }
    if (highlightedSlot != undefined) {
        highlightedSlot.style.borderStyle = "none";
        highlightedSlot.querySelector("img").style.width = "10vh";
        highlightedSlot.querySelector("img").style.height = "10vh";
    }
    highlightedSlot = element
    highlightedSlot.style.borderStyle = "solid";
    element.querySelector("img").style.width = "9.6vh";
    element.querySelector("img").style.height = "9.6vh";
}

function unhighlight() {
    if (highlightedSlot != undefined) {
        highlightedSlot.style.borderStyle = "none"
    }
    highlightedSlot = undefined
}

function chessNotToIndex(chessNot) {
    var splitChessNot = chessNot.split("")
    return [rows.indexOf(splitChessNot[1]), columns.indexOf(splitChessNot[0])]
}

function getPosition(element) {
    if (element.nodeName == "IMG") {
        element = element.parentElement
    }
    return [(parseInt(element.style.top.replace("vh", ""))-10)/10, (parseInt(element.style.left.replace("vh", ""))-10)/10]
}

function updateBoard() {
    for (var k = 0; k < 8; k++) {
        for (var l = 0; l < 8; l++) {
            var tile = document.getElementById(k.toString()+l.toString())
            tile.innerHTML = ""
            var suppiece =layout[k][l]
            if (suppiece != "") {
                var color = suppiece[0]
                var p = ""

                if (color == "b") {
                    color = "green"
                } else {
                    color = "white"
                }
                ;
                if (suppiece.includes("b")) {
                    p = "bishop"
                }if (suppiece.includes("r")) {
                    p = "rook"
                } if (suppiece.includes("kn")) {
                    p = "knight"
                } if (suppiece[1] == "k" && suppiece.length == 2) {
                    p = "king"
                } if (suppiece.includes("q")) {
                    p = "queen"
                } if (suppiece.includes("p")) {
                    p = "pawn"
                }

                var piece = document.createElement("img")
                piece.classList.add("piece")
                piece.src = `pieces/${color}/${p}.png`
                tile.innerHTML = ""
                tile.appendChild(piece)
            }
        }
    }
}

function requestMove() {
    var selectedTile = columns[getPosition(highlightedSlot)[1]]+rows[getPosition(highlightedSlot)[0]]
    var hoveredTile = columns[getPosition(hoverElement)[1]]+rows[getPosition(hoverElement)[0]]
    unhighlight()
    ws.send("[reqmove]"+selectedTile+":"+hoveredTile)
}

function move(from, to) {

    layout[chessNotToIndex(to)[0]][chessNotToIndex(to)[1]] = layout[chessNotToIndex(from)[0]][chessNotToIndex(from)[1]]
    layout[chessNotToIndex(from)[0]][chessNotToIndex(from)[1]] = ""
    if (layout[7-chessNotToIndex(to)[0]][chessNotToIndex(to)[1]][0] == color) {
        unhighlight()
    }
    updateBoard()
}

const ws = new WebSocket("ws://localhost:6942");
ws.addEventListener("open", () =>{
    return false;
});
 
ws.addEventListener('message', (data) => {
    if (data.data.includes("[board]")) {
        createBoard(data.data.replace("[board]", "").split(":")[0], data.data.replace("[board]", "").split(":")[1])
        if (data.data.replace("[board]", "").split(":")[1] == "black") {
            color = "b"
        } else {
            color = "w"
        }
    } if (data.data.includes("[move]")) {
        move(data.data.replace("[move]", "").split(":")[0], data.data.replace("[move]", "").split(":")[1])
    } if (data.data == "[win]") {
        var winText = document.createElement("h1");
        winText.textContent = "YOU WON!"
        document.body.appendChild(winText)
    } if (data.data == "[lose]") {
        var loseText = document.createElement("h1");
        loseText.textContent = "YOU LOST!"
        document.body.appendChild(loseText)
    }  if (data.data == "[draw]") {
        var drawText = document.createElement("h1");
        drawText.textContent = "YOU DREW!"
        document.body.appendChild(drawText)
    }
});