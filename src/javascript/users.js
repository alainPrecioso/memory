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
    populateUserScores();
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

const saveScore = (score, gameSize) => {
    if (isLoggedIn()) saveUserScores(score, gameSize);
    saveGlobalBestScore(score, gameSize);
};

const sortAndTrimScores = (scores, limit = 5) => {
    scores.sort((a, b) => a.score - b.score);
    return scores.slice(0, limit);
};

const sortObjectKeys = (obj) => {
    return Object.keys(obj).sort().reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {});
};

const saveUserScores = (score, gameSize) => {
    saveUserBestScore(score, gameSize);
    saveUserLastScore(score, gameSize);
    populateUserScores();
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
            users[userIndex].gridSize[gameSize] = [];
        }

        users[userIndex].gridSize[gameSize].push({ score, date: new Date().toISOString() });
        users[userIndex].gridSize[gameSize].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date, latest first
        users[userIndex].gridSize[gameSize] = sortAndTrimScores(users[userIndex].gridSize[gameSize]);

        users[userIndex].gridSize = sortObjectKeys(users[userIndex].gridSize);

        localStorage.setItem('users', JSON.stringify(users));
    }
};

const saveUserLastScore = (score, gameSize) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let email = getLoggedInUserEmail();
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
        if (!users[userIndex].lastScores) {
            users[userIndex].lastScores = [];
        }

        users[userIndex].lastScores.push({ score, date: new Date().toISOString(), gameSize }); // Include gameSize when saving
        if (users[userIndex].lastScores.length > 5) {
            users[userIndex].lastScores = users[userIndex].lastScores.slice(-5); // Keep only the last 5 scores
        }

        localStorage.setItem('users', JSON.stringify(users));
    }
};

const saveGlobalBestScore = (score, gameSize) => {
    let globalScores = JSON.parse(localStorage.getItem('globalScores')) || {};
    const userName = getLoggedInUserName();

    if (!globalScores[gameSize]) {
        globalScores[gameSize] = [];
    }

    globalScores[gameSize].push({ user: userName, score, date: new Date().toISOString() });
    globalScores[gameSize].sort((a, b) => new Date(a.date) - new Date(b.date));
    globalScores[gameSize] = sortAndTrimScores(globalScores[gameSize]);

    globalScores = sortObjectKeys(globalScores);

    localStorage.setItem('globalScores', JSON.stringify(globalScores));
    populateGlobalBestScores();
};

const populateScoreTable = (scoresData, targetElementId, isGlobal = null) => {
    const tableBody = document.querySelector(`#${targetElementId} tbody`);
    tableBody.innerHTML = '';

    let isOdd = true;
    let prevGameSize = null;

    Object.keys(scoresData).forEach(gameSize => {
        scoresData[gameSize].forEach((entry, index) => {
            const row = document.createElement('tr');

            // Write game size only if it's different from the previous one
            if (gameSize !== prevGameSize) {
                const cellSize = document.createElement('td');
                cellSize.textContent = gameSize;
                row.appendChild(cellSize);
                prevGameSize = gameSize;
            } else {
                // Add an empty cell if game size is not written
                const cellEmpty = document.createElement('td');
                cellEmpty.textContent = ''; // or you can use cellEmpty.innerHTML = '&nbsp;' for a non-breaking space
                row.appendChild(cellEmpty);
            }

            row.classList.add(isOdd ? 'game-size-odd' : 'game-size-even');

            const cellScore = document.createElement('td');
            cellScore.textContent = entry.score === 0 ? "Parfait" : entry.score;
            row.appendChild(cellScore);

            if (isGlobal) { // If it's global scores, include user column
                const cellUser = document.createElement('td');
                cellUser.textContent = entry.user;
                row.appendChild(cellUser);
            }

            const cellDate = document.createElement('td');
            const date = new Date(entry.date);
            cellDate.textContent = date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
            row.appendChild(cellDate);

            tableBody.appendChild(row);
        });

        isOdd = !isOdd;
    });
};



const populateUserScores = () => {
    const userEmail = getLoggedInUserEmail();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === userEmail);

    if (userIndex !== -1) {
        const bestScoresData = users[userIndex].gridSize || {};
        populateScoreTable(bestScoresData, 'user-best-scores');
    }
    populateUserLastScores();
};


const populateGlobalBestScores = () => {
    const globalScores = JSON.parse(localStorage.getItem('globalScores')) || {};
    populateScoreTable(globalScores, 'best-scores', true);
};

const populateUserLastScores = () => {
    const userEmail = getLoggedInUserEmail();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === userEmail);

    if (userIndex !== -1) {
        const lastScoresData = users[userIndex].lastScores || [];
        const tableBody = document.querySelector('#user-last-scores tbody');
        tableBody.innerHTML = '';

        let isOdd = true;

        lastScoresData.forEach(entry => {
            const row = document.createElement('tr');
            row.classList.add(isOdd ? 'game-size-odd' : 'game-size-even');

            const cellSize = document.createElement('td');
            cellSize.textContent = entry.gameSize; // Display gameSize
            row.appendChild(cellSize);

            const cellScore = document.createElement('td');
            cellScore.textContent = entry.score;
            row.appendChild(cellScore);

            const cellDate = document.createElement('td');
            const date = new Date(entry.date);
            cellDate.textContent = date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
            row.appendChild(cellDate);

            tableBody.appendChild(row);

            isOdd = !isOdd;
        });
    }
};


const populateScores = () => {
    if (isLoggedIn()) {
        populateUserScores();
    }
    populateGlobalBestScores();
};

document.getElementById('sign-in-form').addEventListener('submit', handleSignIn);
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('logoff').addEventListener('click', handleLogoff);
document.addEventListener('DOMContentLoaded', () => {
    navDisplay();
    populateScores();
});
