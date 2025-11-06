// UI helpers: smooth scroll, back-to-top and newsletter subscribe
document.addEventListener('click', function(e){
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) {
        e.preventDefault();
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
    }
});

const backBtn = document.getElementById('backToTop');
if (backBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backBtn.style.display = 'flex';
        else backBtn.style.display = 'none';
    });
    backBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
}

// Simple newsletter interaction (no backend)
const subscribeBtn = document.getElementById('subscribeBtn');
if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
        const emailEl = document.getElementById('newsletterEmail');
        const email = emailEl ? emailEl.value : '';
        if (email && email.includes('@')) {
            alert('Thanks! We\'ll keep you updated — ' + email);
            if (emailEl) emailEl.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });
}
