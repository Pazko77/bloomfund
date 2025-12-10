import { useState, useEffect, useRef } from "react";
import "./Inscription.css";
import Logo from "../../assets/BloomfundLogo.svg";

export default function Inscription() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: ""
    });

    const [focusedField, setFocusedField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [notification, setNotification] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const formRef = useRef(null);
    const firstNameRef = useRef(null);

    // Validation functions
    const validateName = (name, fieldLabel) => {
        if (!name) {
            return { isValid: false, message: `${fieldLabel} est requis` };
        }
        if (name.length < 2) {
            return { isValid: false, message: `${fieldLabel} doit contenir au moins 2 caractères` };
        }
        return { isValid: true, message: "" };
    };

    const validateEmail = (email) => {
        if (!email) {
            return { isValid: false, message: "L'email est requis" };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: "Email invalide" };
        }
        return { isValid: true, message: "" };
    };

    const validatePassword = (password) => {
        if (!password) {
            return { isValid: false, message: "Le mot de passe est requis" };
        }
        if (password.length < 8) {
            return { isValid: false, message: "Au moins 8 caractères requis" };
        }
        if (!/[A-Z]/.test(password)) {
            return { isValid: false, message: "Au moins une majuscule requise" };
        }
        if (!/[0-9]/.test(password)) {
            return { isValid: false, message: "Au moins un chiffre requis" };
        }
        return { isValid: true, message: "" };
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) {
            return { isValid: false, message: "Confirmez votre mot de passe" };
        }
        if (confirmPassword !== password) {
            return { isValid: false, message: "Les mots de passe ne correspondent pas" };
        }
        return { isValid: true, message: "" };
    };

    const validateTerms = (terms) => {
        if (!terms) {
            return { isValid: false, message: "Vous devez accepter les conditions" };
        }
        return { isValid: true, message: "" };
    };

    // Calculate password strength
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return Math.min(strength, 4);
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Calculate password strength
        if (name === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Handle field blur (validation)
    const handleBlur = (fieldName) => {
        setFocusedField(null);

        const value = formData[fieldName];
        let result;

        switch(fieldName) {
            case "firstName":
                result = validateName(value, "Le prénom");
                break;
            case "lastName":
                result = validateName(value, "Le nom");
                break;
            case "email":
                result = validateEmail(value);
                break;
            case "password":
                result = validatePassword(value);
                break;
            case "confirmPassword":
                result = validateConfirmPassword(value, formData.password);
                break;
            case "terms":
                result = validateTerms(formData.terms);
                break;
            default:
                return;
        }

        if (result && !result.isValid) {
            setErrors(prev => ({ ...prev, [fieldName]: result.message }));
        } else if (result && result.isValid) {
            setErrors(prev => ({ ...prev, [fieldName]: "" }));
        }
    };

    // Show notification
    const showNotification = (message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle social signup
    const handleSocialSignup = (provider) => {
        showNotification(`Inscription avec ${provider}...`, "info");
    };

    // Simulate signup API call
    const simulateSignup = async (userData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Signup attempt:", userData);
                resolve({ success: true });
            }, 1500);
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        // Validate all fields
        const firstNameValidation = validateName(formData.firstName, "Le prénom");
        const lastNameValidation = validateName(formData.lastName, "Le nom");
        const emailValidation = validateEmail(formData.email);
        const passwordValidation = validatePassword(formData.password);
        const confirmPasswordValidation = validateConfirmPassword(formData.confirmPassword, formData.password);
        const termsValidation = validateTerms(formData.terms);

        const newErrors = {
            firstName: firstNameValidation.isValid ? "" : firstNameValidation.message,
            lastName: lastNameValidation.isValid ? "" : lastNameValidation.message,
            email: emailValidation.isValid ? "" : emailValidation.message,
            password: passwordValidation.isValid ? "" : passwordValidation.message,
            confirmPassword: confirmPasswordValidation.isValid ? "" : confirmPasswordValidation.message,
            terms: termsValidation.isValid ? "" : termsValidation.message
        };

        setErrors(newErrors);

        const isValid = Object.values(newErrors).every(error => error === "");

        if (!isValid) {
            // Shake form on error
            if (formRef.current) {
                formRef.current.style.animation = "shake 0.5s ease-in-out";
                setTimeout(() => {
                    if (formRef.current) formRef.current.style.animation = "";
                }, 500);
            }
            return;
        }

        // Submit form
        setIsSubmitting(true);

        try {
            await simulateSignup(formData);
            setShowSuccess(true);

            // Simulate redirect
            setTimeout(() => {
                // Reset form after demo
                setShowSuccess(false);
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    terms: false
                });
                setErrors({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    terms: ""
                });
                setPasswordStrength(0);
            }, 5000);

        } catch (error) {
            showNotification("Échec de l'inscription. Veuillez réessayer.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setErrors({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    terms: ""
                });
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Password strength color and label
    const getStrengthInfo = () => {
        const strengths = [
            { label: "Très faible", color: "#ef4444" },
            { label: "Faible", color: "#f59e0b" },
            { label: "Moyen", color: "#eab308" },
            { label: "Fort", color: "#22c55e" },
            { label: "Très fort", color: "#15A019" }
        ];
        return strengths[passwordStrength] || strengths[0];
    };

    return (
        <div className="signup">
            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-header">
                        <img src={Logo} alt="BloomFund Logo"/>
                        <p>S'incrire</p>
                    </div>

                    {notification && (
                        <div className={`notification notification-${notification.type}`}>
                            {notification.message}
                        </div>
                    )}

                    <form
                        ref={formRef}
                        className={`signup-form ${showSuccess ? "form-hidden" : ""}`}
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className="name-row">
                            <div className={`form-group ${errors.firstName ? "has-error" : ""}`}>
                                <div className={`input-wrapper ${focusedField === "firstName" ? "focused" : ""}`}>
                                    <input
                                        ref={firstNameRef}
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField("firstName")}
                                        onBlur={() => handleBlur("firstName")}
                                        className={formData.firstName ? "has-value" : ""}
                                        required
                                        autoComplete="given-name"
                                    />
                                    <label htmlFor="firstName">Prénom</label>
                                </div>
                                {errors.firstName && (
                                    <span className="error-message show">{errors.firstName}</span>
                                )}
                            </div>

                            <div className={`form-group ${errors.lastName ? "has-error" : ""}`}>
                                <div className={`input-wrapper ${focusedField === "lastName" ? "focused" : ""}`}>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField("lastName")}
                                        onBlur={() => handleBlur("lastName")}
                                        className={formData.lastName ? "has-value" : ""}
                                        required
                                        autoComplete="family-name"
                                    />
                                    <label htmlFor="lastName">Nom</label>
                                </div>
                                {errors.lastName && (
                                    <span className="error-message show">{errors.lastName}</span>
                                )}
                            </div>
                        </div>

                        <div className={`form-group ${errors.email ? "has-error" : ""}`}>
                            <div className={`input-wrapper ${focusedField === "email" ? "focused" : ""}`}>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => handleBlur("email")}
                                    className={formData.email ? "has-value" : ""}
                                    required
                                    autoComplete="email"
                                />
                                <label htmlFor="email">Adresse Mail</label>
                            </div>
                            {errors.email && (
                                <span className="error-message show">{errors.email}</span>
                            )}
                        </div>

                        <div className={`form-group ${errors.password ? "has-error" : ""}`}>
                            <div className={`input-wrapper password-wrapper ${focusedField === "password" ? "focused" : ""}`}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => handleBlur("password")}
                                    className={formData.password ? "has-value" : ""}
                                    required
                                    autoComplete="new-password"
                                />
                                <label htmlFor="password">Mot de Passe</label>
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    <span className={`eye-icon ${showPassword ? "show-password" : ""}`}></span>
                                </button>
                            </div>
                            {formData.password && (
                                <div className="password-strength">
                                    <div className="strength-bar">
                                        <div
                                            className="strength-fill"
                                            style={{
                                                width: `${(passwordStrength / 4) * 100}%`,
                                                backgroundColor: getStrengthInfo().color
                                            }}
                                        ></div>
                                    </div>
                                    <span className="strength-label" style={{ color: getStrengthInfo().color }}>
                                        {getStrengthInfo().label}
                                    </span>
                                </div>
                            )}
                            {errors.password && (
                                <span className="error-message show">{errors.password}</span>
                            )}
                        </div>

                        <div className={`form-group ${errors.confirmPassword ? "has-error" : ""}`}>
                            <div className={`input-wrapper password-wrapper ${focusedField === "confirmPassword" ? "focused" : ""}`}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("confirmPassword")}
                                    onBlur={() => handleBlur("confirmPassword")}
                                    className={formData.confirmPassword ? "has-value" : ""}
                                    required
                                    autoComplete="new-password"
                                />
                                <label htmlFor="confirmPassword">Confirmer le Mot de Passe</label>
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    <span className={`eye-icon ${showConfirmPassword ? "show-password" : ""}`}></span>
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="error-message show">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <div className={`form-group checkbox-group ${errors.terms ? "has-error" : ""}`}>
                            <label className="terms-wrapper">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("terms")}
                                />
                                <span className="checkbox-label">
                                    <span className="checkmark"></span>
                                    J'accepte les <a href="/terms" onClick={(e) => e.preventDefault()}>conditions d'utilisation</a> et la <a href="/privacy" onClick={(e) => e.preventDefault()}>politique de confidentialité</a>
                                </span>
                            </label>
                            {errors.terms && (
                                <span className="error-message show">{errors.terms}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`signup-btn btn ${isSubmitting ? "loading" : ""}`}
                            disabled={isSubmitting}
                        >
                            <span className="btn-text">S'inscrire</span>
                            <span className="btn-loader"></span>
                        </button>
                    </form>

                    <div className={`divider ${showSuccess ? "hidden" : ""}`}>
                        <span>ou</span>
                    </div>

                    <div className={`social-signup ${showSuccess ? "hidden" : ""}`}>
                        <button
                            type="button"
                            className="social-btn google-btn"
                            onClick={() => handleSocialSignup("Google")}
                        >
                            <span className="social-icon google-icon"></span>
                            Google
                        </button>
                        <button
                            type="button"
                            className="social-btn facebook-btn"
                            onClick={() => handleSocialSignup("Facebook")}
                        >
                            <span className="social-icon facebook-icon"></span>
                            Facebook
                        </button>
                    </div>

                    <div className={`login-link ${showSuccess ? "hidden" : ""}`}>
                        <p>Vous avez déjà un compte ? <a href="/connexion">Connectez-vous</a></p>
                    </div>

                    <div className={`success-message ${showSuccess ? "show" : ""}`}>
                        <div className="success-icon">✓</div>
                        <h3>Inscription réussie !</h3>
                        <p>Bienvenue sur BloomFund !</p>
                    </div>
                </div>
            </div>
        </div>
    );
}