//Game data
var ttt_gridHTML, ttt_confirmHTML, ttt_settingHTML, ttt_currentPHTML;
var started, turn, currentP, cSize = 3, cTarget = 3;
var ttt_grids, label = ["O", "X"], pre_label = ["(O)", "(X)"];
var ttt_currentHolding;
var ttt_moves;
function ttt_gameStart(size) {
    started = true;
    cSize = size;
    initG(size);
    cTarget = document.getElementById("target").value;
    var settingHTML = "<p>Size: ".concat(cSize, "</p>");
    settingHTML += "<p>The first player links ".concat(cTarget, " cells wins!</p>");
    ttt_moves = 0;
    ttt_settingHTML.innerHTML = settingHTML;
    ttt_currentHolding = [-1, -1];
    var confirmHTML = "<p><button class=\"buttonconfirm\" onclick=\"ttt_move()\">confirm</button></p>";
    ttt_confirmHTML.innerHTML = confirmHTML;
    var currentHTML = "<p>Current player: ".concat(label[currentP], "</p>");
    ttt_currentPHTML.innerHTML = currentHTML;
    return;
}
function ttt_move() {
    if (ttt_currentHolding[0] < 0) {
        alert("You have not selected a move,\nplease select your move by clicking the board.");
        return;
    }
    cS(ttt_currentHolding[0], ttt_currentHolding[1], label[currentP]);
    ttt_currentHolding = [-1, -1];
    ttt_moves += 1;
    currentP = 1 - currentP; //switch side
    var currentHTML = "<p>Current player: ".concat(label[currentP], "</p>");
    ttt_currentPHTML.innerHTML = currentHTML;
    initG(cSize);
    var result = ttt_end();
    if (result !== "") {
        ttt_gameEnd("Player ".concat(result, " won."));
    }
    else if (ttt_moves >= cSize * cSize) {
        ttt_gameEnd("Draw.");
    }
}
function ttt_gameEnd(statement) {
    var currentHTML = "<p>".concat(statement, "</p>");
    ttt_currentPHTML.innerHTML = currentHTML;
    var confirmHTML = "<p><button class=\"buttonconfirm\" onclick=\"ttt_reset(".concat(cSize, ",").concat(cTarget, ")\">restart</button></p>");
    ttt_confirmHTML.innerHTML = confirmHTML;
}
function ttt_end() {
    var result = ""; //2 stand for nobody wins yet.
    for (var i = 0; i < cSize; i++) {
        for (var j = 0; j < cSize; j++) {
            if (label.includes(ttt_grids[i][j].current)) {
                var fm = [i, j];
                var cMark = ttt_grids[i][j].current;
                if (ttt_link(fm, [i - 1, j + 1], 1, cMark) || ttt_link(fm, [i, j + 1], 1, cMark) || ttt_link(fm, [i + 1, j + 1], 1, cMark) || ttt_link(fm, [i + 1, j], 1, cMark)) {
                    result = cMark;
                    break;
                }
            }
        }
    }
    return result;
}
function ttt_link(from, to, len, player) {
    if (len >= cTarget) {
        return true;
    }
    var fx = from[0], fy = from[1], tx = to[0], ty = to[1];
    var dx = tx - fx, dy = ty - fy;
    if (tx < 0 || tx > cSize - 1 || ty > cSize - 1) {
        return false;
    } //out of side
    else if (ttt_grids[tx][ty].current !== player) {
        return false;
    } //do not belong to current player
    if (dx < 0) {
        return ttt_link([tx, ty], [tx - 1, ty + 1], len + 1, player); //up & right
    }
    else if (dx > 0) {
        if (dy == 0) {
            return ttt_link([tx, ty], [tx + 1, ty], len + 1, player); //down
        }
        else {
            return ttt_link([tx, ty], [tx + 1, ty + 1], len + 1, player); //down & right
        }
    }
    else {
        return ttt_link([tx, ty], [tx, ty + 1], len + 1, player); //right
    }
}
function ttt_reset(size, target) {
    if (size === void 0) { size = 3; }
    if (target === void 0) { target = 3; }
    started = false, turn = 0, currentP = 0;
    ttt_grids = [];
    var min = false, max = false;
    if (size == 3) {
        min = true;
    }
    if (size == 10) {
        max = true;
    }
    var settingHTML = "<p>Size: ".concat(size, " \u3010").concat(min ? "" : "<button onclick=\"ttt_reset(".concat(size - 1, ",").concat(size - 1, ")\">-</button>"), "  ").concat(max ? "" : "<button onclick=\"ttt_reset(".concat(size + 1, ",").concat(size + 1, ")\">+</button>"), "\u3011</p>");
    settingHTML += "<p>Target:<input id=\"target\" type=\"number\" min=3 max=".concat(size, " value=").concat(target, "></p>");
    var confirmHTML = "<p><button class=\"buttonconfirm\" onclick=\"ttt_gameStart(".concat(size, ")\">confirm</button></p>");
    ttt_settingHTML.innerHTML = settingHTML;
    ttt_confirmHTML.innerHTML = confirmHTML;
    ttt_currentPHTML.innerHTML = "";
    initG(size);
}
function createGrid(x, y) {
    return {
        x: x,
        y: y,
        current: "blank"
    };
}
function cS(x, y, newStatus) {
    //alert(`x=${x},y=${y},newStatus=${newStatus}`);
    var target = ttt_grids[x][y];
    if (pre_label.includes(newStatus)) {
        if (ttt_currentHolding[0] > 0) {
            cS(ttt_currentHolding[0], ttt_currentHolding[1], "blank");
        }
        ttt_currentHolding = [x, y];
    }
    target.current = newStatus;
    initG(cSize);
    return;
}
function initG(size) {
    if (!started) {
        ttt_grids = [];
    } //Reset for preview
    var gridHTML = "<p><table>";
    for (var i = 0; i < size; i++) {
        gridHTML += "<tr>";
        if (!started) {
            ttt_grids.push([]);
        }
        for (var j = 0; j < size; j++) {
            gridHTML += "<td>".concat(started ? (ttt_grids[i][j].current === "blank" ? "<button class=\"buttonNoBorder\" onclick=\"cS(".concat(i, ",").concat(j, ",'").concat(pre_label[currentP], "')\">   </button>") : ttt_grids[i][j].current) : " ", "</td>");
            if (!started) {
                ttt_grids[i].push(createGrid(i, j));
            }
        }
        gridHTML += "</tr>";
    }
    gridHTML += "</table></p>";
    ttt_gridHTML.innerHTML = gridHTML;
}
window.onload = function () {
    ttt_gridHTML = document.getElementById("grid");
    ttt_confirmHTML = document.getElementById("confirm");
    ttt_settingHTML = document.getElementById("setting");
    ttt_currentPHTML = document.getElementById("current");
    ttt_reset();
};
