import "../assets/styles/login.css";
import { getUsers } from "../api/apiUsers";
import { showToast } from "../utils/toastify";
import { navigate } from "../router.js";

export default function login(container) {

  container.innerHTML = "";

  const app = document.getElementById("app");

  const loginContainer = document.createElement("div");
  loginContainer.classList.add("login-container");
  const loginForm = document.createElement("form");
  loginForm.classList.add("login-form");

  //Email

  const loginEmail = document.createElement("input");
  loginEmail.type = "email";
  loginEmail.placeholder = "Enter your best email";
  loginEmail.name = "email";
  const emailLabel = document.createElement("label");
  emailLabel.textContent = "Email:";
  emailLabel.setAttribute("for", "login-email");
  loginEmail.id = "login-email";

  //password

  const loginPassword = document.createElement("input");
  loginPassword.type = "password";
  loginPassword.placeholder = "Enter a save password";
  loginPassword.name = "password";
  const passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Password:";
  passwordLabel.setAttribute("for", "login-password");
  loginPassword.id = "login-password";

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Log in";

  const signupText = document.createElement("p");
  signupText.classList.add("signup-text");
  signupText.innerHTML = `Don't have an account? <a href="/signup" data-link id="signup-link">Sign up!</a>`;

  loginForm.appendChild(emailLabel);
  loginForm.appendChild(loginEmail);
  loginForm.appendChild(passwordLabel);
  loginForm.appendChild(loginPassword);
  loginForm.appendChild(submitButton);
  loginForm.appendChild(signupText);
  loginContainer.appendChild(loginForm);
  app.appendChild(loginContainer);

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;

    const users = await getUsers();

    if (users) {
      const isMatch = users.find(
        (user) => user.email === email && user.password === password
      );
      if (isMatch) {
        localStorage.setItem("currentUser", JSON.stringify(isMatch));
        showToast("Login successful", "success");
        navigate("/home");
      } else {
        showToast("Email or password incorrect", "error");
        loginPassword.value = "";
      }
    } else {
      showToast("Unexpected error in login", "error");
    }
  });
}
