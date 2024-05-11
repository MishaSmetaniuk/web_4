let access_token = localStorage.getItem('access_token') || 'undefined';
let refresh_token = localStorage.getItem('refresh_token') || 'undefined';

if (access_token !== 'undefined' || refresh_token !== 'undefined') {
    window.location.href = 'panel.html';
}

$(document).ready(function() {
    $('#register__form').submit(function(e) {
        e.preventDefault();

        let username = $('#username').val();
        let password = $('#password').val();

        let data = {
            username: username,
            password: password,
        }
        
        fetch('http://127.0.0.1:8000/api/v1/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            window.location.href = 'login.html';
        }).catch(err => {
            let error_handler = document.getElementById('error_handler');

            error_handler.innerHTML = (err.message === 'Failed to fetch' ? 'Server is not available' : 'This username is already taken');
        });
    });
});
