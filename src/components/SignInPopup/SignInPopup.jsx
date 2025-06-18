import React, { useContext, useState } from "react";
import "./SignInPopup.css";
import FirebaseContext from "../../context/Firebase/FirebaseContext";

const SignInPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    signinUserWithEmailAndPassword,
    signupUserWithEmailAndPassword,
    signUpWithGoogle,
  } = useContext(FirebaseContext);

  // Generate random avatar URL
  const generateAvatarUrl = (email) => {
    const seed = email.split("@")[0];
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      seed
    )}&backgroundColor=667eea,764ba2,f093fb,4ade80,fbbf24,f87171`;
  };

  // Email validation
  const validateEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  
  // Password validation
  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!validateEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (!value.trim()) {
          newErrors.password = "Password is required";
        } else if (!isLoginMode) {
          const passwordError = validatePassword(value);
          if (passwordError) {
            newErrors.password = passwordError;
          } else {
            delete newErrors.password;
          }

          // Also validate confirm password if it exists
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          } else if (
            formData.confirmPassword &&
            value === formData.confirmPassword
          ) {
            delete newErrors.confirmPassword;
          }
        } else {
          delete newErrors.password;
        }
        break;

      case "confirmPassword":
        if (!isLoginMode) {
          if (!value.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
          } else if (value !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    setErrors({}); // Clear previous errors

    // Validate all fields before submission
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!isLoginMode) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!isLoginMode && !formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (!isLoginMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      if (isLoginMode) {
        // Sign In
        await signinUserWithEmailAndPassword(formData.email, formData.password);
        setSuccessMessage("Successfully signed in! Welcome back.");
        setTimeout(() => {
          setShowPopup(false);
          resetForm();
        }, 1500);
      } else {
        // Sign Up
        const userCredential = await signupUserWithEmailAndPassword(
          formData.email,
          formData.password
        );

        // Set avatar URL for new user
        if (userCredential && userCredential.user) {
          const avatarUrl = generateAvatarUrl(formData.email);
          // console.log("adavvvad", vatarUrl);
          // You might need to update user profile here depending on your Firebase setup
          // await updateProfile(userCredential.user, { photoURL: avatarUrl });
        }

        setSuccessMessage(
          "Account created successfully! Welcome to our platform."
        );
        setTimeout(() => {
          setShowPopup(false);
          resetForm();
        }, 1500);
      }
    } catch (error) {
      console.error("Authentication error:", error);

      // Handle specific Firebase errors
      const newErrors = {};
      let hasFieldError = false;

      switch (error.code) {
        case "auth/email-already-in-use":
          newErrors.email =
            "This email is already registered. Try signing in instead.";
          hasFieldError = true;
          break;
        case "auth/invalid-email":
          newErrors.email = "Invalid email address format.";
          hasFieldError = true;
          break;
        case "auth/weak-password":
          newErrors.password =
            "Password is too weak. Please choose a stronger password.";
          hasFieldError = true;
          break;
        case "auth/user-not-found":
          newErrors.email = "No account found with this email address.";
          hasFieldError = true;
          break;
        case "auth/wrong-password":
          newErrors.password = "Incorrect password. Please try again.";
          hasFieldError = true;
          break;
        case "auth/invalid-credential":
          if (isLoginMode) {
            newErrors.email =
              "Invalid email or password. Please check your credentials.";
          } else {
            newErrors.email = "Invalid email format.";
          }
          hasFieldError = true;
          break;
        case "auth/user-disabled":
          setGeneralError(
            "This account has been disabled. Please contact support."
          );
          break;
        case "auth/operation-not-allowed":
          setGeneralError(
            "Email/password accounts are not enabled. Please contact support."
          );
          break;
        case "auth/too-many-requests":
          setGeneralError("Too many failed attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setGeneralError(
            "Network error. Please check your internet connection and try again."
          );
          break;
        case "auth/internal-error":
          setGeneralError("An internal error occurred. Please try again.");
          break;
        default:
          // For unknown errors, show the error message if available
          if (error.message) {
            setGeneralError(`Error: ${error.message}`);
          } else {
            setGeneralError("An unexpected error occurred. Please try again.");
          }
      }

      // Set field-specific errors if any
      if (hasFieldError) {
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGeneralError("");
    setErrors({});
    setIsLoading(true);

    try {
      const { displayName, email, photoURL, uid } = await signUpWithGoogle();

      const res = await fetch("http://localhost:5000/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          email,
          photoURL,
          firebaseUid: uid,
        }),
      }); 
      const data = await res.json();

      // console.log('mongo contest : ', data);

      setSuccessMessage("Successfully signed in with Google!");
      setTimeout(() => {
        setShowPopup(false);
        resetForm();
      }, 1500);
    } catch (error) {
      console.error("Google sign-in error:", error);

      let errorMessage = "Google sign-in failed. Please try again.";

      switch (error.code) {
        case "auth/account-exists-with-different-credential":
          errorMessage =
            "An account already exists with this email using a different sign-in method. Try signing in with email/password instead.";
          break;
        case "auth/cancelled-popup-request":
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in was cancelled. Please try again.";
          break;
        case "auth/popup-blocked":
          errorMessage =
            "Pop-up was blocked by your browser. Please allow pop-ups and try again.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection and try again.";
          break;
        case "auth/internal-error":
          errorMessage = "An internal error occurred. Please try again.";
          break;
        default:
          // For unknown errors, include the actual error message
          if (error.message) {
            errorMessage = `Google sign-in failed: ${error.message}`;
          }
      }

      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear previous error and validate on change
    validateField(name, value);

    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError("");
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "", confirmPassword: "" });
    setErrors({});
    setGeneralError("");
    setSuccessMessage("");
    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const closePopup = () => {
    setShowPopup(false);
    resetForm();
  };

  return (
    <div className="signin-container">
      {/* Sign-In Button */}
      <button onClick={() => setShowPopup(true)} className="sign-in-btn">
        <span className="btn-text">Sign In</span>
        <div className="btn-glow"></div>
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>
              ×
            </button>

            <div className="popup-header">
              <h2>{isLoginMode ? "Welcome Back!" : "Create Account"}</h2>
              <p>{isLoginMode ? "Sign in to your account" : "Join us today"}</p>
            </div>

            {/* General Error Message */}
            {generalError && (
              <div className="error-message general-error">{generalError}</div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className={errors.email ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className={errors.password ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {!isLoginMode && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    className={errors.confirmPassword ? "error" : ""}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="create-account-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  // <span className="loading-spinner"></span>
                  // 'Loading...'
                  // <></>
                  // <h1>Hello</h1>
                  isLoginMode ? (
                    <span>Signing in ...</span>
                  ) : (
                    <span>Creating ...</span>
                  )
                ) : isLoginMode ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="google-signin-btn"
              disabled={isLoading}
            >
              <svg
                className="google-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </button>

            <div className="auth-switch">
              <span>
                {isLoginMode
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="switch-btn"
                  disabled={isLoading}
                >
                  {isLoginMode ? "Sign up" : "Log in"}
                </button>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPopup;
