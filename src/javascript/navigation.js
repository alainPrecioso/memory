const navLinks = document.querySelectorAll('nav ul li a'); // Sélectionne tous les liens dans la barre de navigation

// Crée les écouteurs d'événements sur les éléments de la barre de navigation pour afficher les sections correspondantes
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        resetGame();
        showSection(link.getAttribute('data-section'));
    });
});

// Cache toutes les sections et affiche celle demandée
function showSection(sectionId) {
    sections.forEach(section => {
        section.style.display = 'none';
    });
    const body = document.body;
    sectionId === 'home' ? body.style.height = '115vh' : body.style.height = '100%';
    document.getElementById(sectionId).style.display = 'flex';
}