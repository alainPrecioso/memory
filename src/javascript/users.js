const handleSignIn = (event) => {
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
    emptySignInFields();
    showSection('login');
    alert('Utilisateur enregistré.');
};

const emptySignInFields = () => {
    document.getElementById('sign-in-username').value = '';
    document.getElementById('sign-in-email').value = '';
    document.getElementById('sign-in-password').value = '';
    document.getElementById('confirm-password').value = '';
};

const emptyLoginFields = () => {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
};

const navDisplay = () => {
    if (isLoggedIn()) {
        document.querySelectorAll('.not-logged').forEach(e => e.style.display = 'none');
        document.querySelectorAll('.logged').forEach(e => e.style.display = 'block');
    } else {
        document.querySelectorAll('.not-logged').forEach(e => e.style.display = 'block');
        document.querySelectorAll('.logged').forEach(e => e.style.display = 'none');
    }
};

const handleLogin = (event) => {
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
    navDisplay();
    emptyLoginFields();
    populateUserBestScores();
    showSection('profile');
};

const handleLogoff = (event) => {
    event.preventDefault();
    document.cookie = 'loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    navDisplay();
    showSection('home');
    alert('Vous êtes maintenant déconnecté');
};

const setLoggedIn = (userEmail) => {
    document.cookie = `loggedInUser=${userEmail}`;
};

const isLoggedIn = () => {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith('loggedInUser='));
};

const getLoggedInUserEmail = () => {
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
};

const getLoggedInUserName = () => {
    const userEmail = getLoggedInUserEmail();
    if (!userEmail) {
        console.error("No logged-in user found.");
        return 'invité';
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.email === userEmail);

    if (user) {
        return user.username;
    } else {
        return null;
    }
};

// Game Scores
const getUserBestScores= (userEmail, gameSize) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === userEmail);
    if (userIndex !== -1 && users[userIndex].gridSize && users[userIndex].gridSize[gameSize]) {
        return users[userIndex].gridSize[gameSize].scores;
    }
    return [];
};

const getGlobalBestScores = () => {
    return JSON.parse(localStorage.getItem('globalScores')) || {};
};

const saveScore = (score, gameSize) => {
    if (isLoggedIn()) saveUserBestScore(score, gameSize);
    saveGlobalBestScore(score, gameSize);
};

const saveUserBestScore = (score, gameSize) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let email = getLoggedInUserEmail();
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
        if (!users[userIndex].gridSize) {
            users[userIndex].gridSize = {};
        }

        if (!users[userIndex].gridSize[gameSize]) {
            users[userIndex].gridSize[gameSize] = { scores: [] };
        }

        let userScores = users[userIndex].gridSize[gameSize].scores;
        userScores.push(score);
        userScores.sort((a, b) => a - b);
        if (userScores.length > 5) {
            userScores = userScores.slice(0, 5);
        }
        users[userIndex].gridSize[gameSize].scores = userScores;

        localStorage.setItem('users', JSON.stringify(users));
        populateUserBestScores()
    }
};

const saveGlobalBestScore = (score, gameSize) => {
    let globalScores = JSON.parse(localStorage.getItem('globalScores')) || {};
    const userName = getLoggedInUserName();

    if (!globalScores[gameSize]) {
        globalScores[gameSize] = [];
    }
    globalScores[gameSize].push({ user: userName, score: score });
    globalScores[gameSize].sort((a, b) => a.score - b.score);
    if (globalScores[gameSize].length > 5) {
        globalScores[gameSize] = globalScores[gameSize].slice(0, 5);
    }

    localStorage.setItem('globalScores', JSON.stringify(globalScores));
    populateGlobalBestScores()
};


const populateUserBestScores = () => {
    const userEmail = getLoggedInUserEmail();

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === userEmail);
    if (userIndex !== -1 && users[userIndex].gridSize) {
        const tableBody = document.querySelector('#user-best-scores tbody');
        tableBody.innerHTML = '';

        let isOdd = true;

        Object.keys(users[userIndex].gridSize).forEach(gameSize => {
            const bestScores = getUserBestScores(userEmail, gameSize);
            bestScores.forEach((score, index) => {
                const row = document.createElement('tr');
                row.classList.add(isOdd ? 'game-size-odd' : 'game-size-even');
                if (index === 0) {
                    const cellSize = document.createElement('td');
                    cellSize.textContent = gameSize;
                    row.appendChild(cellSize);
                } else {
                    const cellSize = document.createElement('td');
                    row.appendChild(cellSize);
                }
                const cellScore = document.createElement('td');
                cellScore.textContent = score;
                row.appendChild(cellScore);
                tableBody.appendChild(row);
            });
            isOdd = !isOdd;
        });
    }
};

const populateGlobalBestScores = () => {
    const tableBody = document.querySelector('#best-scores tbody');
    tableBody.innerHTML = '';

    const globalScores = getGlobalBestScores();
    let isOdd = true;

    Object.keys(globalScores).forEach(gameSize => {
        globalScores[gameSize].forEach((entry, index) => {
            const row = document.createElement('tr');
            row.classList.add(isOdd ? 'game-size-odd' : 'game-size-even');
            if (index === 0) {
                const cellSize = document.createElement('td');
                cellSize.textContent = gameSize;
                row.appendChild(cellSize);
            } else {
                const cellSize = document.createElement('td');
                row.appendChild(cellSize);
            }

            const cellScore = document.createElement('td');
            cellScore.textContent = String(entry.score);
            row.appendChild(cellScore);

            const cellUser = document.createElement('td');
            cellUser.textContent = entry.user;
            row.appendChild(cellUser);

            tableBody.appendChild(row);
        });

        isOdd = !isOdd;
    });
};

document.getElementById('sign-in-form').addEventListener('submit', handleSignIn);
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('logoff').addEventListener('click', handleLogoff);
document.getElementById('best-score-button').addEventListener('click', populateUserBestScores);
document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        populateUserBestScores();
    }
    navDisplay();
    populateGlobalBestScores();
});