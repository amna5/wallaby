import { auth, googleProvider } from "../config/firebase.js";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const authPages = new Set([
  "create.html",
  "signUp.html",
  "login.html",
  "forgotPassword.html",
  "verification.html"
]);
const protectedPages = new Set(["home.html", "settings.html"]);

const signupForm = document.querySelector(".signup-form");
const loginForm = document.querySelector(".login-form");
const forgotPasswordForm = document.querySelector(".forgot-password-form");
const googleSignInBtns = document.querySelectorAll("[data-google-signin]");
const logoutBtn = document.querySelector("[data-logout]");
const authFeedback = document.querySelector("[data-auth-feedback]");
const isAuthPage = authPages.has(currentPage);
const isProtectedPage = protectedPages.has(currentPage);

function redirectTo(path) {
  window.location.replace(path);
}

if (isAuthPage || isProtectedPage) {
  document.documentElement.style.visibility = "hidden";
}

function showPage() {
  document.documentElement.style.visibility = "";
}

function setFeedback(message, isError = false) {
  if (!authFeedback) {
    if (message && isError) {
      alert(message);
    }
    return;
  }

  authFeedback.textContent = message;
  authFeedback.hidden = !message;
  authFeedback.classList.toggle("error", Boolean(message && isError));
}

function setButtonBusy(button, busy, idleLabel) {
  if (!button) return;

  if (!button.dataset.defaultLabel) {
    button.dataset.defaultLabel = idleLabel || button.textContent.trim();
  }

  button.disabled = busy;
  button.textContent = busy ? "Please wait..." : button.dataset.defaultLabel;
}

function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "This email is already in use.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/missing-password":
      return "Enter your password.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    case "auth/popup-blocked":
      return "Google sign-in popup was blocked. Allow popups and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before it finished.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Auth.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled in Firebase Auth.";
    default:
      return error?.message || "Something went wrong. Try again.";
  }
}

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value;
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    setFeedback("");
    setButtonBusy(submitBtn, true, "create account");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      redirectTo("home.html");
    } catch (error) {
      console.error("Error creating user:", error.code, error.message);
      setFeedback(getAuthErrorMessage(error), true);
    } finally {
      setButtonBusy(submitBtn, false, "create account");
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    setFeedback("");
    setButtonBusy(submitBtn, true, "log in");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      redirectTo("home.html");
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      setFeedback(getAuthErrorMessage(error), true);
    } finally {
      setButtonBusy(submitBtn, false, "log in");
    }
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
    const verificationUrl = new URL(
      `${window.location.origin}${window.location.pathname.replace(
        "forgotPassword.html",
        "verification.html"
      )}`
    );

    setFeedback("");
    setButtonBusy(submitBtn, true, "confirm");

    try {
      await sendPasswordResetEmail(auth, email);
      verificationUrl.searchParams.set("email", email);
      window.location.href = verificationUrl.toString();
    } catch (error) {
      console.error("Password reset error:", error.code, error.message);
      setFeedback(getAuthErrorMessage(error), true);
    } finally {
      setButtonBusy(submitBtn, false, "confirm");
    }
  });
}

googleSignInBtns.forEach((button) => {
  button.addEventListener("click", async () => {
    setFeedback("");

    try {
      await signInWithPopup(auth, googleProvider);
      redirectTo("home.html");
    } catch (error) {
      if (
        error?.code === "auth/popup-blocked" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError) {
          console.error(
            "Google redirect sign-in error:",
            redirectError.code,
            redirectError.message
          );
          setFeedback(getAuthErrorMessage(redirectError), true);
          return;
        }
      }

      console.error("Google sign-in error:", error.code, error.message);
      setFeedback(getAuthErrorMessage(error), true);
    }
  });
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      redirectTo("login.html");
    } catch (error) {
      console.error("Logout error:", error.code, error.message);
    }
  });
}

try {
  const result = await getRedirectResult(auth);

  if (result) {
    redirectTo("home.html");
  }
} catch (error) {
  console.error("Error getting redirect result:", error.code, error.message);
  setFeedback(getAuthErrorMessage(error), true);
}

onAuthStateChanged(auth, (user) => {
  if (user && isAuthPage) {
    redirectTo("home.html");
    return;
  }

  if (!user && isProtectedPage) {
    redirectTo("login.html");
    return;
  }

  showPage();
});
