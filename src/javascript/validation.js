// Get form elements
const signInForm = document.getElementById('signInForm');
const signInUsername = signInForm.querySelector('#signInUsername');
const signInEmail = signInForm.querySelector('#signInEmail');
const signInPassword = signInForm.querySelector('#signInPassword');
const confirmPassword = signInForm.querySelector('#confirmPassword');
const submitButton = signInForm.querySelector('#signInSubmit');
const usernameMessage = signInForm.querySelector('#usernameMessage');
const emailMessage = signInForm.querySelector('#emailMessage');
const passwordMessage = signInForm.querySelector('#passwordMessage');
const confirmPasswordMessage = signInForm.querySelector('#confirmPasswordMessage');

const containsLowerCase = str => /[a-z]/.test(str);

const containsDigit = str => /\d/.test(str);

const containsSpecialCharacter = str => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(str);

const validateUsername = () => {
    const usernameValid = signInUsername.value.length >= 3;
    usernameMessage.textContent = usernameValid ? '' : 'Le nom d\'utilisateur doit avoir au moins 3 caractères.';
    validateForm();
};

const validateEmail = () => {
    const emailValid = signInEmail.checkValidity();
    emailMessage.textContent = emailValid ? '' : 'Veuillez entrer une adresse email valide.';
    validateForm();
};

const validatePassword = () => {
    const password = signInPassword.value;
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');
    const passwordStrengthText = document.getElementById('passwordStrengthText');

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
    validateForm();
};


const validateConfirmPassword = () => {
    const confirmPasswordValid = signInPassword.value === confirmPassword.value;
    confirmPasswordMessage.textContent = confirmPasswordValid ? '' : 'Les mots de passe ne correspondent pas.';
    validateForm();
};

const validateForm = () => {
    const isUsernameValid = signInUsername.value.length >= 3;
    const isEmailValid = signInEmail.checkValidity();
    const isPasswordValid = signInPassword.value.length >= 6 && containsLowerCase(signInPassword.value) && containsDigit(signInPassword.value) && containsSpecialCharacter(signInPassword.value);
    const isConfirmPasswordValid = signInPassword.value === confirmPassword.value;

    submitButton.disabled = !(isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid);
};

signInUsername.addEventListener('input', validateUsername);
signInEmail.addEventListener('input', validateEmail);
signInPassword.addEventListener('input', validatePassword);
confirmPassword.addEventListener('input', validateConfirmPassword);
submitButton.disabled = true;
