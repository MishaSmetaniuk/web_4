import { getNewToken } from '../components/refresh_token.js';
import { checkAdmin } from '../components/check_admin.js';
import { logout, getStatus, getTotalSum } from '../components/utils.js';

let tokenExpires = localStorage.getItem('tokenExpires') || 'undefined';

if (tokenExpires === 'undefined') {
    window.location.href = 'login.html';
}

let promise = checkAdmin();
promise.then((result) => {
    if (!result) {
        window.location.href = 'panel.html';
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

    $(document).on('click', '.approve_order', function() {
        const orderId = $(this).data('order-id');
        const userId = $(this).data('user-id');
        
        const token = localStorage.getItem('access_token') || 'undefined';
        fetch(`http://127.0.0.1:8000/api/v1/order-admin/`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'},
            body: JSON.stringify({ 'order': orderId, 'status': 1, 'user': userId }),
            credentials: 'same-origin'
        });
        location.reload();
        
    });

    $(document).on('click', '.discard_order', function() {
        const orderId = $(this).data('order-id');
        const userId = $(this).data('user-id');

        const token = localStorage.getItem('access_token') || 'undefined';

        fetch(`http://127.0.0.1:8000/api/v1/order-admin/`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'},
            body: JSON.stringify({ 'order': orderId, 'status': -1, 'user': userId }),
            credentials: 'same-origin'
        
        });
        location.reload();
    });

    getPanelData();
});

async function getPanelData() {
    let token = localStorage.getItem('access_token') || 'undefined';
    if (token === 'undefined') {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/order-admin/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        let orders = $('#order__container');
        let total_price = $('#total__price');
        let ordersInner = '';

        const getProuctsForOrder = (products) => {
            console.log(products);
            let productsInner = '';
            products.forEach(product => {
                productsInner += `<section class="product_container container">
                                    <div class="product_name"><span class="main_text">Name</span>: ${product.title}</div>
                                    <div class="product_price"><span class="main_text">Price</span>: ${product.price}$</div>
                                    <div class="product_count"><span class="main_text">Count</span>: ${product.count}</div>
                                </section>`;
            });
            return productsInner;
        };

        for (const [index, element] of data.entries()) {
            try {
                const userDataResponse = await fetch(`http://127.0.0.1:8000/api/v1/user/${element.user}/`, {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + token },
                    credentials: 'same-origin'
                });
                if (!userDataResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const userData = await userDataResponse.json();
                const username = userData.username;

                ordersInner += `<div class="order_number">${index + 1}</div>
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="order_container">
                                        ${getProuctsForOrder(element.order)}
                                    </div>
                                </div>
                                <div class="col-lg-6 status_container">
                                <i class="fa fa-check approve_order" id="approve_order" data-order-id="${element.id}" data-user-id="${element.user}" aria-hidden="true"></i>
                                <i class="fa fa-ban discard_order" id="discard_order" data-order-id="${element.id}" data-user-id="${element.user}" aria-hidden="true"></i>
                                <p><span class="main_text">Status</span>:&nbsp;<span class="status"> <span class="${getStatus(element.status + 1)}">${getStatus(element.status + 1)}</span></p>
                                <p><span class="main_text">User</span>:&nbsp;<span class="status">${username}</p>
                                </div>
                            </div>
                            <hr class="my-1">`;
            } catch (error) {
                console.error('Error getting user data:', error);
            }
        }
        
        orders.append(ordersInner);
        total_price.append(`<span class="main_text">Total price</span>: <span class="status">${getTotalSum(data)}</span> <span class="main_text">$</span>`);

    } catch (error) {
        console.error('Error getting order data:', error);
    }
}

