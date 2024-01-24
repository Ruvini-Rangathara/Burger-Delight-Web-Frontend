$(document).ready(function() {
    console.log('Document ready in order.js');

    // Add event listener for Enter key press in the search input field
    $('#search-order-id').on('keydown', function(event) {
        if (event.key === 'Enter') {
            // Perform customer search based on the entered ID
            var orderId = $(this).val();
            searchOrder(orderId);
        }
    })

    getNewOrderId();
});

/////////////////////////////////////////////// Order Manage ////////////////////////////////////////////

function getNewOrderId() {
    // Make an AJAX request to the backend to get a new order ID
    $.ajax({
        url: 'http://localhost:8080/api/v1/order/getNewId', // Endpoint URL from your backend
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            // Assuming the response contains a property 'content'
            var newOrderId = response.content;

            console.log('New order ID:', newOrderId)
            // Set the new order ID in the order-id-label
            $('#order-id-label').text(' ' + newOrderId);
        },
        error: function(error) {
            console.error('Error getting new order ID:', error);
        }
    });
}


// ================================== search order ==================================
function searchOrder(orderId) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/order/get/' + orderId,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.code === '00') {
                var orderDTO = response.content;
                console.log('Order retrieved successfully:', orderDTO);
                //set order details in the form
                $('#order-id-label').val(orderDTO.id);
                $('#order-date').val(orderDTO.date);
                $('#order-customer-id').val(orderDTO.customerId);
                $('#order-total').val(orderDTO.total);

            } else {
                console.log('Order not found:', response.message);
                alert(response.message);
            }
        },
        error: function(error) {
            console.error('Error getting order:', error);
        }
    });
}

// ================================== save order ==================================
$('#order-save-button').click(function() {
    var orderId = $('#order-id-label').val();
    var orderDate = $('#order-date').val();
    var orderCustomerId = $('#order-customer-id').val();
    var orderTotal = $('#order-total').val();

    //get food details from table and set them into an array
    var orderDetails = [];
    var table = document.getElementById("order-details-table");
    var rowLength = table.rows.length;
    for (i = 1; i < rowLength; i++) {
        var row = table.rows[i];
        var cells = row.cells;
        var foodId = cells[1].innerHTML;
        var qty = cells[3].innerHTML;

        var orderDetailDTO = {
            foodId: foodId,
            qty: qty
        }
        orderDetails.push(orderDetailDTO);
    }

    var orderDTO = {
        id: orderId,
        date: orderDate,
        customerId: orderCustomerId,
        list: orderDetails,
        total: orderTotal
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/order/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(orderDTO),
        success: function(response) {
            if (response.code === '00') {
                console.log('Order saved successfully:', response.content);
                alert('Order saved successfully');
            } else {
                console.log('Failed to save order:', response.message);
                alert('Failed to save order');
            }
        },
        error: function(error) {
            console.error('Error saving order:', error);
        }
    });
});


// ================================== delete food from table ==================================
