import _ from 'lodash';
import $ from "jquery";
import { Modal, Toast } from "bootstrap";
import 'bootstrap/dist/css/bootstrap.css';

import './../node_modules/font-awesome/css/font-awesome.css'
import './style.css';

import { Board } from './Modules/Board';

const max_players_count = 10;

var modal;

$(document).ready(function() {
    // Add body-small class if window less than 768px
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }

    $("#btn-new-game").on("click", startGame);

    createPlayerCountgroup();
});

function createPlayerCountgroup() {
    for (let i = 2; i <= max_players_count; i++) {
        $("#grp-player-count").append("<button class='btn btn-white " + (i == 2 ? "active" : "") + "' data-value='" + i + "'>" + i + "</button>");
    }

    $("#grp-player-count .btn").on("click", function(e) {
        $("#grp-player-count .btn").removeClass("active");
        $(e.target).addClass("active");
    });
}

function startGame() {

    var playerCount = $("#grp-player-count .btn.active").data("value");

    if (!playerCount) {
        showStartGameMessage("Not player count Selected", "danger");
        return;
    }

    if (!modal) {
        modal = new Modal(document.getElementById("modal-form"), {
            backdrop: 'static',
            keyboard: false
        });

        modal._element.querySelector("#btn-dismiss").onclick = () => {
            modal.hide();
        };
    }

    //empty any previous game.
    modal._element.querySelector(".modal-body").textContent = "";

    var board = new Board();
    modal._element.querySelector(".modal-body").appendChild(board.loadBoard(playerCount));

    modal.show();
}

function showStartGameMessage(message) {
    $("#pnl-messages > .toast-body").empty().append(message);
    new Toast("#pnl-messages").show();
}