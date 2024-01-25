$(document).ready(function() {
    console.log('Document ready in signup.js');

    clearFieldsOfSignup();
});

function clearFieldsOfSignup() {
    $("#register_name").val("");
    $("#register_address").val("");
    $("#register_email").val("");
    $("#register_password").val("");
    $("#register_phone").val("");
}

function register() {
    var name = $("#register_name").val();
    var address = $("#register_address").val();
    var email = $("#register_email").val();
    var password = $("#register_password").val();
    var phone = $("#register_phone").val();

    var customer = {
        name: name,
        address: address,
        email: email,
        password: password,
        phone: phone
    };

    $.ajax({
        url: 'http://localhost:8080/api/v1/customer/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(customer),
        success: function(response) {
            if (response.code === '00') {
                console.log('Customer registered successfully:', response.content);
                alert(response.message);
                window.location.href = 'index.html';
            } else {
                console.log('Error during registration:', response.message);
                alert(response.message);
            }
        },
        error: function(error) {
            console.error('Error during registration:', error);
        }
    });
}