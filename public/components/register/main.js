'use strict'


import Registration from "./register.js";

function Main(){
    let reg = new Registration(document.getElementById('1'));
    reg.render();
}

Main();