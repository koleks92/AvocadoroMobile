export const emailValidation = (email: string): boolean => {
    // Email validation: must include "@" and "."
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailIsValid = emailRegex.test(email);

    return emailIsValid;
};

export const passwordValidation = (password: string): boolean => {
    const isLongEnough = password.length >= 10;
    const hasDigit = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    
    const passwordIsValid = isLongEnough && hasDigit && hasLetter;

    // Based on your previous code, you wanted to return 'true' if it is INVALID
    return passwordIsValid;
};
