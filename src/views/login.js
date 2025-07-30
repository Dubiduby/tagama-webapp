import { getUsers } from "../api/apiUsers";
import { showToast } from "../utils/toastify";
import { navigate } from "../router.js";

export default function login(container) {
  container.innerHTML = "";

  const app = document.getElementById("app");

  // Contenedor principal - usando Tailwind para estructura y colores
  const loginContainer = document.createElement("div");
  loginContainer.className = "max-w-sm mx-auto mt-16 p-10 bg-white rounded-xl shadow-lg flex flex-col items-center";
  
  // Formulario - usando Tailwind para estructura
  const loginForm = document.createElement("form");
  loginForm.className = "w-full flex flex-col gap-4";

  // Título - usando Tailwind para estructura y colores
  const h1 = document.createElement("h1");
  h1.id = "login-h1";
  h1.className = "text-center text-3xl font-bold mb-5 text-indigo-600";
  h1.textContent = "Inicio de sesión";

  // Función para crear inputs con estilos consistentes
  function createInput(type, id, placeholder, labelText) {
    const label = document.createElement("label");
    label.textContent = labelText;
    label.setAttribute("for", id);
    label.className = "text-base text-gray-700 mb-1";

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    input.name = type === "email" ? "email" : "password";
    input.className = "px-4 py-3 border border-gray-300 rounded-md text-base bg-gray-50 focus:border-indigo-500 focus:outline-none focus:bg-white transition-colors";

    return { label, input };
  }

  // Crear inputs
  const { label: emailLabel, input: loginEmail } = createInput("email", "login-email", "Ingresa tu mejor email", "Email:");
  const { label: passwordLabel, input: loginPassword } = createInput("password", "login-password", "Ingresa una contraseña segura", "Contraseña:");

  // Botón de envío - usando Tailwind para estructura y colores
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Iniciar Sesión";
  submitButton.className = "px-4 py-3 bg-indigo-600 text-white rounded-md text-lg font-semibold cursor-pointer hover:bg-indigo-700 transition-colors";

  // Texto de registro - usando Tailwind para estructura y colores
  const signupText = document.createElement("p");
  signupText.className = "text-center text-sm mt-2 text-gray-600";
  
  const signupLink = document.createElement("a");
  signupLink.href = "/signup";
  signupLink.setAttribute("data-link", "");
  signupLink.id = "signup-link";
  signupLink.textContent = "¡Regístrate!";
  signupLink.className = "text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors";

  signupText.innerHTML = "¿No tienes una cuenta? ";
  signupText.appendChild(signupLink);

  // Ensamblar el formulario
  loginForm.appendChild(h1);
  loginForm.appendChild(emailLabel);
  loginForm.appendChild(loginEmail);
  loginForm.appendChild(passwordLabel);
  loginForm.appendChild(loginPassword);
  loginForm.appendChild(submitButton);
  loginForm.appendChild(signupText);
  
  loginContainer.appendChild(loginForm);
  app.appendChild(loginContainer);

  // Event listener para el formulario
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

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
