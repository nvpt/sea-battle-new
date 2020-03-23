var CELL = 'cell';
var INACTIVE = 'inactive';
var EMPTY = 'empty';
var BOOM = 'boom';
var BOAT = 'boat';
var HIT = 'hit';
var KILLED = 'killed';
var HIDE = 'hide';
var SHOW = 'show';
var SHOW_HIDE_BTN = 'show-hide-btn';

var logList = document.querySelector('.history__list');
var stepsBlock = document.querySelector('#steps');
var sbBtn = document.querySelector('#sb-btn');
var sbModal = document.querySelector('#sbModal');
var closeModal = document.querySelector('#closeModal');
var gameInfo = document.querySelector('.game__info');

var logs = {};
var steps = 0;
var finished = false;

// типы и количество кораблей
var fleet = [[4, 1], [3, 2], [2, 3], [1, 4]];

// здесь храним привзяку координат к конкретным кораблям
var fleetCoords = {
    41: [],
    31: [],
    32: [],
    21: [],
    22: [],
    23: [],
    11: [],
    12: [],
    13: [],
    14: [],
};

// игровое поле
var field = {
    '1.1': 0, '2.1': 0, '3.1': 0, '4.1': 0, '5.1': 0, '6.1': 0, '7.1': 0, '8.1': 0, '9.1': 0, '10.1': 0,
    '1.2': 0, '2.2': 0, '3.2': 0, '4.2': 0, '5.2': 0, '6.2': 0, '7.2': 0, '8.2': 0, '9.2': 0, '10.2': 0,
    '1.3': 0, '2.3': 0, '3.3': 0, '4.3': 0, '5.3': 0, '6.3': 0, '7.3': 0, '8.3': 0, '9.3': 0, '10.3': 0,
    '1.4': 0, '2.4': 0, '3.4': 0, '4.4': 0, '5.4': 0, '6.4': 0, '7.4': 0, '8.4': 0, '9.4': 0, '10.4': 0,
    '1.5': 0, '2.5': 0, '3.5': 0, '4.5': 0, '5.5': 0, '6.5': 0, '7.5': 0, '8.5': 0, '9.5': 0, '10.5': 0,
    '1.6': 0, '2.6': 0, '3.6': 0, '4.6': 0, '5.6': 0, '6.6': 0, '7.6': 0, '8.6': 0, '9.6': 0, '10.6': 0,
    '1.7': 0, '2.7': 0, '3.7': 0, '4.7': 0, '5.7': 0, '6.7': 0, '7.7': 0, '8.7': 0, '9.7': 0, '10.7': 0,
    '1.8': 0, '2.8': 0, '3.8': 0, '4.8': 0, '5.8': 0, '6.8': 0, '7.8': 0, '8.8': 0, '9.8': 0, '10.8': 0,
    '1.9': 0, '2.9': 0, '3.9': 0, '4.9': 0, '5.9': 0, '6.9': 0, '7.9': 0, '8.9': 0, '9.9': 0, '10.9': 0,
    '1.10': 0, '2.10': 0, '3.10': 0, '4.10': 0, '5.10': 0, '6.10': 0, '7.10': 0, '8.10': 0, '9.10': 0, '10.10': 0,
};


function multiAction(identificator, cb) {
    document.querySelectorAll(identificator).forEach(cb);
}

function isNumber(val) {
    return (!isNaN(parseInt(val)) && isFinite(parseInt(val)));
}

function getRnd(min, max) {
    return min + Math.floor(Math.random() * (max + 1 - min));
}

//цифры координат в буквы (для логов ходов)
function convertCoord(val) {

    if (isNumber(val)) {
        switch (Number(val)) {
            case 1:
                return 'а';
            case 2:
                return 'б';
            case 3:
                return 'в';
            case 4:
                return 'г';
            case 5:
                return 'д';
            case 6:
                return 'е';
            case 7:
                return 'ж';
            case 8:
                return 'з';
            case 9:
                return 'и';
            case 10:
                return 'к';
            default:
                return 'а';
        }
    } else {
        switch (val.toLowerCase()) {
            case 'a':
                return 1;
            case 'б':
                return 2;
            case 'в':
                return 3;
            case 'г':
                return 4;
            case 'д':
                return 5;
            case 'е':
                return 6;
            case 'ж':
                return 7;
            case 'з':
                return 8;
            case 'и':
                return 9;
            case 'к':
                return 10;
            default:
                return 1;
        }
    }
}

// произвольное задание направления постройки корабля при рендере флота
function getDirection() {
    var directionIndex = getRnd(1, 4);
    switch (directionIndex) {
        case 1:
            return 'top';
        case 2:
            return 'right';
        case 3:
            return 'bottom';
        case 4:
            return 'left';
        default:
            return 'top';
    }
}

// оформление клетки в зависимости от действия
function decorateCell(l, n, className) {
    var coords = '[data-cell = "' + l + '.' + n + '"]';
    if (document.querySelector(coords)) {
        document.querySelector(coords).classList.add(className);
    }
}

// добавление корабля на игровое поле
function addToMap(arr) {
    for (var i = 0; i < arr.length; i++) {
        var arrElement = arr[i];
        decorateCell(arrElement.split('.')[0], arrElement.split('.')[1], BOAT);
        decorateCell(arrElement.split('.')[0], arrElement.split('.')[1], HIDE);
    }
}

// маркирование клеток в объекте field
function addToField(coordsArr, val) {
    coordsArr.forEach(function(el) {
        field[el] = val;
    });
}

// распределение координат по кораблям
function addToFleetCoords(proto, length, number) {
    proto.forEach(function(el) {
        var newShipCoords = {};
        newShipCoords[el] = 1;
        fleetCoords['' + length + number].push(newShipCoords);
    });
}

// получить количество НЕВРЕДИМЫХ клеток-кораблей на карте
function getUnharmedCount() {
    var counter = 0;
    multiAction('.' + BOAT, function(el) {
        if (
            (!el.classList.contains(HIT))
            && (!el.classList.contains(KILLED))
        )
            counter++;
    });
    return counter;
}

// разрешение на заполнение ячейки при постройке кораблей
function accessBuild(nextPosition /*, x, y*/) {
    return (field[nextPosition] !== undefined && field[nextPosition] === 0);

    // TODO. Если будет реализовано "неслипание" кораблей
    // return (field[x + '.' + y] !== undefined)
    //     && (field[x + '.' + y] !== 1);
    //...
}

// основная функция вывода кораблей на карту
function renderFleet(fleet, field) {

    for (var i = 0; i < fleet.length; i++) {
        var ship = fleet[i];
        var shipLength = ship[0];
        var shipQuantity = ship[1];

        for (var j = 0; j < shipQuantity; j++) {
            // промежуточный массив хранения координат строящегося корабля
            var shipProto = [];
            var flagShipNotCreated = true;

            while (flagShipNotCreated) {
                var x = getRnd(1, 10);
                var y = getRnd(1, 10);
                var startPosition = x + '.' + y;
                var direction = getDirection();

                // сброс постройки при занятой клетке или неверных координатах
                function resetBuilding() {
                    flagShipNotCreated = true;
                    shipProto = [];
                    direction = getDirection();
                }

                if (field[startPosition] === 0) {
                    shipProto.push(startPosition);
                    flagShipNotCreated = false;

                    if (direction === 'top') {
                        for (var k = 1; k < shipLength; k++) {
                            var nextPositionTop = x + '.' + (y - k);
                            if (accessBuild(nextPositionTop)) {
                                shipProto.push(nextPositionTop);
                            } else {
                                resetBuilding();
                                break;
                            }
                        }
                    } else if (direction === 'right') {
                        for (var l = 1; l < shipLength; l++) {
                            var nextPositionRight = (x + l) + '.' + y;
                            if (accessBuild(nextPositionRight)) {
                                shipProto.push(nextPositionRight);
                            } else {
                                resetBuilding();
                                break;
                            }
                        }
                    } else if (direction === 'bottom') {
                        for (var m = 1; m < shipLength; m++) {
                            var nextPositionBottom = x + '.' + (y + m);
                            if (accessBuild(nextPositionBottom)) {
                                shipProto.push(nextPositionBottom);
                            } else {
                                resetBuilding();
                                break;
                            }
                        }
                    } else if (direction === 'left') {
                        for (var n = 1; n < shipLength; n++) {
                            var nextPositionLeft = (x - n) + '.' + y;
                            if (accessBuild(nextPositionLeft)) {
                                shipProto.push(nextPositionLeft);
                            } else {
                                resetBuilding();
                                break;
                            }
                        }
                    }
                    if (shipProto.length > 0) {
                        addToField(shipProto, '' + ship[0] + (j + 1));
                        addToMap(shipProto);
                        addToFleetCoords(shipProto, ship[0], (j + 1));
                    }
                }
            }
        }
    }
    getUnharmedCount();
}

// очистка поля
function restartGame(classIdentifier) {
    steps = 0;
    logs = {};
    finished = false;
    sbModal.classList.remove(SHOW);
    stepsBlock.innerHTML = steps;

    multiAction('.' + classIdentifier, function(el) {
        el.classList.add(INACTIVE);
        el.classList.remove(EMPTY, BOAT, HIT, KILLED, BOOM);
    });
    Object.keys(field).forEach(function(el) {
        return field[el] = 0;
    });
    Object.keys(fleetCoords).forEach(function(el) {
        fleetCoords[el] = [];
    });
    gameInfo.classList.add(SHOW);
    setTimeout(function() {
        gameInfo.classList.remove(SHOW);
        multiAction('.' + classIdentifier, function(el) {
            el.classList.remove(INACTIVE);
        });
        }, 2000);
    // }, 0); //TODO temp for debug
}

//запуск таймера
(function startGame() {
    sbBtn.addEventListener('click', function() {
        restartGame(CELL);
        renderFleet(fleet, field);
        logList.innerHTML = '';
    });
})();

// отображение подсказки
(function toggleVisibility() {
    document.querySelector('#' + SHOW_HIDE_BTN).addEventListener('click', function(e) {
        e.preventDefault();
        multiAction('.' + BOAT, function(el) {
            if (el.classList.contains(HIDE)) {
                el.classList.remove(HIDE);
            } else {
                el.classList.add(HIDE);
            }
        });
    });
})();

// запись в логи
function writeLogs(el, date, donePhrase) {
    var coordinates = el.getAttribute('data-cell');
    var phrase = donePhrase || '';
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var time = hh + ':' + mm + ':' + ss;
    var letter = convertCoord(coordinates.split('.')[0]).toUpperCase();
    var parsedCoordinates = letter + '-' + coordinates.split('.')[1];

    var logLine = document.createElement('li');
    logLine.classList.add('history__item');

    var logCoordinates = document.createElement('span');
    logCoordinates.classList.add('value');
    if (phrase) {
        logCoordinates.innerHTML = donePhrase + ': ';
    } else {
        logCoordinates.innerHTML = parsedCoordinates + ': ';
    }

    var logTime = document.createElement('span');
    logTime.classList.add('value', 'value_time');
    logTime.innerHTML = time;

    logLine.appendChild(logCoordinates);
    logLine.appendChild(logTime);
    logList.appendChild(logLine);
}

// проверка, уничтожен ли корабль полнностью
function isKilled(clicked) {
    var kickTarget = clicked.getAttribute('data-cell');
    var shipId = field[kickTarget];
    var shipCoords = fleetCoords[shipId] || [];
    var isKilled = true;

    for (var i = 0; i < shipCoords.length; i++) {
        var coord = shipCoords[i];
        if (Object.keys(coord)[0] === kickTarget) {
            var newObj = {};
            newObj[kickTarget] = -1;
            shipCoords[i] = newObj;
        }
    }

    for (var j = 0; j < shipCoords.length; j++) {
        var it = shipCoords[j];
        if (it[Object.keys(shipCoords[j])[0]] === 1) {
            isKilled = false;
        }
    }

    if (isKilled) {
        console.log('index.js__411 >> 3');
        if (!clicked.classList.contains(KILLED)) {
            writeLogs(clicked, new Date(), 'Подбит ' + shipCoords.length + '-мачтовый');
        }

        for (var y = 0; y < shipCoords.length; y++) {
            var coordKill = Object.keys(shipCoords[y])[0];
            field[coordKill] = -1;
            multiAction('[data-cell = "' + coordKill + '"]', function(el) {
                el.classList.add(KILLED);
            });
        }
    }
}

// выполнение хода в игре
(function move() {
    multiAction('.' + CELL, function(el) {
        el.addEventListener('click', function() {

            if (!el.classList.contains(INACTIVE)) {
                el.classList.add(BOOM);

                if (
                    !el.classList.contains(EMPTY)
                    && !el.classList.contains(HIT)
                    && !el.classList.contains(KILLED)
                ) {
                    steps += 1;
                }

                if (
                    el.classList.contains(BOAT)
                    && !el.classList.contains(HIT)
                ) {
                    writeLogs(el, new Date());
                }


                if (el.classList.contains(BOAT)) {
                    el.classList.add(HIT);
                    el.classList.remove(HIDE);
                    isKilled(el);
                } else {
                    el.classList.add(EMPTY);
                }

                if (getUnharmedCount() < 1) {
                    finishGame(el);
                }
            }
            stepsBlock.innerHTML = steps;
        });
    });
})();

(function hideModal() {
    closeModal.addEventListener('click', function() {
        sbModal.classList.remove(SHOW);
    });
})();

function finishGame(el) {
    if (!finished) {
        sbModal.classList.add(SHOW);
        writeLogs(el, new Date(), 'Победа!');
        multiAction('.'+ CELL, function(el){
            el.classList.add(INACTIVE);
        });
        finished = true;
    }
}


