import { getNewToken } from '../components/refresh_token.js';
import { getStatus, getTotalSum, logout } from '../components/utils.js';
import { checkAdmin } from '../components/check_admin.js';

let tokenExpires = localStorage.getItem('tokenExpires') || 'undefined';

if (tokenExpires === 'undefined') {
    window.location.href = 'login.html';
}

let promise = checkAdmin();
promise.then((result) => {
    if (result) {
        window.location.href = 'admin_panel.html';
    }
});

if (Date.now() > tokenExpires) {
    let newToken = getNewToken();
    if (newToken === 'undefined') {
        window.location.href = 'login.html';
    }
}

$(document).ready(function() {
    $('#logout').click(function() {
        logout();
    });

    $('#back').click(function(){
        window.location.href = 'index.html';
    });

    getPanelData();
});

function getPanelData() {
    let token = localStorage.getItem('access_token') || 'undefined';
    if (token === 'undefined') {
        window.location.href = 'login.html';
    }

    fetch('http://127.0.0.1:8000/api/v1/order/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        credentials: 'same-origin'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        let orders = $('#order__container');
        let total_price = $('#total__price');
        let ordersInner = ''

        const getProuctsForOrder = (products) => {
            let productsInner = '';
            products.forEach(product => {
                productsInner += `<section class="product_container container">
                                    <div class="product_name"><span class="main_text">Name</span>: ${product.title}</div>
                                    <div class="product_price"><span class="main_text">Price</span>: ${product.price}$</div>
                                    <div class="product_count"><span class="main_text">Count</span>: ${product.count}</div>
                                </section>`;
            });
            return productsInner;
        }

        data.forEach((element, index) => {
            ordersInner += `<div class="order_number">${index + 1}</div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="order_container">
                                    ${getProuctsForOrder(element.order)}
                                </div>
                            </div>
                            <div class="col-lg-6 status_container">
                            <span class="main_text">Status</span>:&nbsp;<span class="status"> <span class="${getStatus(element.status + 1)}">${getStatus(element.status + 1)}</span>
                            </div>
                        </div>
                        <hr class="my-1">`;
        });

        orders.append(ordersInner);
        total_price.append(`<span class="main_text">Total price</span>: <span class="status">${getTotalSum(data)}</span> <span class="main_text">$</span>`);

    }).catch(err => {
        console.log(err);
    });
}