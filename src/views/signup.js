import "../assets/styles/signup.css";
import { createNewUser } from "../api/apiUsers.js";
import { showToast } from "../utils/toastify.js";
import { navigate } from "../router.js";
import { showSpinner, hideSpinner } from "../components/spinner.js";
import { validation } from "../utils/validations.js";

export default function signUp(container) {
  container.innerHTML = "";

  const newUserDiv = document.createElement("div");
  newUserDiv.className = "divNewUser";
  container.appendChild(newUserDiv);

  const formWrapper = document.createElement("div");
  formWrapper.className = "div-form-sign-up";
  newUserDiv.appendChild(formWrapper);

  const form = document.createElement("form");
  formWrapper.appendChild(form);

  // Título
  const h1 = document.createElement("h1");
  h1.className = "sign-up-title";
  h1.textContent = "Registro";
  form.appendChild(h1);

  // Label y input para el nombre
  const labelName = document.createElement("label");
  labelName.htmlFor = "signup-name";
  labelName.innerHTML = "Nombre <span style='color:#ef4444'>*</span>";
  const inputName = document.createElement("input");
  inputName.type = "text";
  inputName.id = "signup-name";
  inputName.name = "name";
  inputName.required = true;
  inputName.className = "signup-input";
  form.appendChild(labelName);
  form.appendChild(inputName);

  // Label y input para el email
  const labelEmail = document.createElement("label");
  labelEmail.htmlFor = "signup-email";
  labelEmail.innerHTML = "Email <span style='color:#ef4444'>*</span>";
  const inputEmail = document.createElement("input");
  inputEmail.type = "email";
  inputEmail.id = "signup-email";
  inputEmail.name = "email";
  inputEmail.required = true;
  inputEmail.className = "signup-input";
  form.appendChild(labelEmail);
  form.appendChild(inputEmail);

  // Label y input para la contraseña
  const labelPassword = document.createElement("label");
  labelPassword.htmlFor = "signup-password";
  labelPassword.innerHTML = "Contraseña <span style='color:#ef4444'>*</span>";
  const inputPassword = document.createElement("input");
  inputPassword.type = "password";
  inputPassword.id = "signup-password";
  inputPassword.name = "password";
  inputPassword.required = true;
  inputPassword.className = "signup-input";
  form.appendChild(labelPassword);
  form.appendChild(inputPassword);

  // Label y input para repetir contraseña
  const labelRepeat = document.createElement("label");
  labelRepeat.htmlFor = "signup-repeat";
  labelRepeat.innerHTML =
    "Repetir contraseña <span style='color:#ef4444'>*</span>";
  const inputRepeat = document.createElement("input");
  inputRepeat.type = "password";
  inputRepeat.id = "signup-repeat";
  inputRepeat.name = "repeat";
  inputRepeat.required = true;
  inputRepeat.className = "signup-input";
  form.appendChild(labelRepeat);
  form.appendChild(inputRepeat);

  // Texto pequeño
  const small = document.createElement("small");
  small.className = "small-sign-up";
  small.textContent = "(*) Todos los campos son obligatorios.";
  form.appendChild(small);

  // Botón de registro
  const button = document.createElement("button");
  button.type = "submit";
  button.className = "button-login-signup";
  button.textContent = "Registrarse";
  form.appendChild(button);

  const loginMsgDiv = document.createElement("div");
  loginMsgDiv.className = "login-msg-signup";
  loginMsgDiv.style.margin = "16px 0 0 0";
  loginMsgDiv.style.textAlign = "center";

  const loginText = document.createElement("p");
  loginText.classList.add("login-text");
  loginText.innerHTML = `¿Ya tienes una cuenta? <a href="/login" data-link id="login-link">¡Inicia sesión!</a>`;

  form.appendChild(loginText);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const signupName = inputName.value.trim();
      const signupEmail = inputEmail.value.trim();
      const signupPassword = inputPassword.value.trim();
      const signupRepPassword = inputRepeat.value.trim();

      if (signupPassword !== signupRepPassword) {
        showToast("Las contraseñas no coinciden", "error");
        return;
      }
      const isValid = validation({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });

      if (isValid) {
        const newUser = {
          signupName,
          signupEmail,
          signupPassword,
        };
        showSpinner(container);

        await createNewUser(newUser);

        showToast("Registro exitoso", "success");

        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  });
}
