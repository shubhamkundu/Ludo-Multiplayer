// static variables - start
const numberMapping = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six'
};
const colors = ['red', 'blue', 'yellow', 'green'];
const colorMappingObj = {
    'red': {
        r: 255,
        g: 0,
        b: 0
    }, 'blue': {
        r: 0,
        g: 0,
        b: 255
    }, 'yellow': {
        r: 255,
        g: 255,
        b: 0
    }, 'green': {
        r: 0,
        g: 255,
        b: 0
    }
};
const roomCellsForLiveTokens = {
    red: {
        red: [{ x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }],
        blue: [{ x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }],
        yellow: [{ x: 5, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }],
        green: [{ x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }]
    },
    blue: {
        red: [{ x: 14, y: 1 }, { x: 13, y: 1 }, { x: 12, y: 1 }, { x: 11, y: 1 }],
        blue: [{ x: 10, y: 2 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }],
        yellow: [{ x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 }],
        green: [{ x: 15, y: 5 }, { x: 15, y: 4 }, { x: 15, y: 3 }, { x: 15, y: 2 }]
    },
    yellow: {
        red: [{ x: 11, y: 15 }, { x: 12, y: 15 }, { x: 13, y: 15 }, { x: 14, y: 15 }],
        blue: [{ x: 15, y: 14 }, { x: 15, y: 13 }, { x: 15, y: 12 }, { x: 15, y: 11 }],
        yellow: [{ x: 14, y: 10 }, { x: 13, y: 10 }, { x: 12, y: 10 }, { x: 11, y: 10 }],
        green: [{ x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }]
    },
    green: {
        red: [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }, { x: 2, y: 10 }],
        blue: [{ x: 1, y: 11 }, { x: 1, y: 12 }, { x: 1, y: 13 }, { x: 1, y: 14 }],
        yellow: [{ x: 2, y: 15 }, { x: 3, y: 15 }, { x: 4, y: 15 }, { x: 5, y: 15 }],
        green: [{ x: 6, y: 14 }, { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }]
    }
};
const cells = {
    'red': [2, 3, 4, 5, 6].map(x => { return { x, y: 7 }; })
        .concat([6, 5, 4, 3, 2, 1].map(y => { return { x: 7, y }; }))
        .concat([8, 9].map(x => { return { x, y: 1 }; })),
    'blue': [2, 3, 4, 5, 6].map(y => { return { x: 9, y }; })
        .concat([10, 11, 12, 13, 14, 15].map(x => { return { x, y: 7 }; }))
        .concat([8, 9].map(y => { return { x: 15, y }; })),
    'yellow': [14, 13, 12, 11, 10].map(x => { return { x, y: 9 }; })
        .concat([10, 11, 12, 13, 14, 15].map(y => { return { x: 9, y }; }))
        .concat([8, 7].map(x => { return { x, y: 15 }; })),
    'green': [14, 13, 12, 11, 10].map(y => { return { x: 7, y }; })
        .concat([6, 5, 4, 3, 2, 1].map(x => { return { x, y: 9 }; }))
        .concat([8, 7].map(y => { return { x: 1, y }; }))
};
const rooms = {
    'red': [2, 3, 4, 5, 6, 7].map(x => { return { x, y: 8 }; }),
    'blue': [2, 3, 4, 5, 6, 7].map(y => { return { x: 8, y }; }),
    'yellow': [14, 13, 12, 11, 10, 9].map(x => { return { x, y: 8 }; }),
    'green': [14, 13, 12, 11, 10, 9].map(y => { return { x: 8, y }; })
};
const steps = {
    'red': cells.red
        .concat(cells.blue)
        .concat(cells.yellow)
        .concat(cells.green.slice(0, cells.green.length - 1))
        .concat(rooms.red),
    'blue': cells.blue
        .concat(cells.yellow)
        .concat(cells.green)
        .concat(cells.red.slice(0, cells.red.length - 1))
        .concat(rooms.blue),
    'yellow': cells.yellow
        .concat(cells.green)
        .concat(cells.red)
        .concat(cells.blue.slice(0, cells.blue.length - 1))
        .concat(rooms.yellow),
    'green': cells.green
        .concat(cells.red)
        .concat(cells.blue)
        .concat(cells.yellow.slice(0, cells.yellow.length - 1))
        .concat(rooms.green)
};
// static variables - end

let currentPlayerColor, justEliminated, validTokensLength, thisTeam,
    activeColors, winnerColors;

// for settings
let soundStatus, gameEnded, playerType;

// for log
let activities;

const socket = io();
socket.on('connect', function () {
    console.log('User connected to client');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', {
        name: params.name,
        room: params.room
    }, function (e) {
        window.location.href = '/';
        alert(e.message);
    });

    socket.on('clickPlayButton', function (data) {
        onClickPlayButton(data);
    });
    socket.on('clickToken', function (data) {
        onClickToken(data);
    });
    socket.on('setThisTeam', function (data) {
        setThisTeam(data);
    });
    socket.on('setPlayerType', function (data) {
        setPlayerType(data);
    });
});

// functions - start

function emit(eventName, data) {
    socket.emit(eventName + 'S', data);
}

function setThisTeam(data) {
    thisTeam = data.thisTeam;
    const data1 = { color: data.thisTeam, playerType: 'manual' };
    setPlayerType(data1);
    emit('setPlayerType', data1);
    onLoad();
}

function setPlayerType(data) {
    if (!playerType) {
        playerType = {};
    }
    playerType[data.color] = data.playerType;
}

function reset() {
    activeColors = ['red', 'blue', 'yellow', 'green'];
    winnerColors = [];
    justEliminated = false;
    validTokensLength = 0;
    soundStatus = 'on';
    gameEnded = false;
    if (!playerType) {
        playerType = {};
    }
    for (const color of colors) {
        if (!playerType[color]) {
            playerType[color] = 'automatic';
        }
    }
    activities = [];

    drawCells();
    styleCells();
    initializeStars();
    drawTokens('initial');
}

function removeFromArr(arr, el) {
    const i = arr.indexOf(el);
    if (i > -1) {
        arr.splice(i, 1);
    }
}

function onLoad() {
    reset();
    startGame();
}

function drawSoundButton(x, y) {
    const soundOnButtonHTML = '<i id="i-sound-on" class="fas fa-volume-up"></i>';
    $('#cell-' + y + '-' + x).append(soundOnButtonHTML);
    const soundOffButtonHTML = '<i id="i-sound-off" class="fas fa-volume-mute"></i>';
    $('#cell-' + y + '-' + x).append(soundOffButtonHTML);
    $('#cell-' + y + '-' + x).on('click', function () {
        toggleSound();
    });
    setSoundStatus(soundStatus);
}

function toggleSound() {
    if (soundStatus === 'on') {
        setSoundStatus('off');
    } else {
        setSoundStatus('on');
    }
}

function setSoundStatus(status) {
    soundStatus = status;
    if (soundStatus === 'on') {
        hideElementById('i-sound-off');
        showElementById('i-sound-on');
    } else if (soundStatus === 'off') {
        hideElementById('i-sound-on');
        showElementById('i-sound-off');
    }
}

function stopAllAudio() {
    $('audio').each(function () {
        $(this).trigger('load');
    });
}

function playAudio(id) {
    if (soundStatus === 'on') {
        stopAllAudio();
        $('#' + id).trigger('play');
    }
}

function hideElementById(id) {
    $('#' + id).hide();
}

function showElementById(id) {
    $('#' + id).show();
}

function startGame() {
    passTo('red');
}

function passTo(color) {
    activities.push(color + '"s turn');
    $('td.bottom').text(color + '"s turn');
    $('td.bottom').css({
        background: color,
        color: color === 'yellow' ? 'black' : 'white'
    });
    justEliminated = false;
    currentPlayerColor = color;
    showPlayButton(currentPlayerColor);
}

function passToNext(color) {
    if (activeColors.indexOf(currentPlayerColor) === activeColors.length - 1) {
        return passTo(activeColors[0]);
    }
    passTo(activeColors[activeColors.indexOf(currentPlayerColor) + 1]);
}

function getDicePosition(color) {
    if (color === 'red') {
        return {
            x: 7,
            y: 7
        };
    } else if (color === 'blue') {
        return {
            x: 9,
            y: 7
        };
    } else if (color === 'yellow') {
        return {
            x: 9,
            y: 9
        };
    } else if (color === 'green') {
        return {
            x: 7,
            y: 9
        };
    }
}

function showDice(color, diceN) {
    if (color !== 'center') {
        playAudio('audio-dice-move');
    }
    let dicePosition;
    if (color === 'center') {
        dicePosition = {
            x: 8,
            y: 8
        };
    } else {
        dicePosition = getDicePosition(color);
    }
    if (!diceN) {
        diceN = Math.floor(Math.random() * 6 + 1);
    }
    if (color !== 'center') {
        $('td.bottom').text(color + '"s dice: ' + diceN);
        $('td.bottom').css({
            background: color,
            color: color === 'yellow' ? 'black' : 'white'
        });
    }
    const diceHTML = '<div class="dice" id="dice-' + color + '"><i class="fas fa-dice-' + numberMapping[diceN] + '"></i></div>';
    $('#cell-' + dicePosition.y + '-' + dicePosition.x).append(diceHTML);
    $('#dice-' + color).css({
        color: currentPlayerColor
    });
    if (color === 'center') {
        activities.push(currentPlayerColor + ' got ' + diceN);
    }
    return diceN;
}

function removeDice(color) {
    $('#dice-' + color).remove();
}

function showPlayButton(color) {
    removeDice(color);
    const playButtonPosition = getDicePosition(color);
    const playButtonHTML = '<div class="play-button" id="play-button-' + color + '"><i class="far fa-play-circle"></i></div>';
    $('#cell-' + playButtonPosition.y + '-' + playButtonPosition.x).append(playButtonHTML);
    $('#play-button-' + color).css({
        color: color
    });
    if (playerType[color] === 'manual') {
        $('#play-button-' + color).on('click', function () {
            const diceN = Math.floor(Math.random() * 6 + 1);
            const data = { color, diceN };
            onClickPlayButton(data);
            emit('clickPlayButton', data);
        });
    } else if (playerType[color] === 'automatic') {
        setTimeout(function () {
            const diceN = Math.floor(Math.random() * 6 + 1);
            const data = { color, diceN };
            onClickPlayButton(data);
            emit('clickPlayButton', data);
        }, 1000);
    }
}

function removePlayButton() {
    $('#play-button-' + currentPlayerColor).remove();
}

function onClickPlayButton(data) {
    removePlayButton();
    const diceN = showDice(data.color, data.diceN);
    removeDice('center');
    showDice('center', diceN);
    const validTokens = makeValidTokensClickable(diceN);
    validTokensLength = validTokens.length;

    let timeOutMS;
    if (playerType[data.color] === 'manual') {
        timeOutMS = 0;
    } else if (playerType[data.color] === 'automatic') {
        timeOutMS = 1000;
    }

    setTimeout(function () {
        if (validTokens.length === 0) {
            return passToNext(data.color);
        } else if (validTokens.length === 1 || allAreTogether(validTokens)) {
            const data = { color: validTokens[0].color, n: validTokens[0].n, diceN };
            onClickToken(data);
            emit('clickToken', data);
            return;
        }

        if (playerType[data.color] === 'automatic') {
            return playAutomatically(data.color, diceN, validTokens);
        }

    }, timeOutMS);
}

function playAutomatically(color, diceN, validTokens) {
    console.log(JSON.stringify(validTokens));

    for (let i = 0; i < validTokens.length; i++) {
        const vt = validTokens[i];
        const tokenNextPosition = getTokenNextPosition(vt, diceN);
        if (tokenNextPosition === undefined) {
            vt.shouldIgnore = true;
            continue;
        }

        const tokenTrackingObj = Token.tracker[vt.color][vt.n];
        const tokensToBeEliminated = getTokensToBeEliminated(tokenNextPosition);

        vt.w = {};
        vt.w.elimination = calculateEliminationWeightage(vt, tokensToBeEliminated);
        vt.w.notEliminated = calculateNotEliminatedWeightage(vt, tokenNextPosition.pos);
        vt.w.toEliminate = calculateToEliminateWeightage(vt, tokenNextPosition.pos);
        vt.w.position = calculatePositionWeightage(vt);
        vt.w.notEliminatedHere = calculateNotEliminatedWeightage(vt, tokenTrackingObj.pos);
        vt.w.toEliminateHere = calculateToEliminateWeightage(vt, tokenTrackingObj.pos);

        vt.w.multiplier = {
            elimination: 100,
            notEliminated: 5,
            toEliminate: 1.5,
            position: 2,
            notEliminatedHere: 5,
            toEliminateHere: 1.5
        };

        if (vt.w.notEliminated - vt.w.notEliminatedHere < -30) {
            vt.w.multiplier.position = -2;
        }

        vt.wTotal = vt.w.elimination * vt.w.multiplier.elimination + vt.w.notEliminated * vt.w.multiplier.notEliminated
            + vt.w.toEliminate * vt.w.multiplier.toEliminate + vt.w.position * vt.w.multiplier.position
            - vt.w.notEliminatedHere * vt.w.multiplier.notEliminatedHere - vt.w.toEliminateHere * vt.w.multiplier.toEliminateHere;
    }

    validTokens.sort((vt1, vt2) => vt2.wTotal - vt1.wTotal);
    if (validTokens[0]) { console.log(JSON.stringify(validTokens[0].w)); console.log(validTokens[0].wTotal) };
    if (validTokens[1]) { console.log(JSON.stringify(validTokens[1].w)); console.log(validTokens[1].wTotal) };
    if (validTokens[2]) { console.log(JSON.stringify(validTokens[2].w)); console.log(validTokens[2].wTotal) };
    if (validTokens[3]) { console.log(JSON.stringify(validTokens[3].w)); console.log(validTokens[3].wTotal) };
    const data = { color: validTokens[0].color, n: validTokens[0].n, diceN };
    onClickToken(data);
    emit('clickToken', data);
    return;
}

function calculatePositionWeightage(vt) {
    let position;
    const tokenTrackingObj = Token.tracker[vt.color][vt.n];
    position = (tokenTrackingObj.pos === -1) ? 150 : tokenTrackingObj.pos;
    return position;
}

function calculateNotEliminatedWeightage(vt, nextPos) {
    let notEliminated;
    if (isTokenInSafePosition(nextPos)) {
        notEliminated = 1;
        return notEliminated;
    }

    const vci = colors.indexOf(vt.color);
    let n1i = (vci + 1) % 4, n2i = (vci + 2) % 4, n3i = (vci + 3) % 4;

    notEliminated = 0;
    let prevStepsToEliminate;
    for (const c of activeColors.filter(c => c !== currentPlayerColor)) {
        prevStepsToEliminate = undefined;
        for (let j = 0; j < 4; j++) {
            const tokenTrackingObj = Token.tracker[c][j + 1];
            const pos = tokenTrackingObj.pos;

            if (c === colors[n1i]) {
                if (nextPos < 13) {
                    if (nextPos === 12) {
                        stepsToEliminate = 51;
                    } else {
                        stepsToEliminate = 39 + nextPos - pos;
                    }
                } else if (nextPos > 13) {
                    stepsToEliminate = nextPos - 13 - pos;
                }
            } else if (c === colors[n2i]) {
                if (nextPos < 26) {
                    if (nextPos === 25) {
                        stepsToEliminate = 51;
                    } else {
                        stepsToEliminate = 26 + nextPos - pos;
                    }
                } else if (nextPos > 26) {
                    stepsToEliminate = nextPos - 26 - pos;
                }
            } else if (c === colors[n3i]) {
                if (nextPos < 39) {
                    if (nextPos === 38) {
                        stepsToEliminate = 51;
                    } else {
                        stepsToEliminate = 13 + nextPos - pos;
                    }
                } else if (nextPos > 39) {
                    stepsToEliminate = nextPos - 39 - pos;
                }
            }

            if (pos === -1) {
                stepsToEliminate += 5;
            }
            if (stepsToEliminate < 0 || stepsToEliminate > 51) {
                stepsToEliminate = 51;
            }
            // console.log(nextPos, pos, c, j, stepsToEliminate);
            if (stepsToEliminate <= 12 && stepsToEliminate !== prevStepsToEliminate) {
                notEliminated += stepsToEliminate - 51;
            }
            // console.log(notEliminated);
            prevStepsToEliminate = stepsToEliminate;
        }
    }
    return notEliminated;
}

function calculateToEliminateWeightage(vt, nextPos) {
    let toEliminate;

    const vci = colors.indexOf(vt.color);
    let n1i = (vci + 1) % 4, n2i = (vci + 2) % 4, n3i = (vci + 3) % 4;

    toEliminate = 0;
    for (const c of activeColors.filter(c => c !== currentPlayerColor)) {
        for (let j = 0; j < 4; j++) {
            const tokenTrackingObj = Token.tracker[c][j + 1];
            const pos = tokenTrackingObj.pos;
            if (isTokenInSafePosition(pos)) {
                continue;
            }

            if (c === colors[n1i]) {
                if (pos < 39) {
                    if (pos === 38) {
                        stepsToEliminate = 51;
                    } else {
                        stepsToEliminate = 13 + pos - nextPos;
                    }
                } else if (pos > 39) {
                    stepsToEliminate = pos - 39 - nextPos;
                }
            } else if (c === colors[n2i]) {
                if (pos < 26) {
                    if (pos === 25) {
                        stepsToEliminate = 51;
                    } else {
                        stepsToEliminate = 26 + pos - nextPos;
                    }
                } else if (pos > 26) {
                    stepsToEliminate = pos - 26 - nextPos;
                }
            } else if (c === colors[n3i]) {
                if (pos < 13) {
                    if (pos === 12) {
                        stepsToEliminate = 51;
                    } else {
                        stepsToEliminate = 39 + pos - nextPos;
                    }
                } else if (pos > 13) {
                    stepsToEliminate = pos - 13 - nextPos;
                }
            }

            if (stepsToEliminate < 0 || stepsToEliminate > 51) {
                stepsToEliminate = 51;
            }
            if (stepsToEliminate <= 6) {
                toEliminate += 51 - stepsToEliminate + pos;
            }
        }
    }
    return toEliminate;
}

function calculateEliminationWeightage(vt, tokensToBeEliminated) {
    let elimination;
    if (!tokensToBeEliminated[0] || tokensToBeEliminated[0].color === vt.color) {
        elimination = 0;
    } else {
        elimination = 0;
        tokensToBeEliminated.forEach(t => {
            const tokenTrackingObj = Token.tracker[t.color][t.n];
            elimination += tokenTrackingObj.pos;
        });
    }
    return elimination;
}

function getTokensToBeEliminated(tokenNextPosition) {
    const tokensToBeEliminated = [];
    for (const c of activeColors.filter(c => c !== currentPlayerColor)) {
        for (let j = 0; j < 4; j++) {
            const tokenTrackingObj = Token.tracker[c][j + 1];
            if (isTokenInStar(tokenTrackingObj.pos)) {
                continue;
            }
            if (tokenTrackingObj.x === tokenNextPosition.x
                && tokenTrackingObj.y === tokenNextPosition.y) {
                tokensToBeEliminated.push(tokenTrackingObj.ref);
            }
        }
    }
    return tokensToBeEliminated;
}

function isTokenInStar(pos) {
    const starPositions = [0, 8, 13, 21, 26, 34, 39, 47];
    return starPositions.includes(pos);
}

function isTokenInSafePosition(pos) {
    const safePositions = [-1, 0, 8, 13, 21, 26, 34, 39, 47, 51, 52, 53, 54, 55, 56];
    return safePositions.includes(pos);
}

function getTokenNextPosition(token, diceN) {
    const tokenTrackingObj = Token.tracker[token.color][token.n];
    const stepsArr = steps[token.color];
    if (tokenTrackingObj.pos === undefined || tokenTrackingObj.pos === -1) {
        if (diceN === 6) {
            return {
                x: stepsArr[0].x,
                y: stepsArr[0].y,
                pos: 0
            };
        }
        return undefined;
    }
    const nextPos = tokenTrackingObj.pos + diceN;
    if (nextPos >= 56) {
        return undefined;
    }
    return {
        x: stepsArr[nextPos].x,
        y: stepsArr[nextPos].y,
        pos: nextPos
    };
}

function getOutsideTokens(validTokens) {
    if (!validTokens) {
        validTokens = [];
        for (let j = 0; j <= 4; j++) {
            validTokens.push(Token.tracker[currentPlayerColor][j + 1].ref);
        }
    }
    const outsideTokens = [];
    const safePositions = [-1, 0, 8, 13, 21, 26, 34, 39, 47, 51, 52, 53, 54, 55, 56];
    for (const t of validTokens) {
        if (!safePositions.includes(Token.tracker[t.color][t.n].pos)) {
            outsideTokens.push(t);
        }
    }
    return outsideTokens;
}

function allAreTogether(tokens) {
    for (let i = 0; i < tokens.length - 1; i++) {
        const thisTokenTracker = Token.tracker[tokens[i].color][tokens[i].n];
        const nextTokenTracker = Token.tracker[tokens[i + 1].color][tokens[i + 1].n];
        if (thisTokenTracker.pos !== nextTokenTracker.pos) {
            return false;
        }
    }
    return true;
}

function makeValidTokensClickable(diceN) {
    const validTokens = [];
    for (let i = 0; i < 4; i++) {
        const currentTokenTrackingObj = Token.tracker[currentPlayerColor][i + 1];
        if ((currentTokenTrackingObj.pos !== undefined
            && currentTokenTrackingObj.pos >= 0 && currentTokenTrackingObj.pos + diceN < 57)
            || (diceN === 6 && (currentTokenTrackingObj.pos === undefined || currentTokenTrackingObj.pos === -1))) {
            validTokens.push(currentTokenTrackingObj.ref);
            $('#token-' + currentPlayerColor + '-' + (i + 1)).addClass('clickable');
            $('#token-' + currentPlayerColor + '-' + (i + 1)).on('click', function () {
                const data = { color: currentPlayerColor, n: i + 1, diceN };
                onClickToken(data);
                emit('clickToken', data);
            });
            $('#token-' + currentPlayerColor + '-' + (i + 1)).on('mouseover', function () {
                onMouseoverToken(currentPlayerColor, i + 1, diceN);
            });
            $('#token-' + currentPlayerColor + '-' + (i + 1)).on('mouseout', function () {
                onMouseoutToken(currentPlayerColor, i + 1, diceN);
            });
        }
    }
    return validTokens;
}

function onClickToken(data) {
    const color = data.color;
    const n = data.n;
    const diceN = data.diceN;
    activities.push(color + '-' + n + ' token selected for progress');
    onMouseoutToken(color, n, diceN);
    playAudio('audio-token-move');
    $('.estimate').removeClass('estimate');
    $('.lastplayed').removeClass('lastplayed');
    $('.lasteliminated').removeClass('lasteliminated');
    $('.selected').removeClass('selected');
    const currentTokenTrackingObj = Token.tracker[color][n];
    if (currentTokenTrackingObj.pos !== undefined && currentTokenTrackingObj.pos >= 0) {
        currentTokenTrackingObj.ref.progress(diceN);
    } else if (diceN === 6) {
        currentTokenTrackingObj.ref.progress(1);
    }
    undoTokenClickable(color);
    undoTokenHoverable(color);
    $('#token-' + color + '-' + n).addClass('lastplayed');
    if (!isFinished(color).status && (diceN === 6 || currentTokenTrackingObj.pos === 56 || justEliminated)) {
        passTo(color);
    } else if (!gameEnded) {
        passToNext(color);
    }
}

function undoTokenClickable(color) {
    for (let i = 0; i < 4; i++) {
        $('#token-' + color + '-' + (i + 1)).removeClass('clickable');
        $('#token-' + color + '-' + (i + 1)).off('click');
    }
}

function onMouseoverToken(color, n, diceN) {
    const currentTokenTrackingObj = Token.tracker[color][n];
    if (currentTokenTrackingObj.pos !== undefined && currentTokenTrackingObj.pos >= 0) {
        currentTokenTrackingObj.ref.estimateProgress(diceN);
    } else if (diceN === 6) {
        currentTokenTrackingObj.ref.estimateProgress(1);
    }
}

function onMouseoutToken() {
    $('.estimate').removeClass('estimate');
}

function undoTokenHoverable(color) {
    for (let i = 0; i < 4; i++) {
        $('#token-' + color + '-' + (i + 1)).off('mouseover');
        $('#token-' + color + '-' + (i + 1)).off('mouseout');
    }
}

function drawTokens(type) {
    for (const c in Token.tracker) {
        if (Token.tracker.hasOwnProperty(c)) {
            if (activeColors.includes(c)) {
                for (const n in Token.tracker[c]) {
                    if (Token.tracker[c].hasOwnProperty(n)) {
                        const tokenTrackingObj = Token.tracker[c][n];
                        if (type === 'initial') {
                            tokenTrackingObj.ref.draw(tokenTrackingObj.ix, tokenTrackingObj.iy);
                        } else {
                            tokenTrackingObj.ref.draw(tokenTrackingObj.x, tokenTrackingObj.y);
                        }
                    }
                }
            }
        }
    }
}

function initializeStars() {
    starRed1 = new Star('red', 'black', 1);
    starRed1.draw(2, 7);
    starRed2 = new Star('red', 'red', 2);
    starRed2.draw(3, 9);

    starBlue1 = new Star('blue', 'black', 1);
    starBlue1.draw(9, 2);
    starBlue2 = new Star('blue', 'blue', 2);
    starBlue2.draw(7, 3);

    starYellow1 = new Star('yellow', 'black', 1);
    starYellow1.draw(14, 9);
    starYellow2 = new Star('yellow', 'yellow', 2);
    starYellow2.draw(13, 7);

    starGreen1 = new Star('green', 'black', 1);
    starGreen1.draw(7, 14);
    starGreen2 = new Star('green', 'green', 2);
    starGreen2.draw(9, 13);
}


function drawCells() {
    let cellHTML = '<table id="table-board">';
    for (let i = 0; i < 17; i++) {
        cellHTML += '<tr class="row" id="row-' + i + '">';
        if (i !== 16) {
            for (let j = 0; j < 17; j++) {
                cellHTML += '<td class="cell" id="cell-' + i + '-' + j + '"></td>';
            }
        } else {
            cellHTML += '<td colspan="17" class="cell bottom" id="cell-' + i + '"></td>';
        }
        cellHTML += '</tr>';
    }
    cellHTML += '</table>';
    $('#main').append(cellHTML);

    drawSoundButton(15, 0);
}

function styleCells() {
    const n = 17;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // style white border
            if (i === 0 && j === 0) {
                $('#cell-' + i + '-' + j).css({
                    'border-right': 'none',
                    'border-bottom': 'none',
                    'background': 'orange'
                });
            } else if (i === 0 && j === n - 1) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-bottom': 'none',
                    'background': 'orange'
                });
            } else if (i === n - 1) {
                $('#cell-' + i).css({
                    'background': 'orange'
                });
            } else if (i > 0 && i < n - 1 && (j === 0 || j === n - 1)) {
                $('#cell-' + i + '-' + j).css({
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'orange'
                });
            } else if (j > 0 && j < n - 1 && i === 0) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'background': 'orange'
                });
            }
            // style red base
            else if ((i === 1 || i === 6) && (j === 1 || j === 6)) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'red'
                });
            } else if (i >= 1 && i <= 6 && j >= 1 && j <= 6 && !((i === 2 || i == 5) && (j === 2 || j === 5))) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'red'
                });
            } else if (i >= 1 && i <= 6 && j >= 1 && j <= 6 && !((i === 2 || i == 5) && (j === 2 || j === 5))) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'red'
                });
            } else if ((i === 7 && j === 2) || (i === 8 && j >= 2 && j <= 7)) {
                $('#cell-' + i + '-' + j).css({
                    'background': 'red'
                });
            }
            // style blue base
            else if ((i === 1 || i === 6) && (j === 10 || j === 15)) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'blue'
                });
            } else if (i >= 1 && i <= 6 && j >= 10 && j <= 15 && !((i === 2 || i == 5) && (j === 11 || j === 14))) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'blue'
                });
            } else if ((i === 2 && j === 9) || (j === 8 && i >= 2 && i <= 7)) {
                $('#cell-' + i + '-' + j).css({
                    'background': 'blue'
                });
            }
            // style yellow base
            else if ((i === 10 || i === 15) && (j === 10 || j === 15)) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'yellow'
                });
            } else if (i >= 10 && i <= 15 && j >= 10 && j <= 15 && !((i === 11 || i == 14) && (j === 11 || j === 14))) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'yellow'
                });
            } else if ((i === 9 && j === 14) || (i === 8 && j >= 9 && j <= 14)) {
                $('#cell-' + i + '-' + j).css({
                    'background': 'yellow'
                });
            }
            // style green base
            else if ((i === 10 || i === 15) && (j === 1 || j === 6)) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'green'
                });
            } else if (i >= 10 && i <= 15 && j >= 1 && j <= 6 && !((i === 11 || i == 14) && (j === 2 || j === 5))) {
                $('#cell-' + i + '-' + j).css({
                    'border-left': 'none',
                    'border-right': 'none',
                    'border-top': 'none',
                    'border-bottom': 'none',
                    'background': 'green'
                });
            } else if ((i === 14 && j === 7) || (j === 8 && i >= 9 && i <= 14)) {
                $('#cell-' + i + '-' + j).css({
                    'background': 'green'
                });
            }
            // style black center cells
            else if ((i === 7 && j === 7) || (i === 7 && j === 9)
                || (i === 8 && j === 8) || (i === 9 && j === 7) || (i === 9 && j === 9)) {
                $('#cell-' + i + '-' + j).css({
                    'background': 'black'
                });
            }
        }
    }
}

function isStar(x, y) {
    for (const color of colors) {
        for (const n of [1, 2]) {
            if (Star.tracker[color][n].x === x && Star.tracker[color][n].y === y) {
                return {
                    color: color,
                    n: n,
                    ref: Star.tracker[color][n].ref
                };
            }
        }
    }
    return false;
}

function Token(color, n) {
    this.color = color;
    this.n = n;
    this.draw = function (x, y) {
        const tokenHTML = '<div class="token ' + this.color + ' ' + this.n + '" id="token-' + this.color + '-' + this.n + '"></div>';
        const star = isStar(x, y);
        if (star) {
            star.ref.hide();
        }
        $('#cell-' + y + '-' + x).append(tokenHTML);
        // $('#cell-' + y + '-' + x).addClass('token');
        $('#token-' + this.color + '-' + this.n).css({
            'background': this.color,
            'background-image': 'linear-gradient(' + this.color + ', white, ' + this.color
        });
        if (Token.tracker[this.color] === undefined) {
            Token.tracker[this.color] = {};
        }
        if (Token.tracker[this.color][this.n] === undefined) {
            Token.tracker[this.color][this.n] = {};
        }
        Token.tracker[this.color][this.n].x = x;
        Token.tracker[this.color][this.n].y = y;
    };
    this.erase = function () {
        $('#token-' + this.color + '-' + this.n).remove();
        // if (Token.tracker[this.color] && Token.tracker[this.color][this.n]) {
        // delete Token.tracker[this.color][this.n];
        // }
    };
    this.drawEstimate = function (x, y) {
        const estimateHTML = '<div class="estimate ' + this.color + ' ' + this.n + '" id="estimate-' + this.color + '-' + this.n + '"></div>';
        $('#cell-' + y + '-' + x).append(estimateHTML);
    };
    this.eraseEstimate = function (x, y) {
        $('#estimate-' + this.color + '-' + this.n).remove();
    };
    this.move = function (moveX, moveY) {
        if (!moveY) {
            moveY = 0;
        }
        const currentX = Token.tracker[this.color][this.n].x;
        const currentY = Token.tracker[this.color][this.n].y;
        const star = isStar(currentX, currentY);
        if (star) {
            star.ref.show();
        }
        this.erase();
        this.draw(currentX + moveX, currentY + moveY);
    };
    this.progress = function (n) {
        if (Token.tracker[this.color][this.n].pos === undefined) {
            Token.tracker[this.color][this.n].pos = -1;
            if (n !== 1) {
                return;
            }
        }
        const currentTokenTrackingObj = Token.tracker[this.color][this.n];
        const stepArr = steps[this.color];
        const pos = currentTokenTrackingObj.pos;
        const newPos = pos + n < 56 ? pos + n : 56;

        this.erase();
        if (pos !== -1) {
            const star2 = isStar(stepArr[pos].x, stepArr[pos].y);
            if (star2 && star2.n === 2) {
                const hasTokenAlready = $('#cell-' + stepArr[pos].y + '-' + stepArr[pos].x).has('.token');
                if (hasTokenAlready.length === 0) {
                    star2.ref.show();
                }
            } else if (star2 && star2.n === 1) {
                const liveTokenPosInsideRoom = roomCellsForLiveTokens[star2.color][this.color].find(pos => pos.x === currentTokenTrackingObj.x && pos.y === currentTokenTrackingObj.y);
                liveTokenPosInsideRoom.isOccupied = false;
            }
        }
        const star1 = isStar(stepArr[newPos].x, stepArr[newPos].y);
        if (star1 && star1.n === 1) {
            const availablePosArr = roomCellsForLiveTokens[star1.color][this.color].filter(pos => !pos.isOccupied);
            this.draw(availablePosArr[0].x, availablePosArr[0].y);
            if (star1.color === this.color) {
                activities.push(this.color + '-' + this.n + ' token got alive');
            } else {
                activities.push(this.color + '-' + this.n + ' token got to ' + star1.color + ' room');
            }
            availablePosArr[0].isOccupied = true;
        } else {
            const hasTokenAlready = $('#cell-' + stepArr[newPos].y + '-' + stepArr[newPos].x + ' .token');
            const hasStar = $('#cell-' + stepArr[newPos].y + '-' + stepArr[newPos].x + ' .star');
            this.draw(stepArr[newPos].x, stepArr[newPos].y);
            activities.push(this.color + '-' + this.n + ' token moved to position: ' + newPos);
            if (hasTokenAlready.length > 0) {
                let eliminationNeeded = false;
                if (hasStar.length === 0) {
                    for (const alreadyPresentToken of hasTokenAlready) {
                        const alreadyPresentTokenId = $(alreadyPresentToken).attr('id');
                        const alreadyPresentTokenColor = alreadyPresentTokenId.split('-')[1];
                        const alreadyPresentTokenN = parseInt(alreadyPresentTokenId.split('-')[2]);
                        if (alreadyPresentTokenColor !== this.color) {
                            activities.push(this.color + '-' + this.n + ' token eliminated '
                                + alreadyPresentTokenColor + '-' + alreadyPresentTokenN + ' token');
                            playAudio('audio-token-eliminate');
                            justEliminated = true;
                            eliminationNeeded = true;
                            $(alreadyPresentToken).remove();
                            const alreadyPresentTokenTrackingObj = Token.tracker[alreadyPresentTokenColor][alreadyPresentTokenN];
                            alreadyPresentTokenTrackingObj.ref
                                .draw(alreadyPresentTokenTrackingObj.ix, alreadyPresentTokenTrackingObj.iy);
                            alreadyPresentTokenTrackingObj.pos = -1;
                            $('#token-' + alreadyPresentTokenColor + '-' + alreadyPresentTokenN).addClass('lasteliminated');
                        }
                    }
                }
                if (!eliminationNeeded) {
                    $('#cell-' + stepArr[newPos].y + '-' + stepArr[newPos].x + ' .token').addClass('multiple');
                }
            }
        }
        if (pos !== -1) {
            const tokens = $('#cell-' + stepArr[pos].y + '-' + stepArr[pos].x + ' .token');
            if (tokens.length <= 1) {
                tokens.removeClass('multiple');
            }
        }
        currentTokenTrackingObj.pos += n;
        Token.tracker[this.color][this.n].pos = currentTokenTrackingObj.pos;
        if (currentTokenTrackingObj.pos === 56) {
            const finished = isFinished(this.color);
            if (finished.status) {
                finish(this.color, finished.point);
                if (isFinishedBoard()) {
                    let finishedBoardText = '';
                    winnerColors.forEach((wc, wci) => {
                        finishedBoardText += 'Pos-' + (wci + 1) + ': ' + wc.color + '(' + wc.point + '), '
                    });
                    finishedBoardText = finishedBoardText.substring(0, finishedBoardText.length - 2);
                    $('td.bottom').text(finishedBoardText);
                    $('td.bottom').css({
                        background: color,
                        color: color === 'yellow' ? 'black' : 'white'
                    });
                    activeColors = [];
                    gameEnded = true;
                    activities.push('Board finished. ' + finishedBoardText);
                }
            } else {
                playAudio('audio-token-home');
            }
        }
    };
    this.estimateProgress = function (n) {
        if (Token.tracker[this.color][this.n].pos === undefined) {
            if (n !== 1) {
                return;
            }
        }
        const currentTokenTrackingObj = Token.tracker[this.color][this.n];
        const stepArr = steps[this.color];
        const pos = currentTokenTrackingObj.pos;
        const newPos = pos + n < 56 ? pos + n : 56;

        const star1 = isStar(stepArr[newPos].x, stepArr[newPos].y);
        if (star1 && star1.n === 1) {
            const availablePosArr = roomCellsForLiveTokens[star1.color][this.color].filter(pos => !pos.isOccupied);
            this.drawEstimate(availablePosArr[0].x, availablePosArr[0].y);
        } else {
            this.drawEstimate(stepArr[newPos].x, stepArr[newPos].y);
        }
    };
    this.undoEstimateProgress = function (n) {
        if (Token.tracker[this.color][this.n].pos === undefined) {
            if (n !== 1) {
                return;
            }
        }
        const currentTokenTrackingObj = Token.tracker[this.color][this.n];
        const stepArr = steps[this.color];
        const pos = currentTokenTrackingObj.pos;
        const newPos = pos + n < 56 ? pos + n : 56;

        const star1 = isStar(stepArr[newPos].x, stepArr[newPos].y);
        if (star1 && star1.n === 1) {
            const availablePosArr = roomCellsForLiveTokens[star1.color][this.color].filter(pos => !pos.isOccupied);
            this.eraseEstimate(availablePosArr[0].x, availablePosArr[0].y);
        } else {
            this.eraseEstimate(stepArr[newPos].x, stepArr[newPos].y);
        }
    };
}
Token.tracker = { // dynamic
    red: {
        1: {
            ix: 2,
            iy: 2,
            pos: -1,
            ref: new Token('red', 1)
        },
        2: {
            ix: 5,
            iy: 2,
            pos: -1,
            ref: new Token('red', 2)
        },
        3: {
            ix: 2,
            iy: 5,
            pos: -1,
            ref: new Token('red', 3)
        },
        4: {
            ix: 5,
            iy: 5,
            pos: -1,
            ref: new Token('red', 4)
        }
    },
    blue: {
        1: {
            ix: 11,
            iy: 2,
            pos: -1,
            ref: new Token('blue', 1)
        },
        2: {
            ix: 14,
            iy: 2,
            pos: -1,
            ref: new Token('blue', 2)
        },
        3: {
            ix: 11,
            iy: 5,
            pos: -1,
            ref: new Token('blue', 3)
        },
        4: {
            ix: 14,
            iy: 5,
            pos: -1,
            ref: new Token('blue', 4)
        }
    },
    yellow: {
        1: {
            ix: 11,
            iy: 11,
            pos: -1,
            ref: new Token('yellow', 1)
        },
        2: {
            ix: 14,
            iy: 11,
            pos: -1,
            ref: new Token('yellow', 2)
        },
        3: {
            ix: 11,
            iy: 14,
            pos: -1,
            ref: new Token('yellow', 3)
        },
        4: {
            ix: 14,
            iy: 14,
            pos: -1,
            ref: new Token('yellow', 4)
        }
    },
    green: {
        1: {
            ix: 2,
            iy: 11,
            pos: -1,
            ref: new Token('green', 1)
        },
        2: {
            ix: 5,
            iy: 11,
            pos: -1,
            ref: new Token('green', 2)
        },
        3: {
            ix: 2,
            iy: 14,
            pos: -1,
            ref: new Token('green', 3)
        },
        4: {
            ix: 5,
            iy: 14,
            pos: -1,
            ref: new Token('green', 4)
        }
    }
};

// function updateTokenTracker(updateObj) {
//     for (let color in colors) {
//         for (let n = 1; n <= 4; n++) {
//             Token.tracker[color][n].pos = updateObj[color][n].pos;
//         }
//     }
// }

function isFinished(color) {
    let point = 0;
    for (let i = 0; i < 4; i++) {
        const currentTokenTrackingObj = Token.tracker[color][i + 1];
        if (currentTokenTrackingObj.pos < 56) {
            return {
                status: false
            };
        }
        for (const c of activeColors) {
            if (c !== color) {
                point += Token.tracker[c][i + 1].pos === -1 ? 66 : 56 - Token.tracker[c][i + 1].pos;
            }
        }
    }
    return {
        status: true,
        point: point
    };
}

function finish(color, point) {
    activities.push(color + ' finishes in position: ' + (winnerColors.length + 1) + ' with point: ' + point);
    playAudio('audio-win');
    removeFromArr(activeColors, color);
    winnerColors.push({
        color: color,
        point: point
    });
}

function isFinishedBoard() {
    return activeColors.length <= 1;
}

function Star(color, fontColor, n) {
    this.color = color;
    this.fontColor = fontColor;
    this.n = n;
    this.draw = function (x, y) {
        const starHTML = '<i class="fa fa-star star" id="i-star-' + this.color + '-' + this.n + '"></i>';
        $('#cell-' + y + '-' + x).append(starHTML);
        // $('#cell-' + y + '-' + x).addClass('star');
        $('#i-star-' + this.color + '-' + this.n).css({
            'color': this.fontColor
        });
        if (!Star.tracker[this.color]) {
            Star.tracker[this.color] = {};
        }
        Star.tracker[this.color][this.n] = {
            x: x,
            y: y,
            ref: this
        }
    };
    this.hide = function () {
        $('#i-star-' + this.color + '-' + this.n).hide();
    };
    this.show = function () {
        $('#i-star-' + this.color + '-' + this.n).show();
    };
}
Star.tracker = {};