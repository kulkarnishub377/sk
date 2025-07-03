// Add your custom JavaScript here

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animate skill bars on scroll
const skillsSection = document.querySelector('#skills');
const progressBars = document.querySelectorAll('.progress-bar');

const animateSkills = () => {
    let sectionTop = skillsSection.getBoundingClientRect().top;
    let windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100) {
        progressBars.forEach(bar => {
            const value = bar.getAttribute('data-progress') + '%';
            bar.style.width = value;
            bar.style.opacity = 1;
        });
        // Remove listener after animation to prevent re-triggering
        window.removeEventListener('scroll', animateSkills);
    }
};

// Set initial state for bars
progressBars.forEach(bar => {
    bar.style.width = '0';
    bar.style.opacity = 0;
    bar.style.transition = 'width 1.5s ease-in-out, opacity 1.5s ease-in-out';
});

window.addEventListener('scroll', animateSkills);
// Also run on load in case the section is already visible
animateSkills();

// Certification Filter Logic
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certItems = document.querySelectorAll('.cert-item');

    if (filterButtons.length > 0 && certItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Set active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                // Show/hide cert items
                certItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                });
            });
        });
    }
});
