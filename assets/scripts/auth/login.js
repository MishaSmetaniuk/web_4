let access_token = localStorage.getItem('access_token') || 'undefined';
let refresh_token = localStorage.getItem('refresh_token') || 'undefined';

if (access_token !== 'undefined' || refresh_token !== 'undefined') {
    window.location.href = 'panel.html';
}

$(document).ready(function() {
    $('#login__form').submit(function(e) {
        e.preventDefault();

        let username = $('#username').val();
        let password = $('#password').val();

        let data = {
            username: username,
            password: password
        }
        console.log(data);
        fetch('http://127.0.0.1:8000/api/v1/token/', {
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
            console.log(data);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('tokenExpires', Date.now() + 15000);

            window.location.href = 'index.html';
        }).catch(err => {
            let error_handler = document.getElementById('error_handler');
           
            error_handler.innerHTML = (err.message === 'Failed to fetch' ? 'Server is not available' : 'Invalid username or password');
        });
    });

    access_token = localStorage.getItem('access_token');
    refresh_token = localStorage.getItem('refresh_token');
});


