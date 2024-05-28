// Signin
document.getElementById('sign-in-form').addEventListener('submit', handleSignIn);

function handleSignIn(event) {
    event.preventDefault();

    const email = document.getElementById('sign-in-email').value;
    const username = document.getElementById('sign-in-username').value;
    const password = document.getElementById('sign-in-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExistsByEmail = users.some(user => user.email === email);
    const userExistsByUsername = users.some(user => user.username === username);

    if (userExistsByEmail && userExistsByUsername) {
        alert('Un utilisateur avec ce nom et cette adresse existe déjà.');
        return;
    } else if (userExistsByEmail) {
        alert('Un utilisateur avec cette adresse existe déjà.');
        return;
    } else  if (userExistsByUsername) {
        alert('Un utilisateur avec ce nom existe déjà.');
        return;
    }

    users.push({ email, username, password });

    localStorage.setItem('users', JSON.stringify(users));

    alert('Utilisateur enregistré.');
}


// Login
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('logoff').addEventListener('click', handleLogoff);

document.getElementById('best-score-button').addEventListener('click', setBestScore);

document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        // TODO add real handling and remove
        alert('Bienvenu. Vous êtes déjà Connecté');
    }
});

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);

    if (user) {
        setLoggedIn(user.email);
        alert('Vous êtes connecté');
    } else {
        alert('Utilisateur non trouvé, vérifiez votre adresse et votre mot de passe et essayez encore');
    }
}

function handleLogoff(event) {
    event.preventDefault();
    document.cookie = 'loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    alert('Vous êtes maintenant déconnecté');
}

function setLoggedIn(userEmail) {
    document.cookie = `loggedInUser=${userEmail}`;
}

function isLoggedIn() {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith('loggedInUser='));
}

function getLoggedInUserEmail() {
    const name = 'loggedInUser=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

//TODO arrays of scores by grid sizes
function saveBestScore(userEmail, score) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === userEmail);
    if (userIndex !== -1) {
        if (users[userIndex].score === undefined || users[userIndex].score < score) {
            users[userIndex].score = score;
        }
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function getBestScore(userEmail) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === userEmail);
    if (user) {
        return user.score;
    } else {
        return null;
    }
}

function setBestScore() {
    document.getElementById('bestScore').innerText = getBestScore(getLoggedInUserEmail());
}