export const validateText = (text, min, max, label) => {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
        return { isValid: false, message: `${label} is required.` };
    }

    const trimmed = text.trim();

    // 1. Length check
    if (trimmed.length < min || trimmed.length > max) {
        return { isValid: false, message: `${label} must be between ${min} and ${max} characters.` };
    }

    // 2. Strict Letter Check: Must contain at least one Alphabet [a-zA-Z]
    const hasLetters = /[a-zA-Z]/.test(trimmed);
    if (!hasLetters) {
        return { isValid: false, message: `${label} must contain at least some letters.` };
    }

    // 3. Prevent purely Numeric strings (Optional: depending on your need)
    if (/^\d+$/.test(trimmed)) {
        return { isValid: false, message: `${label} cannot be just numbers.` };
    }

    // 4. UI-Breaking check: Prevent extremely long single words
    const longWordCheck = trimmed.split(/\s+/).some((word) => word.length > 50);
    if (longWordCheck) {
        return { isValid: false, message: `${label} contains a word that is too long.` };
    }

    return { isValid: true, value: trimmed };
};

/**
 * 2. STRICT EMAIL VALIDATOR
 */
export const validateEmail = (email) => {
    if (!email) return { isValid: false, message: "Email is required." };

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
        return { isValid: false, message: "Please enter a valid email address." };
    }
    return { isValid: true, value: trimmedEmail };
};

/**
 * 3. STRICT PASSWORD VALIDATOR
 * Rules: Min 8 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char
 */
export const validatePassword = (password) => {
    if (!password) return { isValid: false, message: "Password is required." };

    const trimmed = password.trim();

    if (trimmed.length < 8) {
        return { isValid: false, message: "Password must be at least 8 characters long." };
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(trimmed)) {
        return {
            isValid: false,
            message: "Password must have at least one uppercase, one lowercase, one number, and one special character.",
        };
    }

    return { isValid: true, value: trimmed };
};

/**
 * 4. STRICT PHONE VALIDATOR
 * Rules: 10 digits standard
 */
export const validatePhone = (phone) => {
    if (!phone || typeof phone !== "string") {
        return { isValid: false, message: "Phone number is required." };
    }
    const cleaned = phone.replace(/[\s-]/g, "").trim();
    const phoneRegex = /^[6-9]\d{9}$/;

    // 1. Check if it's only numbers
    if (!/^\d+$/.test(cleaned)) {
        return { isValid: false, message: "Phone number must contain only digits." };
    }

    // 2. Check total length
    if (cleaned.length !== 10) {
        return { isValid: false, message: "Phone number must be exactly 10 digits." };
    }

    // 3. Check starting digit (6-9)
    if (!phoneRegex.test(cleaned)) {
        return { isValid: false, message: "Invalid Indian phone number. Must start with 6-9." };
    }

    return { isValid: true, value: cleaned };
};

export const validateArray = (arr, label) => {
    // 1. Array check
    if (!Array.isArray(arr)) {
        return { isValid: false, message: `Invalid format for ${label}.` };
    }

    // 2. Remove empty/whitespace strings first
    const cleanedItems = arr
        .map((s) => (typeof s === "string" ? s.trim() : s))
        .filter((item) => item !== null && item !== undefined && item !== "");

    // 3. Array Max length check (Max 20 subjects)
    if (cleanedItems.length > 20) {
        return { isValid: false, message: `${label} cannot exceed 20 items.` };
    }

    // 4. Individual Item length check (2-70 chars)
    for (const item of cleanedItems) {
        if (typeof item !== "string" || item.length < 2 || item.length > 70) {
            return {
                isValid: false,
                message: `Each ${label} must be between 2 and 70 characters.`,
            };
        }
    }

    return { isValid: true, value: cleanedItems };
};
