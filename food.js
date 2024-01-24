$(document).ready(function () {
    console.log('Document ready in food.js');

    // Add event listener for Enter key press in the search input field
    $('#search-burger-id').on('keydown', function (event) {
        if (event.key === 'Enter') {
            // Perform food search based on the entered ID
            var foodId = $(this).val();
            searchFood(foodId);
        }
    })

    getNewFoodId();
});

/////////////////////////////////////////////// Food Manage ////////////////////////////////////////////
function getNewFoodId() {
    // Make an AJAX request to the backend to get a new food ID
    $.ajax({
        url: 'http://localhost:8080/api/v1/food/getNewId', // Endpoint URL from your backend
        type: 'GET', dataType: 'json', success: function (response) {
            // Assuming the response contains a property 'content'
            var newFoodId = response.content;

            console.log('New food ID:', newFoodId)
            // Set the new food ID in the food-id-label
            $('#food-id-label').text(' ' + newFoodId);
        }, error: function (error) {
            console.error('Error getting new food ID:', error);
        }
    });
}


// ================================== search food ==================================
function searchFood(foodId) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/food/get/' + foodId,
        type: 'GET',
        dataType: 'json',
        success: function (response) {

            if (response.code === '00') {
                var foodDTO = response.content;
                console.log('Food retrieved successfully:', foodDTO);
                //set food details in the form
                $('#food-id-label').val(foodId.id);
                $('#food-name').val(foodDTO.name);
                $('#food-desc').val(foodDTO.description);
                $('#food-price').val(foodDTO.price);

                console.log("food price : ",foodDTO.price);

                //set button to update
                $("#food-save-button").text("Update");
            } else {
                //show error message
                alert(response.message);
                //set button to save
                $("#food-save-button").text("Save");
            }
        },
        error: function (error) {
            console.error('Error getting food:', error);
        }
    });
}


// ================================== save food ==================================
function SaveFoodOnClick(){
    var foodId = $('#food-id-label').val();
    var foodName = $('#food-name').val();
    var foodDesc = $('#food-desc').val();
    var foodPrice = $('#food-price').val();

    if (foodId === "" || foodName === "" || foodDesc === "" || foodPrice === "") {
        alert("Please fill all the fields");
    } else {
        var foodDTO = {
            id: foodId,
            name: foodName,
            description: foodDesc,
            price: foodPrice
        };

        //check if food id is empty with get request like customer.js
        $.ajax({
            url: 'http://localhost:8080/api/v1/food/get/' + foodId,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.code === '00') {
                    console.log('Food update');
                    updateFood(foodDTO);
                } else {
                    console.log('save customer');
                    saveFood(foodDTO);
                }
            },
            error: function (error) {
                console.error('Error getting food:', error);
            }
        });
    }

}

function saveFood(foodDTO) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/food/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(foodDTO),
        success: function (response) {
            if (response.code === '00') {
                console.log('Food saved successfully:', response.content);
                alert("Food saved successfully");
                //get new food id
                getNewFoodId();
                //reset form
                resetFoodForm();
            } else {
                console.log('Error saving food:', response.message);
                alert(response.message);
            }
        },
        error: function (error) {
            console.error('Error saving food:', error);
        }
    });
}

function updateFood(foodDTO) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/food/update',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(foodDTO),
        success: function (response) {
            if (response.code === '00') {
                console.log('Food updated successfully:', response.content);
                alert("Food updated successfully");
                //reset form
                resetFoodForm();
            } else {
                console.log('Error updating food:', response.message);
                alert(response.message);
            }
        },
        error: function (error) {
            console.error('Error updating food:', error);
        }
    });
}

function resetFoodForm() {
    $('#food-id-label').val('');
    $('#food-name').val('');
    $('#food-desc').val('');
    $('#food-price').val('');
    $("#food-save-button").text("Save");
}

// ================================== delete food ==================================

function deleteFood() {
    var foodId = $('#food-id-label').val();
    if (foodId === "") {
        alert("Please enter food id");
    } else {
        var confirmation = confirm('Are you sure you want to delete this food?');
        if (confirmation) {
            $.ajax({
                url: 'http://localhost:8080/api/v1/food/delete/' + foodId,
                type: 'DELETE',
                success: function (response) {
                    if (response.code === '00') {
                        console.log('Food deleted successfully:', response.content);
                        alert("Food deleted successfully");
                        //get new food id
                        getNewFoodId();
                        //reset form
                        resetFoodForm();
                    } else {
                        console.log('Error deleting food:', response.message);
                        alert(response.message);
                    }
                },
                error: function (error) {
                    console.error('Error deleting food:', error);
                }
            });
        }
    }
}

// ================================== new food ==================================
function newFood() {
    resetFoodForm();
    getNewFoodId();
}