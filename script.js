// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      section.style.opacity = 1;
      section.style.transform = "translateY(0)";
    }
  });
});

// Contact form
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("Message sent successfully 🚀");
  e.target.reset();
});
