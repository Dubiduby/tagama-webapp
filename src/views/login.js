import "../assets/styles/login.css";
import { getUsers } from "../api/apiUsers";
import { showToast } from "../utils/toastify";
import { navigate } from "../router.js";
import { showSpinner, hideSpinner } from "../components/spinner.js";

export default function login(container) {
  container.innerHTML = "";

  const app = document.getElementById("app");

  const loginContainer = document.createElement("div");
  loginContainer.classList.add("login-container");
  const loginForm = document.createElement("form");
  loginForm.classList.add("login-form");

  const h1 = document.createElement("h1");
  h1.id = "login-h1";
  h1.className = "login-title";
  h1.textContent = "Inicio de sesión";

  //Email

  const loginEmail = document.createElement("input");
  loginEmail.type = "email";
  loginEmail.placeholder = "Ingresa tu mejor email";
  loginEmail.name = "email";
  const emailLabel = document.createElement("label");
  emailLabel.textContent = "Email:";
  emailLabel.setAttribute("for", "login-email");
  loginEmail.id = "login-email";

  //password

  const loginPassword = document.createElement("input");
  loginPassword.type = "password";
  loginPassword.placeholder = "Ingresa una contraseña segura";
  loginPassword.name = "password";
  const passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Contraseña:";
  passwordLabel.setAttribute("for", "login-password");
  loginPassword.id = "login-password";

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Iniciar Sesión";

  const signupText = document.createElement("p");
  signupText.classList.add("signup-text");
  signupText.innerHTML = `¿No tienes una cuenta? <a href="/signup" data-link id="signup-link">¡Regístrate!</a>`;

  loginForm.appendChild(h1);
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
    // Mostrar spinner aquí

    const email = loginEmail.value;
    const password = loginPassword.value;

    if (!email || !password) {
      showToast("Por favor, completa todos los campos.", "error");
      return;
    }

    const users = await getUsers();

    if (users) {
      const isMatch = users.find(
        (user) => user.email === email && user.password === password
      );
      if (isMatch) {
        localStorage.setItem("currentUser", JSON.stringify(isMatch));
        showToast("Inicio de sesión exitoso", "success");
        navigate("/home");
      } else {
        showToast("Email o contraseña incorrectos", "error");
        loginPassword.value = "";
      }
    } else {
      showToast("Error inesperado en el inicio de sesión", "error");
    }
  });
}
