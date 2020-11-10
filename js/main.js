'use strict';
import {
  disableScroll,
  enableScroll
} from './disableScroll.js';
import '../node_modules/swiper/swiper-bundle.min.js'

const RED_COLOR = '#ff0000';
const LIGHT_RED = '#ff6d4d'

const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
const buttonAuth = document.querySelector('.button-auth');
const closeAuth = document.querySelector('.close-auth');
const modalAuth = document.querySelector('.modal-auth');
const btnLogInForm = document.querySelector('#logInForm')
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');
const modalBody = document.querySelector('.modal-body');

let login;
let password;

const cart = JSON.parse(localStorage.getItem(`gloDelivery_${login}`)) || [];

function saveCart() {
  localStorage.setItem(`gloDelivery_${login}`, JSON.stringify(cart));
}

const getData = async function (data) {
  const response = await fetch(data);

  if (!response.ok)
    throw new Error(`Ошибка по адресу: ${data}, статус: ${response.status}`);

  return await response.json();
}

function toggleModal() {
  modal.classList.toggle('is-open');
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  if (modalAuth.classList.contains('is-open')) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function validLogin(str) {
  const regLogin = /^['a-zA-Z']['a-zA-Z0-9-\._']{1,20}$/;
  return regLogin.test(str);
}

function validPass(str) {
  const regPass = /^['a-zA-Z0-9']{1,20}$/;
  return regPass.test(str);
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
    localStorage.removeItem('gloDeliveryLog');
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
    if (validLogin(loginInput.value) && validPass(passwordInput.value)) {
      login = loginInput.value;
      password = passwordInput.value;
      localStorage.setItem('gloDeliveryLog', login);
      localStorage.setItem('gloDeliveryPass', password);

      toggleModalAuth();

      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      btnLogInForm.removeEventListener('submit', logIn);
      btnLogInForm.reset();

      checkAuth();
    }
    if (!validLogin(loginInput.value) && validPass(passwordInput.value)) {
      loginInput.style.borderColor = RED_COLOR;
      passwordInput.style.borderColor = '';
      loginInput.value = null;
    }
    if (validLogin(loginInput.value) && !validPass(passwordInput.value)) {
      passwordInput.style.borderColor = RED_COLOR;
      loginInput.style.borderColor = '';
      passwordInput.value = null;
    }
    if (!validLogin(loginInput.value) && !validPass(passwordInput.value)) {
      loginInput.style.borderColor = RED_COLOR;
      passwordInput.style.borderColor = RED_COLOR;
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

function createCardRestaurant(restaurant) {

  const {
    image,
    price,
    stars,
    time_of_delivery: timeOfDelivery,
    name,
    kitchen,
    products
  } = restaurant;

  const restaurantCard = document.createElement('a');
  restaurantCard.className = 'card card-restaurant';
  restaurantCard.products = products;
  restaurantCard.info = {
    name,
    kitchen,
    price,
    stars
  };

  const card = `
				<img src=${image} alt=${name} class="card-image"/>
				<div class="card-text">
						<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery} мин</span>
						</div>
						<div class="card-info">
								<div class="rating">
										${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
						</div>
				</div>
		`;

  restaurantCard.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', restaurantCard);
}

function createFoodCard({
  price,
  name,
  description,
  image,
  id
}) {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;

  card.insertAdjacentHTML('beforeend',
    `<img src="${image}" alt=${name} class="card-image"/>
				<div class="card-text">
						<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
						</div>
						<div class="card-info">
								<div class="ingredients">${description}</div>
						</div>
						<div class="card-buttons">
								<button class="button button-primary button-add-cart">
										<span class="button-card-text">В корзину</span>
										<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold card-price">${price} ₽</strong>
						</div>
				</div>`
  );

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openRestaurant(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant');
    const {
      kitchen,
      name,
      stars,
      price
    } = restaurant.info;

    restaurantTitle.textContent = name;
    restaurantRating.textContent = stars;
    restaurantPrice.textContent = `От ${price} ₽`;
    restaurantCategory.textContent = kitchen;
    buttonOut.style.display = '';
    cartButton.style.display = 'block';
    cartButton.classList.add('primary');

    if (restaurant) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      getData(`./db/${restaurant.products}`)
        .then(function (data) {
          data.forEach(createFoodCard);
        });
    }
  } else {
    clearAuth();
    toggleModalAuth();
  }
}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = card.id;

    const food = cart.find(function (item) {
      return item.id === id;
    })

    if (food) {
      food.count++;
    } else {
      cart.push({
        title,
        cost,
        id,
        count: 1
      });
    }
  }

  saveCart();
}

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function ({
    title,
    cost,
    id,
    count
  }) {
    const itemCart = `
			<div class="food-row">
				<span class="food-name">${title}</span>
				<strong class="food-price">${cost}</strong>
				<div class="food-counter">
					<button class="counter-button minus-counter" data-id=${id}>-</button>
					<span class="counter">${count}</span>
					<button class="counter-button plus-counter" data-id=${id}>+</button>
				</div>
			</div>
		`;
    if (cart.length > 0)
      modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce(function (res, item) {
    return res + (parseFloat(item.cost) * item.count)
  }, 0);

  modalPrice.textContent = totalPrice + " ₽";
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });

    if (target.classList.contains('minus-counter')) {
      food.count--;
      console.log('minus');
      if (!food.count) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('plus-counter')) {
      food.count++;
      console.log('plus');
    }

    renderCart();
  }
}

function init() {

  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
  });

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
    cartButton.style.display = '';

    if (buttonAuth.style.display !== '')
      buttonOut.style.display = 'block';

  });

  cardsMenu.addEventListener('click', addToCart);

  cartButton.addEventListener('click', renderCart);

  modalBody.addEventListener('click', changeCount);

  buttonClearCart.addEventListener('click', toggleModal);

  cartButton.addEventListener('click', function () {
    if (cart.length == 0) {
      modalBody.insertAdjacentHTML('afterbegin', `
				<div class="food-row">
					<span class="food-name">Empty</span>
				</div>
			`);
    }
  });

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openRestaurant);

  inputSearch.addEventListener('keypress', (event) => {
    if (event.charCode === 13) {
      let searchValue = event.target.value.trim();

      if (!searchValue) {
        event.target.style.backgroundColor = LIGHT_RED;
        event.target.value = '';

        setTimeout(() => {
          event.target.style.backgroundColor = '';
        }, 1000);

        return;
      }

      getData('./db/partners.json')
        .then((data) => {
          return data.map((partner) => {
            return partner.products;
          });
        })
        .then((links) => {
          cardsMenu.textContent = '';
          links.forEach((link) => {
            getData(`./db/${link}`)
              .then((data) => {
                const resultSearch = data.filter((item) => {
                  const name = item.name.toLowerCase();
                  return name.includes(searchValue.toLowerCase());
                });

                restaurantTitle.textContent = 'Результат поиска';
                restaurantRating.textContent = searchValue;
                restaurantPrice.textContent = '';
                restaurantCategory.textContent = 'разное';

                containerPromo.classList.add('hide');
                restaurants.classList.add('hide');
                menu.classList.remove('hide');

                resultSearch.forEach(createFoodCard);
              });
          });
        });
      event.target.value = '';
    }
  });

  checkAuth();

  // slider
  new Swiper('.swiper-container', {
    loop: true,
    speed: 900,
    effect: 'coverflow',
    grabCursor: true,
    autoplay: {
      delay: 2500,
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true,
    },
  });

}

init();