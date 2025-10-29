function toggleFAQ(btn){
    const item = btn.parentElement;
    item.classList.toggle('open');
}
(function(){
    const aboutBtn = document.getElementById('tabAbout');
    const faqBtn = document.getElementById('tabFaq');
    const aboutPanel = document.getElementById('aboutPanel');
    const faqPanel = document.getElementById('faqPanel');
    function activate(which){
        if(which === 'about'){
            aboutBtn.classList.add('active'); faqBtn.classList.remove('active');
            aboutPanel.classList.remove('hidden'); aboutPanel.classList.add('visible');
            faqPanel.classList.remove('visible'); faqPanel.classList.add('hidden');
        } else {
            faqBtn.classList.add('active'); aboutBtn.classList.remove('active');
            faqPanel.classList.remove('hidden'); faqPanel.classList.add('visible');
            aboutPanel.classList.remove('visible'); aboutPanel.classList.add('hidden');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    aboutBtn.addEventListener('click', ()=>activate('about'));
    faqBtn.addEventListener('click', ()=>activate('faq'));
})();
