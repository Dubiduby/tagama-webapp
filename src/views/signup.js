import "../assets/styles/signup.css";
import { createNewUser } from "../api/apiUsers.js";
import { showToast } from "../utils/toastify.js";
import { navigate } from "../router.js";
import { showSpinner, hideSpinner } from "../components/spinner.js";
import { validation } from "../utils/validations.js";

export default function signUp(container) {
  container.innerHTML = "";

  const newUserDiv = document.createElement("div");
  newUserDiv.classList.add("divNewUser");
  container.appendChild(newUserDiv);

  const formWrapper = document.createElement("div");
  formWrapper.classList.add("div-form-sign-up");
  newUserDiv.appendChild(formWrapper);

  const form = document.createElement("form");
  form.id = "divNewUserForm";
  formWrapper.appendChild(form);

  const h1 = document.createElement("h1");
  h1.id = "signup-h1";
  h1.className = "sign-up-title";
  h1.textContent = "Sign Up ";
  form.appendChild(h1);

  const inputName = document.createElement("input");
  inputName.type = "text";
  inputName.className = "signup-input";
  inputName.id = "SignupFormName";
  inputName.placeholder = "(*)Name";
  inputName.required = true;
  form.appendChild(inputName);

  const inputEmail = document.createElement("input");
  inputEmail.type = "email";
  inputEmail.id = "signupFormEmail";
  inputEmail.className = "signup-input";
  inputEmail.placeholder = "(*)Email";
  inputEmail.required = true;
  form.appendChild(inputEmail);

  const inputPassword = document.createElement("input");
  inputPassword.type = "password";
  inputPassword.id = "sigupFormPassword";
  inputPassword.className = "signup-input";
  inputPassword.placeholder = "(*)Password";
  inputPassword.required = true;
  form.appendChild(inputPassword);

  const inputRepPassword = document.createElement("input");
  inputRepPassword.type = "password";
  inputRepPassword.id = "signupFormRepPassword";
  inputRepPassword.className = "signup-input";
  inputRepPassword.placeholder = "(*)Repeat password";
  inputRepPassword.required = true;
  form.appendChild(inputRepPassword);

  const small = document.createElement("small");
  small.className = "small-sign-up";
  small.textContent = "(*)All fields are required.";
  form.appendChild(small);

  const loginMsgDiv = document.createElement("div");
  loginMsgDiv.className = "login-msg-signup";
  loginMsgDiv.style.margin = "16px 0 0 0";
  loginMsgDiv.style.textAlign = "center";

  const button = document.createElement("button");
  button.type = "submit";
  button.className = "button-login-signup";
  button.textContent = "Sign up";
  form.appendChild(button);

  const loginText = document.createElement("p");
  loginText.classList.add("login-text");
  loginText.innerHTML = `Already have an account? <a href="/login" data-link id="login-link">Login!</a>`;

  form.appendChild(loginText);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const signupName = inputName.value.trim();
      const signupEmail = inputEmail.value.trim();
      const signupPassword = inputPassword.value.trim();
      const signupRepPassword = inputRepPassword.value.trim();

      if (signupPassword !== signupRepPassword) {
        showToast("Passwords do not match", "error");
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

        showToast("Signup successful", "success");

        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  });
}
