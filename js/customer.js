$(document).ready(function() {
    console.log('Document ready in customer.js');

    // Add event listener for Enter key press in the search input field
    $('#search-customer-id').on('keydown', function(event) {
        if (event.key === 'Enter') {
            // Perform customer search based on the entered ID
            var customerId = $(this).val();
            searchCustomer(customerId);
        }
    })

    getNewCustomerId();
});

///////////////////////////////////////////////// Customer Manage ////////////////////////////////////////////
function getNewCustomerId() {
    // Make an AJAX request to the backend to get a new customer ID
    $.ajax({
        url: 'http://localhost:8080/api/v1/customer/getNewId', // Endpoint URL from your backend
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            // Assuming the response contains a property 'content'
            var newCustomerId = response.content;

            console.log('New customer ID:', newCustomerId)
            // Set the new customer ID in the customer-id-label
            $('#customer-id-label').text(' ' + newCustomerId);
        },
        error: function(error) {
            console.error('Error getting new customer ID:', error);
        }
    });
}


// ================================== search customer ==================================
function searchCustomer(customerId) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/customer/get/' + customerId,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.code === '00') {
                var customerDTO = response.content;
                console.log('Customer retrieved successfully:', customerDTO);
                //set customer details in the form
                $('#customer-id-label').val(customerDTO.id);
                $('#customer-name').val(customerDTO.name);
                $('#address').val(customerDTO.address);
                $('#customer-email').val(customerDTO.email);
                $('#customer-contact').val(customerDTO.phone);
                $('#customer-password').val(customerDTO.password);

                //set button to update
                $("#customer-save-button").text("Update");

            } else {
                console.log('Customer not found:', response.message);

                alert('Customer not found');
                $("#customer-save-button").text("Register");
            }
        },
        error: function(error) {
            console.error('Error searching customer:', error);
        }
    });
}

// ================================== save/update customer ==================================
function RegisterCustomerOnClick() {

    let cus_id = $('#customer-id-label').val()

    // Get the form data
    var customerDTO = {
        id: cus_id,
        name: $('#customer-name').val(),
        address: $('#address').val(),
        email: $('#customer-email').val(),
        phone: $('#customer-contact').val(),
        password: $('#customer-password').val()
    };

    console.log('Customer DTO:', customerDTO);

    $.ajax({
        url: 'http://localhost:8080/api/v1/customer/get/' + cus_id,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.code === '00') {
                console.log("update customer")
                updateCustomer(customerDTO);
            } else {
                console.log("save customer")
                saveCustomer(customerDTO);
            }
        },
        error: function(error) {
            console.error('Error searching customer:', error);
        }
    });
}

function updateCustomer(customerDTO) {
    // Make the AJAX call
    $.ajax({
        url: 'http://localhost:8080/api/v1/customer/update',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(customerDTO),
        success: function(response) {
            console.log('Response:', response);

            if (response.code === '00') {
                var confirmation1 = confirm('Customer updated successfully');
                if (confirmation1) {
                    setDefaultCustomerDetails();
                }
            } else {
                var confirmation2 = confirm('Failed to update customer!');
                if (confirmation2) {
                    setDefaultCustomerDetails();
                }
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

function saveCustomer(customerDTO) {
    // Make the AJAX call
    $.ajax({
        url: 'http://localhost:8080/api/v1/customer/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(customerDTO),
        success: function(response) {
            console.log('Response:', response);

            if (response.code === '00') {
                var confirmation1 = confirm('Customer saved successfully');
                if (confirmation1) {
                    setDefaultCustomerDetails();
                }
            } else {
                var confirmation2 = confirm('Failed to save customer!');
                if (confirmation2) {
                    setDefaultCustomerDetails();
                }

            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

// ================================== delete customer ==================================
function deleteCustomer() {
    var customerId = $('#customer-id-label').val();

    // Make the AJAX call
    $.ajax({
        url: 'http://localhost:8080/api/v1/customer/delete/' + customerId,
        type: 'DELETE',
        success: function(response) {
            console.log('Response:', response);

            if (response.code === '00') {
                var confirmation1 = confirm('Customer deleted successfully');
                if (confirmation1) {
                    setDefaultCustomerDetails();
                }
            } else {
                var confirmation2 = confirm('Failed to delete the customer!');
                if (confirmation2) {
                    setDefaultCustomerDetails();
                }

            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

// ================================== new customer ==================================
function newCustomer() {
    setDefaultCustomerDetails();
    getNewCustomerId();
}


// ================================== set default customer details ==================================
function setDefaultCustomerDetails() {
    $('#customer-id-label').text(' ');
    $('#customer-name').val('Ex : Ruvini Rangathara');
    $('#address').val('Ex : Panadura');
    $('#customer-email').val('Ex : ruvini925@gmail.com');
    $('#customer-contact').val('Ex : 0781234567');
    $('#customer-password').val('***********');
    $("#customer-save-button").text("Register");
}


function logout() {
    window.location.href = "index.html";
}

