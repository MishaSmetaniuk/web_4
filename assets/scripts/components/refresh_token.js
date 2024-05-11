async function getNewToken() {
    let refresh_token = localStorage.getItem('refresh_token') || 'undefined';
    if (refresh_token === 'undefined') {
        localStorage.setItem('access_token', 'undefined');
        localStorage.setItem('refresh_token', 'undefined');
        localStorage.setItem('tokenExpires', 'undefined');
        window.location.href = 'login.html';
    }

    let data = {
        refresh: refresh_token
    }

    fetch('http://127.0.0.1:8000/api/v1/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'same-origin'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('tokenExpires', Date.now() + 300000);
    }).catch(err => {
        console.log(err);
    });

    console.log('new token provided');
    return localStorage.getItem('access_token');
}

export { getNewToken };