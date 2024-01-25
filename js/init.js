$(document).ready(function() {

    console.log("customer id : ", localStorage.getItem('customerId'));

    console.log('Document ready in init');

    navigateTo('home');

    $("#food").css('display', 'block');
    $("#contact").css('display', 'block');

    $('.nav-link').click(function() {
        var sectionId = $(this).data('section-id');
        navigateTo(sectionId);
    });

    $("#food-form, #customer-form, #order-form, #my-orders-table-div").css('display', 'none');

});

function navigateTo(sectionId) {
    // Hide all sections
    $('.content-section').css('display', 'none');

    var selectedSection = $('#' + sectionId);
    selectedSection.css('display', 'block');

    if(sectionId === 'home') {
        $('#food').css('display', 'block');
    }
}


