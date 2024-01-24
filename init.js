$(document).ready(function() {
    console.log('Document ready in init');

    navigateTo('home');

    $("#food").css('display', 'block');
    $("#contact").css('display', 'block');

    $('.nav-link').click(function() {
        var sectionId = $(this).data('section-id');
        navigateTo(sectionId);
    });

    $("#food-form, #customer-form").css('display', 'block');

});

function navigateTo(sectionId) {
    // Hide all sections
    $('.content-section').css('display', 'none');

    var selectedSection = $('#' + sectionId);
    selectedSection.css('display', 'block');
}


