$(document).ready(function() {
    console.log('Document ready');

    navigateTo('home');

    $("#food").css('display', 'block');
    $("#contact").css('display', 'block');

    $('.nav-link').click(function() {
        var sectionId = $(this).data('section-id');
        navigateTo(sectionId);
    });

    $("#food-form, #customer-form").css('display', 'none');
});

function navigateTo(sectionId) {
    // Hide all sections
    $('.content-section').css('display', 'none');

    var selectedSection = $('#' + sectionId);
    selectedSection.css('display', 'block');
}


///////////////////////////////////////////////// Customer Manage ////////////////////////////////////////////
