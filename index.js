window.onload = function() {
    var form1 = document.getElementById("burger-form");
    var form2 = document.getElementById("beverage-form");

    if (form1 && form2) {
        form1.style.display = "none";
        form2.style.display = "none";
    }
};

function navigateTo(sectionId) {
    // Hide all sections
    hideAllSections();

    var selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        // Show the selected section
        selectedSection.style.display = 'block';

        // Show/hide forms based on the section
        if (sectionId === 'food') {
            var burgerForm = document.getElementById("burger-form");
            var beverageForm = document.getElementById("beverage-form");

            if (burgerForm && beverageForm) {
                burgerForm.style.display = "block";
                beverageForm.style.display = "block";
            }
        } else {
            if (burgerForm && beverageForm) {
                burgerForm.style.display = "none";
                beverageForm.style.display = "none";
            }
        }

    }



}

// Hide all sections
function hideAllSections() {
    var sections = document.getElementsByClassName('content-section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }
}

// Initial load of the first section
navigateTo('home');
