'use strict';
import {disableScroll, enableScroll} from './disableScroll.js';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");


cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
    modal.classList.toggle('is-open');
}

// day 1

const buttonAuth = document.querySelector('.button-auth');
const closeAuth = document.querySelector('.close-auth');
const modalAuth = document.querySelector('.modal-auth');
const btnLogInForm = document.querySelector('#logInForm')
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('gloDelivery');
let password = localStorage.getItem('gloDeliveryPass');

function toggleModalAuth() {
    modalAuth.classList.toggle("is-open");
    if (modalAuth.classList.contains("is-open")) {
        disableScroll();
    } 
    else {
        enableScroll();
    }
}

function clearAuth() {
    loginInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
    btnLogInForm.reset();
}
// when humen click button to loging out  
function authorized() {
    function logOut() {
        login = null;
        password = null;
        localStorage.removeItem('gloDelivery');
        localStorage.removeItem('gloDeliveryPass');
        buttonAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';
        buttonOut.removeEventListener('click', logOut);
        checkAuth();
    }

    userName.textContent = login;

    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';

    buttonOut.addEventListener('click', logOut);
}
// when humen click button to loging in
function notAuthorized() {
    function logIn(event) {
        event.preventDefault();
        if (loginInput.value.trim() && passwordInput.value.trim()) {    
            login = loginInput.value;
            password = passwordInput.value;
            localStorage.setItem('gloDelivery', login);
            localStorage.setItem('gloDeliveryPass', password);

            toggleModalAuth();

            buttonAuth.removeEventListener('click', toggleModalAuth);
            closeAuth.removeEventListener('click', toggleModalAuth);
            btnLogInForm.removeEventListener('submit', logIn);
            btnLogInForm.reset();

            checkAuth();
        }
        if (!loginInput.value.trim() && passwordInput.value.trim()) {
            loginInput.style.borderColor = '#ff0000';
            passwordInput.style.borderColor = '';
            loginInput.value = null;
        }
        if (loginInput.value.trim() && !passwordInput.value.trim()) {
            passwordInput.style.borderColor = '#ff0000';
            loginInput.style.borderColor = '';
            passwordInput.value = null;
        }   
        if (!loginInput.value.trim() && !passwordInput.value.trim()) {
            loginInput.style.borderColor = '#ff0000';
            passwordInput.style.borderColor = '#ff0000';
            loginInput.value = null;
            passwordInput.value = null;
        }
    }
    buttonAuth.addEventListener('click', toggleModalAuth);
    buttonAuth.addEventListener('click', clearAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    btnLogInForm.addEventListener('submit', logIn);

    modalAuth.addEventListener('click', function (event) {
        if (event.target.classList.contains('is-open')) {
            toggleModalAuth();
        }
    });
}

function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
}

checkAuth();