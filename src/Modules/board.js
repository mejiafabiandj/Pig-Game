import './board.css';

class Board {

    loadBoard() {
        var board = document.createElement('div');
        board.className = "board";

        var dice_container = document.createElement('div');
        dice_container.className = "dice";
        dice_container.appendChild(createDie());
        dice_container.appendChild(createDie());

        board.appendChild(dice_container);

        var btn_container = document.createElement("div");
        btn_container.className = "col-lg-12 text-center m-b-lg";

        var btn_roll_dice = document.createElement("a");
        btn_roll_dice.className = "btn btn-primary";
        btn_roll_dice.textContent = "Roll Dice";
        btn_roll_dice.onclick = () => {
            rollDice();
        }

        btn_container.appendChild(btn_roll_dice);
        board.appendChild(btn_container);
        return board;
    }

}

function createDie() {
    var die = document.createElement('ol');
    die.className = "die-list even-roll";
    die.dataset.roll = 1;
    for (let i = 1; i <= 6; i++) {
        let side = document.createElement("li");
        side.className = "die-item";
        side.dataset.side = i;

        for (var j = 1; j <= i; j++) {
            let dot = document.createElement("span");
            dot.className = "dot";
            side.appendChild(dot);
        }

        die.appendChild(side);
    }
    return die;
}

function rollDice() {
    const dice = [...document.querySelectorAll(".die-list")];
    dice.forEach((die) => {
        toggleClasses(die);
        die.dataset.roll = getRandomNumber(1, 6);
    });
}

function toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { Board };