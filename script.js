// Scroll to section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

// Contact form submission
document.getElementById("contact-form").addEventListener("submit", function(e){
    e.preventDefault();
    alert("Message sent successfully!");
    this.reset();
});
