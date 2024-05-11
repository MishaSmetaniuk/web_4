import { getNewToken } from './components/refresh_token.js';
import { setTokens } from './components/utils.js';

let token = localStorage.getItem('access_token') || 'undefined';

$(document).ready(function() {
    $('#modal__basket').on('click', function() {
        $('#modal__basket__container').css('display', 'block');
        loadBasket();
    });

    $(document).on('click', '#purchase_btn', function() {
        let title = $(this).closest('.card').find('.card-title').text();
        let price = $(this).closest('.card').find('.price').text();
        let count = 1;

        let obj = {
            title: title.split(':')[1].slice(1),
            price: price.split(':')[1].slice(1, -1),
            count: count
        }
        addProductToBasket(obj);    
        
    });

    $(document).on('click', '#add__to__basket', function() {
        let price = $(this).closest('.added-item').find('.added-item-cost').text();
        let obj = basket.filter(item => item.price === price)[0];

        addProductToBasket(obj); 
    });

    $(document).on('click', '#remove__from__basket', function() {
        let price = $(this).closest('.added-item').find('.added-item-cost').text();
        let obj = basket.filter(item => item.price === price)[0];   

        removeProductFromBasket(obj);
    });

    $(document).on('click', '.close', function() {
        let price = $(this).closest('.added-item').find('.added-item-cost').text();
        let obj = basket.filter(item => item.price === price)[0];   

        basket = basket.filter(item => item.price !== price);
        localStorage.setItem('basket', JSON.stringify(basket));

        loadBasket();
    }); 

    $(document).on('click', '#filter__by__price', function() {
        loadBasket('price');
    });

    $(document).on('click', '#filter__by__sum', function() {
        loadBasket('sum');
    });

    $(document).on('click', '#filter__by__name', function() {
        loadBasket('name');
    });

    $(document).on('click', '#make_order', function() {
        makeOrder();
    });
});

let basket = JSON.parse(localStorage.getItem('basket')) || [];

function loadBasket(custom_filter='none') {
    if (custom_filter === 'price') {
        basket.sort((a, b) => a.price - b.price);
    } else if (custom_filter === 'sum') {
        basket.sort((a, b) => a.price * a.count - b.price * b.count);
    } else if (custom_filter === 'name') {
        basket.sort((a, b) => a.title.localeCompare(b.title));
    }
    let basket_container = document.getElementById('modal__basket__container');
    let basketHtml = '';

    basket.forEach(product => {
        basketHtml += renderBasketHTML(product);
    });


    basketHtml += '<ul class="navbar-nav me-auto mb-2 mb-lg-0">\
    <li class="nav-item dropdown">\
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">\
        Filters\
      </a>\
      <ul class="dropdown-menu" aria-labelledby="navbarDropdown">\
        <li><a class="dropdown-item" id="filter__by__name" >name</a></li>\
        <a class="dropdown-item" id="filter__by__price">price</a>\
        <li><a class="dropdown-item" id="filter__by__sum">total sum</a></li>\
      </ul>\
    </li>\
  </ul>';

    basketHtml += `
     <div class="buy_btn">
        <button type="button" id="make_order" class="btn btn-success">${basket.reduce((acc, item) => acc + item.price * item.count, 0)}$</button>
     </div>`
    basket_container.innerHTML = basketHtml;
}

function renderBasketHTML(product) {
    let basketHTML = '<div class="added-item">';
    basketHTML += `<div class="added-item-title" id="basket_title" name="basket_title">${product.title}`;
    basketHTML += `<div class="amount-and-cost">`;
    basketHTML += `<span class="added-item-cost" id="basket_price">${product.price}</span>`;
    basketHTML += `<p class="added-item-amount" id="basket_count">Count: ${product.count}</p>`;
    basketHTML += '</div>';
    basketHTML += '</div>';
   

    basketHTML += '<div class="btn-group" role="group" aria-label="Basic example">\
    <button type="button" class="btn btn-secondary" id="add__to__basket">+</button>\
    <button type="button" class="btn btn-secondary" id="remove__from__basket">-</button>\
                  </div>'
    basketHTML += '<button type="button" class="close" aria-label="Close">\
    <span aria-hidden="true">&times;</span>\
                    </button>'
    basketHTML += '</div>';

    return basketHTML;
}

function addProductToBasket(product) {
    let productIndex = basket.findIndex(item => item.title === product.title);
    if (productIndex >= 0) {
        basket[productIndex].count++;
    } else {
        basket.push(product);
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    loadBasket();
}

function removeProductFromBasket(product) {
    let productIndex = basket.findIndex(item => item.title === product.title);
    if (productIndex >= 0) {
        basket[productIndex].count--;
        if (basket[productIndex].count === 0) {
            basket.splice(productIndex, 1);
        }
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    loadBasket();
}

function makeOrder() {
    token = localStorage.getItem('access_token') || 'undefined';
    let tokenExpires = localStorage.getItem('tokenExpires') || 'undefined';

    if (token === 'undefined' || tokenExpires === 'undefined' || Date.now() > tokenExpires) {
        token = getNewToken();
    }
    console.log(basket)
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({'order': basket, 'status' : 0})
        
    }; 

    fetch('http://127.0.0.1:8000/api/v1/order/', requestOptions).then(
        response => {
            return response.json();
        }
    ).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });

    basket = [];
    localStorage.setItem('basket', JSON.stringify(basket));

    loadBasket();
}

