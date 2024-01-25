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

    getAllBurger();
    getAllBeverages();
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

// ======================================= get All burger =======================================

function createDynamicFoodCard(foodData) {
    var category = foodData.category;

    const colDiv = document.createElement("div");
    colDiv.className = "col-md-3 mb-4"; // Adjust the width based on the number of cards you want in a row


    const cardDiv = document.createElement("div");
    cardDiv.className = "custom-card"; // Apply your custom card styles
    cardDiv.style.width = "350px";
    cardDiv.style.height = "555px";
    cardDiv.style.backgroundColor = "#171717";
    cardDiv.style.color = "white";
    cardDiv.style.borderRadius= "10px";


    const imgElement = document.createElement("img");
    imgElement.className = "card-img"; // Apply your custom card image styles

    if(category === "Burger"){
        imgElement.src = "asset/image/burger2.png";
    }else if(category === "Beverage"){
        imgElement.src = "asset/image/beverage.png";
    }
    imgElement.alt = "Food Image";
    imgElement.style.width = "350px";
    imgElement.style.height = "320px";
    imgElement.style.borderRadius= "10px";

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";
    cardBodyDiv.style.padding = "10px 20px";

    const titleElement = document.createElement("h5");
    titleElement.className = "card-title";
    titleElement.textContent = foodData.name;
    titleElement.style.marginBottom="3px";
    titleElement.style.fontSize="20px";

    const descriptionElement = document.createElement("p");
    descriptionElement.className = "card-text";
    descriptionElement.textContent = foodData.description;
    descriptionElement.style.fontSize="18px";

    const priceElement = document.createElement("p");
    priceElement.className = "card-text";
    priceElement.textContent = `Price: ${foodData.price}`;

    const addToCartButton = document.createElement("button");
    addToCartButton.className = "btn-card";
    addToCartButton.type = "button";
    addToCartButton.textContent = "Add To Cart";
    //add onclick event to this button to add food to cart
    addToCartButton.addEventListener("click", function () {
        addToCart(foodData.id); // Pass foodId to addToCart function
    });


    // Add event listener for Add to Cart button
    addToCartButton.addEventListener("click", function () {
        // Add logic for adding the food to the cart
        // You can call a function or perform any action here
        alert("Added to Cart: " + foodData.name);
    });

    cardBodyDiv.appendChild(titleElement);
    cardBodyDiv.appendChild(descriptionElement);
    cardBodyDiv.appendChild(priceElement);
    cardBodyDiv.appendChild(addToCartButton);

    cardDiv.appendChild(imgElement);
    cardDiv.appendChild(cardBodyDiv);
    colDiv.appendChild(cardDiv);

    return colDiv;
}


function getAllBurger() {

    var category = "Burger";

    $.ajax({
        url: 'http://localhost:8080/api/v1/food/getByCategory/' + category,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.code === '00') {
                var foodList = response.content;

                // Check if foodList is an array
                if (Array.isArray(foodList)) {
                    // Clear existing content in the food container
                    $('#food-container').empty();

                    // Iterate through the food list and create cards
                    foodList.forEach(function(food) {
                        // Call the setFoodCards function to create and append the card
                        setBurgerCards(food);
                    });
                } else {
                    console.error('Invalid format for foodList:', foodList);
                }
            } else {
                // Show error message
                alert(response.message);
            }
        },
        error: function (error) {
            console.error('Error getting food:', error);
        }
    });
}


// Function to set food cards
function setBurgerCards(data) {
    // Append the dynamicFoodCard to your container element
    const container = document.getElementById("burger-container");
    container.appendChild(createDynamicFoodCard(data));
}


// ============================================ get All beverages ==================================
function getAllBeverages() {

    var category = "Beverage";

    $.ajax({
        url: 'http://localhost:8080/api/v1/food/getByCategory/' + category,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.code === '00') {
                var foodList = response.content;

                // Check if foodList is an array
                if (Array.isArray(foodList)) {
                    // Clear existing content in the food container
                    $('#food-container').empty();

                    // Iterate through the food list and create cards
                    foodList.forEach(function(food) {
                        setBeverageCards(food);
                    });
                } else {
                    console.error('Invalid format for foodList:', foodList);
                }
            } else {
                // Show error message
                alert(response.message);
            }
        },
        error: function (error) {
            console.error('Error getting food:', error);
        }
    });
}

function setBeverageCards(data) {
    // Append the dynamicFoodCard to your container element
    const container = document.getElementById("beverage-container");
    container.appendChild(createDynamicFoodCard(data));
}

function showFoodForm() {
    $('#food-form').show();
}

function closeFoodForm() {
    $('#food-form').hide();
}


function addToCart(foodId) {
    console.log('Add to cart food ID:', foodId)

    // Fetch additional details like price and food name using AJAX
    $.ajax({
        url: 'http://localhost:8080/api/v1/food/get/' + foodId,
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            if (response.code === '00') {
                var data = {
                    foodId: foodId,
                    foodPrice: response.content.price,
                    foodName: response.content.name,
                    quantity: 1
                };

                addToCartTable(data);
            } else {
                console.log('Error adding food:', response.message);
                alert(response.message);
            }
        },
        error: function (error) {
            console.error('Error adding food:', error);
        }
    });
}

