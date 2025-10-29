document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitBtn = document.getElementById('submitBtn');
    const githubBtn = document.getElementById('githubSignInBtn');

    // Form submission with loading state
    form.addEventListener('submit', function(e) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
    });

    githubBtn.addEventListener('click', function() {
        window.location.href = '/oauth2/authorization/github';
    });

});
