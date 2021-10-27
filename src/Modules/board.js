import './board.css';


class Board {

    loadBoard(playerCount) {
        var _self = this;

        this.playerCount = playerCount;
        this.scoreboard = [];
        this.currentPlayer = 0;

        for (let i = 0; i < this.playerCount; i++) {
            this.scoreboard.push({
                name: "Player " + (i + 1),
                score: 0,
                currentScore: 0
            });
        }


        this.board = document.createElement('div');
        this.board.className = "board";

        this.setHeader();
        this.setDice();
        this.setToolbar();
        this.setPlayerList();

        return this.board;
    }

    setHeader() {
        this.board.innerHTML = "<div class='col-sm-12 text-success' id='pnl-header' ><h2>" + this.scoreboard[this.currentPlayer].name + "</h2><h4>" + this.scoreboard[this.currentPlayer].score + " pts</h4></div>";
    }

    setDice() {
        var dice_container = document.createElement('div');
        dice_container.className = "dice col-md-8";

        dice_container.appendChild(this.createDie());
        dice_container.appendChild(this.createDie());

        this.board.appendChild(dice_container);
    }

    setToolbar() {
        const _self = this;

        var btn_container = document.createElement("div");
        btn_container.className = "col-lg-12 text-center m-b-lg";

        var btn_roll_dice = document.createElement("a");
        btn_roll_dice.id = "btn-roll-dice";
        btn_roll_dice.className = "btn btn-success m-r-lg";
        btn_roll_dice.textContent = "Roll Dice";
        btn_roll_dice.onclick = () => {
            _self.rollDice();
        }
        btn_container.appendChild(btn_roll_dice);


        var btn_hold = document.createElement("a");
        btn_hold.id = "btn-hold";
        btn_hold.className = "btn btn-info m-l-lg";
        btn_hold.textContent = "Hold";

        btn_hold.classList.add("disabled", "collapse");
        btn_hold.onclick = () => {
            _self.hold();
        }
        btn_container.appendChild(btn_hold);


        var btn_next = document.createElement("a");
        btn_next.id = "btn-next";
        btn_next.className = "btn btn-warning m-l-lg";
        btn_next.textContent = "Next Player";

        btn_next.classList.add("disabled", "collapse");
        btn_next.onclick = () => {
            _self.nextPlayer();
        }
        btn_container.appendChild(btn_next);


        var pnl_results = document.createElement("div");
        pnl_results.classList.add("col-lg-12", "alert", "alert-success", "collapse");
        pnl_results.id = "pnl-results";
        btn_container.appendChild(pnl_results);


        this.board.appendChild(btn_container);
    }

    setPlayerList() {

        var btn_group = document.createElement("div");
        btn_group.classList.add("col-lg-12");
        btn_group.innerHTML = "<ul class='players-list list-group list-group-horizontal col-lg-12'></ul>"

        this.scoreboard.forEach((score) => {
            let btn = document.createElement("li");

            btn.classList.add("list-group-item");
            if (!btn_group.querySelector(".list-group").hasChildNodes()) {
                btn.classList.add("bg-success");
            }
            btn.innerHTML = score.name + "<br><small>" + score.score + " pts</small>";

            btn_group.querySelector(".list-group").appendChild(btn);
        });

        this.board.appendChild(btn_group);
    }

    createDie() {
        const _self = this;
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

        die.addEventListener("transitionend", animationEnd);

        function animationEnd() {
            if (this.dataset.roll == 1) {
                die.classList.add("animated", "shake");
            }

            _self.proccessedDiceCount++;
            if (_self.proccessedDiceCount == _self.diceCount) {
                _self.proccessResults();
            }
        }
        return die;
    }

    rollDice() {
        const _self = this;
        const dice = [..._self.board.querySelectorAll(".die-list")];

        _self.diceCount = dice.length;
        _self.proccessedDiceCount = 0;
        _self.lastResult = [];

        _self.board.querySelector("#btn-roll-dice").classList.add("disabled");
        _self.board.querySelector("#btn-hold").classList.remove("collapse");
        _self.board.querySelector("#btn-next").classList.add("disabled", "collapse");

        dice.forEach((die) => {
            //animate dice shaking
            die.classList.remove("animated", "shake");
            _self.toggleClasses(die);

            let value = getRandomNumber(1, 6);
            die.dataset.roll = value;
            _self.lastResult.push(value);
        });

    }

    toggleClasses(die) {
        die.classList.toggle("odd-roll");
        die.classList.toggle("even-roll");
    }

    proccessResults() {
        const _self = this;
        _self.board.querySelector("#btn-roll-dice").classList.remove("disabled");

        if (_self.lastResult.every(elem => elem == 1)) {
            //avoid rolling and prevent holding. must continue to next player
            _self.board.querySelector("#btn-roll-dice").classList.add("disabled", "collapse");
            _self.board.querySelector("#btn-hold").classList.add("disabled", "collapse");
            _self.board.querySelector("#btn-next").classList.remove("disabled", "collapse");

            _self.scoreboard[_self.currentPlayer].score = 0;
            _self.scoreboard[_self.currentPlayer].currentScore = 0;

        } else if (_self.lastResult.every(elem => elem == _self.lastResult[0])) {
            //if doubles are shown, must roll again
            _self.board.querySelector("#btn-hold").classList.add("disabled", "collapse");

            //add current result
            _self.scoreboard[_self.currentPlayer].currentScore += _self.lastResult.reduce((previousValue, currentValue) => previousValue + currentValue);
        } else if (_self.lastResult.indexOf(1) == -1) {
            _self.board.querySelector("#btn-hold").classList.remove("disabled", "collapse");

            //add current result
            _self.scoreboard[_self.currentPlayer].currentScore += _self.lastResult.reduce((previousValue, currentValue) => previousValue + currentValue);
        } else {
            //avoid rolling and prevent holding. must continue to next player
            _self.board.querySelector("#btn-roll-dice").classList.add("disabled", "collapse");
            _self.board.querySelector("#btn-hold").classList.add("disabled", "collapse");
            _self.board.querySelector("#btn-next").classList.remove("disabled", "collapse");

            _self.scoreboard[_self.currentPlayer].currentScore = 0;
        }

        //update displayed score
        _self.board.querySelector("#pnl-header").querySelector("h4").innerHTML = _self.scoreboard[_self.currentPlayer].score + " pts <small>(current: " + _self.scoreboard[_self.currentPlayer].currentScore + " pts)</small>";
    }

    hold() {
        const _self = this;
        _self.scoreboard[_self.currentPlayer].score += _self.scoreboard[_self.currentPlayer].currentScore;

        if (_self.scoreboard[_self.currentPlayer].score >= 100) {

            _self.board.querySelector("#pnl-results").textContent = _self.scoreboard[_self.currentPlayer].name + " Wins (" + _self.scoreboard[_self.currentPlayer].score + " Points)";

            _self.board.querySelector("#btn-roll-dice").classList.add("disabled", "collapse");
            _self.board.querySelector("#btn-hold").classList.add("disabled", "collapse");
            _self.board.querySelector("#btn-next").classList.add("disabled", "collapse");
            _self.board.querySelector("#pnl-results").classList.remove("collapse");
        } else {
            _self.nextPlayer();
        }
    }

    nextPlayer() {
        const _self = this;
        var players = _self.board.querySelector(".players-list").querySelectorAll("li");

        _self.scoreboard[_self.currentPlayer].currentScore = 0;

        _self.scoreboard.forEach((score, index) => {
            let player = players[index];

            player.classList.remove("bg-success");
            player.innerHTML = score.name + "<br><small>" + score.score + " pts</small>";
        });

        //if Last player reached, start a new round
        _self.currentPlayer = (_self.currentPlayer + 1 == _self.scoreboard.length ? 0 : _self.currentPlayer + 1);

        //update player name on title
        _self.board.querySelector("#pnl-header").innerHTML = "<h2>" + _self.scoreboard[_self.currentPlayer].name + "</h2><h4>" + _self.scoreboard[_self.currentPlayer].score + " pts</h4>";

        players[_self.currentPlayer].classList.add("bg-success");

        _self.board.querySelector("#btn-roll-dice").classList.remove("disabled", "collapse");
        _self.board.querySelector("#btn-hold").classList.add("disabled", "collapse");
        _self.board.querySelector("#btn-next").classList.add("disabled", "collapse");


        _self.board.addEventListener("transitionend", animationEnd);

        function animationEnd() {
            _self.board.classList.remove("animated", "fadeInRight");
            _self.board.removeEventListener("transitionend", animationEnd);
        }
        _self.board.classList.add("animated", "fadeInRight");

    }
}


function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { Board };