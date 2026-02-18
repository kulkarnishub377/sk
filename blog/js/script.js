// Blog Specific Functionality

document.addEventListener('DOMContentLoaded', () => {
    initBlogAnimations();
    initSearch();
});

function initBlogAnimations() {
    // Add fade-in up animation to cards staggeredly
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index); // Stagger by 100ms
    });
}

function initSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const posts = document.querySelectorAll('.blog-post-item');

        posts.forEach(post => {
            const title = post.querySelector('.blog-title').textContent.toLowerCase();
            const category = post.querySelector('.blog-category').textContent.toLowerCase();
            
            if (title.includes(term) || category.includes(term)) {
                post.style.display = 'block';
                setTimeout(() => {
                    post.style.opacity = '1';
                    post.style.transform = 'scale(1)';
                }, 50);
            } else {
                post.style.opacity = '0';
                post.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    post.style.display = 'none';
                }, 300);
            }
        });
    });
}
