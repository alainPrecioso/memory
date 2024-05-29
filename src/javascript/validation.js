// Get form elements
const signInUsername = document.getElementById('sign-in-username');
const signInEmail = document.getElementById('sign-in-email');
const signInPassword = document.getElementById('sign-in-password');
const confirmPassword = document.getElementById('confirm-password');
const submitButton = document.getElementById('sign-in-submit');
const usernameMessage = document.getElementById('username-message');
const emailMessage = document.getElementById('email-message');
const passwordMessage = document.getElementById('password-message');
const confirmPasswordMessage = document.getElementById('confirm-password-message');

const containsLowerCase = str => /[a-z]/.test(str);

const containsDigit = str => /\d/.test(str);

const containsSpecialCharacter = str => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(str);

const validateUsername = () => {
    const usernameValid = signInUsername.value.length >= 3;
    usernameMessage.textContent = usernameValid ? '' : 'Le nom d\'utilisateur doit avoir au moins 3 caractères.';
    signInUsername.parentElement.classList.remove('placeholder')
    signInUsername.parentElement.classList.toggle('valid', usernameValid);
    signInUsername.parentElement.classList.toggle('invalid', !usernameValid);
    validateForm();
};

const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = signInEmail.value.trim();
    const emailValid = emailRegex.test(email);
    emailMessage.textContent = emailValid ? '' : 'Veuillez entrer une adresse email valide.';
    signInEmail.parentElement.classList.remove('placeholder')
    signInEmail.parentElement.classList.toggle('valid', emailValid);
    signInEmail.parentElement.classList.toggle('invalid', !emailValid);
    validateForm();
};

const validatePassword = () => {
    const password = signInPassword.value;
    const passwordStrengthBar = document.getElementById('password-strength-bar');
    const passwordStrengthText = document.getElementById('password-strength-text');

    const hasMinLength = password.length >= 6;
    const hasLowerCase = containsLowerCase(password);
    const hasDigit = containsDigit(password);
    const hasSpecialCharacter = containsSpecialCharacter(password);

    let strength = 0;
    if (hasMinLength) strength++;
    if (hasLowerCase) strength++;
    if (hasDigit) strength++;
    if (hasSpecialCharacter) strength++;

    passwordStrengthBar.style.width = (strength * 25) + '%'; // chaque condition augmente la taille de la barre de 25
    switch (strength) {
        case 0:
        case 1:
            passwordStrengthBar.style.backgroundColor = 'red';
            passwordStrengthText.textContent = 'Faible';
            break;
        case 2:
            passwordStrengthBar.style.backgroundColor = 'orange';
            passwordStrengthText.textContent = 'Moyen';
            break;
        case 3:
            passwordStrengthBar.style.backgroundColor = 'yellow';
            passwordStrengthText.textContent = 'Fort';
            break;
        case 4:
            passwordStrengthBar.style.backgroundColor = 'green';
            passwordStrengthText.textContent = 'Très fort';
            break;
    }

    const isPasswordValid = hasMinLength && hasLowerCase && hasDigit && hasSpecialCharacter;

    passwordMessage.innerHTML = isPasswordValid ? '' :
        ((hasMinLength ? '' : 'Le mot de passe doit avoir au moins 6 caractères.<br>') +
            (hasLowerCase ? '' : 'Le mot de passe doit inclure au moins une lettre minuscule.<br>') +
            (hasDigit ? '' : 'Le mot de passe doit inclure au moins un chiffre.<br>') +
            (hasSpecialCharacter ? '' : 'Le mot de passe doit inclure au moins un caractère spécial.<br>'));
    signInPassword.parentElement.classList.remove('placeholder')
    signInPassword.parentElement.classList.toggle('valid', isPasswordValid);
    signInPassword.parentElement.classList.toggle('invalid', !isPasswordValid);
    validateForm();
};


const validateConfirmPassword = () => {
    const confirmPasswordValid = signInPassword.value === confirmPassword.value;
    confirmPasswordMessage.textContent = confirmPasswordValid ? '' : 'Les mots de passe ne correspondent pas.';
    confirmPassword.parentElement.classList.remove('placeholder')
    confirmPassword.parentElement.classList.toggle('valid', confirmPasswordValid);
    confirmPassword.parentElement.classList.toggle('invalid', !confirmPasswordValid);
    validateForm();
};

const validateForm = () => {
    const isUsernameValid = signInUsername.value.length >= 3;
    const isEmailValid = signInEmail.checkValidity();
    const isPasswordValid = signInPassword.value.length >= 6 && containsLowerCase(signInPassword.value) &&
        containsDigit(signInPassword.value) && containsSpecialCharacter(signInPassword.value);
    const isConfirmPasswordValid = signInPassword.value === confirmPassword.value;

    submitButton.disabled = !(isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid);
};

signInUsername.addEventListener('input', validateUsername);
signInEmail.addEventListener('input', validateEmail);
signInPassword.addEventListener('input', validatePassword);
confirmPassword.addEventListener('input', validateConfirmPassword);
submitButton.disabled = true;
