export async function checkAdmin() {
    const token = localStorage.getItem('access_token') || 'undefined';

    if (token === 'undefined') {
        return false;
    }

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    };
    
    const response = await fetch('http://127.0.0.1:8000/api/v1/order-admin/', requestOptions);

    return response.status === 200;
}

