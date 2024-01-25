$(document).ready(function () {
    console.log('Document ready in order.js');

    // Add event listener for Enter key press in the search input field
    $('#search-order-id').on('keydown', function (event) {
        if (event.key === 'Enter') {
            // Perform customer search based on the entered ID
            var orderId = $(this).val();
            searchOrder(orderId);
        }
    })

    getMyOrders()
    getNewOrderId();
    loadPendingOrdersToCartTable();

    //set customer id
    $('#order-customer-id').val(localStorage.getItem('customerId'));

    //set date in order form
    var today = new Date();
    $('#order-date').val(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate());

});

/////////////////////////////////////////////// Order Manage ////////////////////////////////////////////

function getNewOrderId() {
    // Make an AJAX request to the backend to get a new order ID
    $.ajax({
        url: 'http://localhost:8080/api/v1/order/getNewId', // Endpoint URL from your backend
        type: 'GET', dataType: 'json', success: function (response) {
            // Assuming the response contains a property 'content'
            var newOrderId = response.content;

            console.log('New order ID:', newOrderId)
            // Set the new order ID in the order-id-label
            $('#order-id-label').text(' ' + newOrderId);
            console.log('New order ID set in the label : ', newOrderId)
        }, error: function (error) {
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
        success: function (response) {
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
        error: function (error) {
            console.error('Error getting order:', error);
        }
    });
}

// ================================================================================================


// ================================== get orders by customer email ==================================
function getMyOrders() {
    console.log("customer id : ", localStorage.getItem('customerId'));
    var id = localStorage.getItem('customerId');


    //get orders by status=Pending and customer id
    $.ajax({
        url: 'http://localhost:8080/api/v1/order/getAllByStatusAndCustomerId/Completed/' + id,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.code === '00') {
                var orders = response.content;

                // Clear existing content in the table body
                var tableBody = $("#my-orders-table tbody");
                tableBody.empty();

                // Iterate through the orders and populate the table
                orders.forEach(function (order) {
                    var row = `<tr>
                        <td>${order.id}</td>
                        <td>${order.customerId}</td>
                        <td>${order.date}</td>
                        <td>${order.total}</td>
                    </tr>`;
                    tableBody.append(row);
                });


            } else {
                console.log('Orders not found:', response.message);
                alert(response.message);
            }
        },
        error: function (error) {
            console.error('Error getting orders:', error);
        }
    });
}

// ================================================================================================

//======================== load pending orders to cart table ==================================
function loadPendingOrdersToCartTable() {
    console.log("loadPendingOrdersToCartTable");
    var id = localStorage.getItem('customerId');

    // Get orders by status=Pending and customer id
    $.ajax({
        url: 'http://localhost:8080/api/v1/order/getAllByStatusAndCustomerId/Pending/' + id,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.code === '00' && response.content) {
                var orders = response.content;

                // Clear existing content in the table body
                var tableBody = $("#order-table tbody");
                tableBody.empty();

                // Iterate through the orders and populate the table
                orders.forEach(function (order) {
                    if (order.list && order.list.length > 0) {
                        order.list.forEach(function (list) {


                            $.ajax({
                                url: 'http://localhost:8080/api/v1/food/get/' + list.foodId,
                                type: 'GET',
                                contentType: 'application/json',
                                success: function (response) {
                                    if (response.code === '00') {
                                        var food = response.content;

                                        var row = `<tr>
                                            <td>${list.foodId}</td>orderDetails
                                            <td>${food.name}</td>
                                            <td>${food.price}</td>
                                            <td style="width: 20%"><input type="number" class="form-control" value="${list.qty}" min="1" onchange="updateQuantity(${list.qty}, this.value)"></td>
                                            <td><button type="button" class="btn btn-danger" onclick="removeFromCartTable(${list.foodId}, this)">Remove</button></td>
                                            </tr>`;
                                        tableBody.append(row);
                                        //set id to label
                                        $('#order-id-label').text(order.id);
                                        //set total
                                        $('#total').val(order.total);
                                    } else {
                                        console.log('Error adding food:', response.message);
                                        alert(response.message);
                                    }
                                },
                                error: function (error) {
                                    console.error('Error adding food:', error);
                                }
                            });


                        });
                    }
                });

                calculateTotal();
            } else {
                console.log('Orders not found or in unexpected format:', response.message);
                alert('Error loading orders: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error getting orders:', status, error);
            alert('Error getting orders. Please try again.');
        }
    });
}


// ============================================= addToCartTable Function ======================================
function addToCartTable(data) {
    console.log("add to cart table function : ", data);

    var foodId = data.foodId;
    var foodName = data.foodName;
    var foodPrice = data.foodPrice;
    var foodQty = data.quantity;

    var row = `<tr>
                <td>${foodId}</td>
                <td>${foodName}</td>
                <td>${foodPrice}</td>
                <td style="width: 20%"><input type="number" class="form-control" value="${foodQty}" min="1" onchange="updateQuantity(${foodId}, this.value)"></td>
                <td><button type="button" class="btn btn-danger" onclick="removeFromCartTable(${foodId}, this)">Remove</button></td>
            </tr>`;

    $('#order-table tbody').append(row);
    calculateTotal();
}


function updateQuantity(foodId, newQuantity) {
    // Add logic to update the quantity in your data structure or perform any other necessary actions
    console.log(`Updated quantity for food ID ${foodId} to ${newQuantity}`);
    calculateTotal(); // Update total after changing quantity
}

// ==================================================================================================

function removeFromCartTable(foodId, button) {
    // Get the index of the row containing the button
    var rowIndex = button.parentNode.parentNode.rowIndex;

    // Remove the row from the table
    document.getElementById("order-table").deleteRow(rowIndex);
    calculateTotal();
}

// ================================================================================================


// ================================== calculate total ==================================
function calculateTotal() {
    var table = document.getElementById("order-table");
    var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    var total = 0;

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");

        // Extract text content from cells and convert to numbers
        var price = parseFloat(cells[2].textContent.trim()) || 0; // Use default value if conversion fails

        // Get the actual input element from the fourth cell and retrieve its value
        var qtyInput = cells[3].getElementsByTagName("input")[0];
        var qty = parseInt(qtyInput.value) || 0; // Use default value if conversion fails
        console.log("qty : ", qty);

        total += price * qty;
    }

    // Update the total in your HTML or wherever you want to display it
    console.log("Total: ", total);
    $('#total').val(total);
}

// ================================================================================================


// ======================================= save cart =============================================
function saveCart() {
    var table = document.getElementById("order-table");
    var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    var orderDetails = [];

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");

        // Ensure that the cells have the expected structure
        if (cells.length >= 4) {
            var foodId = cells[0].textContent.trim();
            var qtyInput = cells[3].getElementsByTagName("input")[0];

            var foodQty = parseInt(qtyInput.value) || 0;

            console.log("foodId : ", foodId)
            console.log("foodQty : ", foodQty);

            var orderDetail = {
                foodId: foodId, qty: foodQty
            };
            orderDetails.push(orderDetail);
        } else {
            console.warn("Unexpected cell structure in row:", cells);
        }
    }

    // Log the extracted order details for debugging
    console.log("Order Details:", orderDetails);

    var order = {
        customerId: parseInt($('#order-customer-id').val()), // Ensure customerId is an integer
        total: parseFloat($('#total').val()),
        status: 'Pending',
        list: orderDetails
    };

    // Add the 'id' and 'date' fields only if they are present and valid
    var orderId = $('#order-id-label').text().trim();
    if (orderId !== '') {
        order.id = parseInt(orderId);
    }

    var orderDate = $('#order-date').val();
    if (orderDate !== '') {
        order.date = orderDate;
    }

    console.log("order : ", order);

    $.ajax({
        url: 'http://localhost:8080/api/v1/order/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(order),
        success: function (response) {
            if (response.code === '00') {
                console.log('Order saved successfully:', response.content);
                alert('Order saved successfully');
                getNewOrderId();
                clearOrderForm();
                getMyOrders();
                loadPendingOrdersToCartTable();
            } else if (response.code === '03') {
                console.log('Order updated successfully:', response.content);
                alert('Order updated successfully');
                getNewOrderId();
                clearOrderForm();
                getMyOrders();
                loadPendingOrdersToCartTable();
            } else {
                console.log('Failed to save order:', response.message);
                alert('Failed to save order');
            }
        },
        error: function (error) {
            console.error('Error saving order:', error);
        }
    });
}


// ================================================================================================

function clearOrderForm() {
    $('#order-table tbody').empty();
    $('#total').val(0);
}
// ================================================================================================

// ========================================= placeOrder ===========================================
function placeOrder() {
    var table = document.getElementById("order-table");
    var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    var list = [];

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");

        // Ensure that the cells have the expected structure
        if (cells.length >= 4) {
            var foodId = cells[0].textContent.trim();
            var qtyInput = cells[3].getElementsByTagName("input")[0];

            var foodQty = parseInt(qtyInput.value) || 0;

            var orderDetail = {
                foodId: foodId, qty: foodQty
            };
            list.push(orderDetail);
        } else {
            console.warn("Unexpected cell structure in row:", cells);
        }
    }
    console.log("Order Details:", list);

    var order = {
        id: parseInt($('#order-id-label').text().trim()),
        customerId: parseInt($('#order-customer-id').val()),
        total: parseFloat($('#total').val()),
        status: 'Completed',
        list: list
    };

    var orderDate = $('#order-date').val();
    if (orderDate !== '') {
        // Directly use the formatted date string
        order.date = orderDate;
    }

    console.log("order id  : ", order.id);
    console.log("order list : ", order.list);
    console.log("order : ", JSON.stringify(order));

    $.ajax({
        url: 'http://localhost:8080/api/v1/order/update',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(order),
        success: function (response) {
            if (response.code === '00') {
                alert('Your Order Has Placed!');
                getNewOrderId();
                clearOrderForm();
                getMyOrders();
                loadPendingOrdersToCartTable();
                sendMail(order);
            } else if (response.code === '03') {
                alert('Order not found');
            } else {
                alert('Failed to update order');
            }
        },
        error: function (error) {
            console.error('Error updating order:', error);
        }
    });
}

function sendMail(order) {

    // var to = localStorage.getItem('customerEmail');
    var to = "ruvinisubhasinghe200009@gmail.com";
    var subject = 'Order Confirmation';

    //give all details about order in body
    var body = 'Your order has been placed successfully. \n\n' +
        'Order ID: ' + order.id + '\n' +
        'Date: ' + order.date + '\n' +
        'Total: ' + order.total + '\n\n' +
        'Thank you for ordering from us.';
    var mail = {
        to: to,
        subject: subject,
        body: body
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/mail/send',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(mail),
        success: function (response) {
            console.log('Response:', response)
            if (response === '00') {
                console.log('Mail sent successfully:', response.content);
            } else {
                console.log('Failed to send mail:', response.message);
            }
        },
        error: function (error) {
            console.error('Error sending mail:', error);
        }
    });
}
