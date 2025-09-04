import { getUsers } from "../api/apiUsers";
import { showToast } from "../utils/toastify";
import { navigate } from "../router.js";

export default function login(container) {
  container.innerHTML = "";

  // Wrapper principal centered
  const wrapper = document.createElement("div");
  wrapper.className = "max-w-md mx-auto px-4 pt-12 pb-18 md:pb-10 md:pt-6";

  // Title and subtitle centered
  const headerInfo = document.createElement("div");
  headerInfo.className = "text-center mb-8";

  const title = document.createElement("h1");
  title.className =
    "text-3xl md:text-4xl font-extrabold text-[#1e1d1d] dark:text-white mb-4";
  title.textContent = "Bienvenido de vuelta";

  const subtitle = document.createElement("p");
  subtitle.className =
    "text-lg text-[var(--color-gray)] dark:text-[var(--color-text)] mb-6";
  subtitle.textContent =
    "Inicia sesión para continuar explorando talleres creativos.";

  headerInfo.appendChild(title);
  headerInfo.appendChild(subtitle);

  const form = document.createElement("form");
  form.className =
    "bg-white dark:bg-[#1a1a1a] rounded-2xl shadow p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700";

  // Funtion to create inputs
  function createInput(type, id, placeholder) {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.className =
      "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
    input.id = id;
    return input;
  }

  // Email
  const emailDiv = document.createElement("div");
  const emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "login-email");
  emailLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  emailLabel.textContent = "Email";
  const emailInput = createInput(
    "email",
    "login-email",
    "Ingresa tu mejor email"
  );
  emailDiv.appendChild(emailLabel);
  emailDiv.appendChild(emailInput);

  // password
  const passwordDiv = document.createElement("div");
  const passwordLabel = document.createElement("label");
  passwordLabel.setAttribute("for", "login-password");
  passwordLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  passwordLabel.textContent = "Contraseña";
  const passwordInput = createInput(
    "password",
    "login-password",
    "Ingresa una contraseña segura"
  );
  passwordDiv.appendChild(passwordLabel);
  passwordDiv.appendChild(passwordInput);

  // send button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "mt-6 bg-[#ad5733] dark:bg-[#f49167] text-white dark:text-black font-bold py-2 px-6 rounded-full hover:bg-[#797b6c] dark:hover:bg-[#ad5733] transition";
  submitBtn.textContent = "Iniciar Sesión";

  // register text
  const signupText = document.createElement("p");
  signupText.className =
    "text-center text-sm mt-4 text-gray-600 dark:text-gray-400";

  const signupLink = document.createElement("a");
  signupLink.href = "/signup";
  signupLink.setAttribute("data-link", "");
  signupLink.id = "signup-link";
  signupLink.textContent = "¡Regístrate!";
  signupLink.className =
    "text-[#ad5733] dark:text-[#f49167] font-medium hover:underline transition-colors";

  signupText.appendChild(document.createTextNode("¿No tienes una cuenta? "));
  signupText.appendChild(signupLink);

  form.appendChild(emailDiv);
  form.appendChild(passwordDiv);
  form.appendChild(submitBtn);
  form.appendChild(signupText);

  wrapper.appendChild(headerInfo);
  wrapper.appendChild(form);
  container.appendChild(wrapper);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

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
        passwordInput.value = "";
      }
    } else {
      showToast("Error inesperado en el inicio de sesión", "error");
    }
  });
}
