export const getStatus = (status) => {
    return ['Declined', 'Pending', 'Completed'][status];
}

export const getTotalSum = (products) => {
    let sum = 0;
    products.forEach(product => {
        product.order.forEach(order => {
            sum += order.price * order.count;
        });
    });
    return sum.toFixed(2);
}

export function logout() {
    localStorage.setItem('access_token', 'undefined');
    localStorage.setItem('refresh_token', 'undefined');
    localStorage.setItem('tokenExpires', 'undefined');
    window.location.href = 'login.html';
}

export function setTokens(login, password) {
    fetch('http://127.0.0.1:8000/api/v1/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: login,
            password: password
        })
    }).then(response => {
        return response.json();
    }).then(data => {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('tokenExpires', data.expires);
    });
}