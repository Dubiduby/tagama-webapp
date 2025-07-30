import { createNewUser } from "../api/apiUsers.js";
import { showToast } from "../utils/toastify.js";
import { navigate } from "../router.js";
import { showSpinner, hideSpinner } from "../components/spinner.js";
import { validation } from "../utils/validations.js";

export default function signUp(container) {
  container.innerHTML = "";

  // Contenedor principal
  const newUserDiv = document.createElement("div");
  newUserDiv.className = "max-w-sm mx-auto mt-16 p-10 bg-white rounded-xl shadow-lg flex flex-col items-center";
  container.appendChild(newUserDiv);

  // Formulario
  const form = document.createElement("form");
  form.className = "w-full flex flex-col gap-4";
  newUserDiv.appendChild(form);

  // Título
  const h1 = document.createElement("h1");
  h1.className = "text-center text-3xl font-bold mb-5 text-indigo-600";
  h1.textContent = "Registro";
  form.appendChild(h1);

  // Función para crear inputs con estilos consistentes
  function createInput(type, id, name, labelText, required = true) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.className = "text-base text-gray-700 mb-1";
    label.innerHTML = `${labelText} <span class="text-red-500">*</span>`;

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = name;
    input.required = required;
    input.className = "px-4 py-3 border border-gray-300 rounded-md text-base bg-gray-50 focus:border-indigo-500 focus:outline-none focus:bg-white transition-colors";

    return { label, input };
  }

  // Crear inputs
  const { label: labelName, input: inputName } = createInput("text", "signup-name", "name", "Nombre");
  const { label: labelEmail, input: inputEmail } = createInput("email", "signup-email", "email", "Email");
  const { label: labelPassword, input: inputPassword } = createInput("password", "signup-password", "password", "Contraseña");
  const { label: labelRepeat, input: inputRepeat } = createInput("password", "signup-repeat", "repeat", "Repetir contraseña");

  // Agregar inputs al formulario
  form.appendChild(labelName);
  form.appendChild(inputName);
  form.appendChild(labelEmail);
  form.appendChild(inputEmail);
  form.appendChild(labelPassword);
  form.appendChild(inputPassword);
  form.appendChild(labelRepeat);
  form.appendChild(inputRepeat);

  // Texto pequeño
  const small = document.createElement("small");
  small.className = "text-sm text-gray-600 text-center";
  small.textContent = "(*) Todos los campos son obligatorios.";
  form.appendChild(small);

  // Botón de registro
  const button = document.createElement("button");
  button.type = "submit";
  button.className = "px-4 py-3 bg-indigo-600 text-white rounded-md text-lg font-semibold cursor-pointer hover:bg-indigo-700 transition-colors";
  button.textContent = "Registrarse";
  form.appendChild(button);

  // Texto de login
  const loginText = document.createElement("p");
  loginText.className = "text-center text-sm mt-2 text-gray-600";
  
  const loginLink = document.createElement("a");
  loginLink.href = "/login";
  loginLink.setAttribute("data-link", "");
  loginLink.id = "login-link";
  loginLink.textContent = "¡Inicia sesión!";
  loginLink.className = "text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors";

  loginText.innerHTML = "¿Ya tienes una cuenta? ";
  loginText.appendChild(loginLink);
  form.appendChild(loginText);

  // Event listener para el formulario
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
