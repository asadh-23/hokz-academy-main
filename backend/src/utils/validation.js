export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { isValid: false, message: "Email is required." };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isValid = emailRegex.test(trimmedEmail);

    if (!isValid) {
        return { isValid: false, message: "Please enter a valid email address." };
    }

    return { isValid: true, email: trimmedEmail,};
};




export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: "Password is required." };
    }
    const trimmedPassword = password.trim();

    if (trimmedPassword.length < 8) {
        return { isValid: false, message: "Password must be at least 8 characters long." };
    }

    return { isValid: true, password: trimmedPassword};
};

export const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return { isValid: false, message: "Phone number is required." };
    }

    const cleanedPhone = phone.replace(/[\s-]/g, '').trim();

    const phoneRegex = /^(\+?\d{1,3})?\d{7,15}$/;

    const isValid = phoneRegex.test(cleanedPhone);

    if (!isValid) {
        return { isValid: false, message: "Please enter a valid phone number" };
    }

    return { isValid: true, phone: cleanedPhone };
};


export const isNullOrWhitespace = (value) => {
    return value === null || value === undefined || value.trim() === '';
};