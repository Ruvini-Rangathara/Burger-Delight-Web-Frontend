$(document).ready(function() {
    console.log('Document ready in login.js');
    clearFields();
});


function clearFields() {
    $("#login-email").val("");
    $("#login-password").val("");
}

function login() {
    var email = $("#login-email").val();
    var password = $("#login-password").val();

    var user = {
        email: email,
        password: password
    };

    console.log('User:', user)

    $.ajax({
        url: 'http://localhost:8080/api/v1/customer/login/' + email + '/' + password,
        type: 'GET',
        contentType: 'application/json',
        success: function(response) {
            if (response.code === '00') {
                if (response.content === true) {
                    // Customer allowed to login
                    console.log('Login successful');
                    window.location.href = 'dashboard.html';
                } else {
                    // Customer not allowed to login
                    console.log('Login failed:', response.message);
                    alert(response.message);
                    clearFields();
                }
            } else {
                clearFields();
                console.log('Error during login:', response.message);
                alert(response.message);
            }
        },
        error: function(error) {
            console.error('Error during login:', error);
        }
    });
}
