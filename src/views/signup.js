import { createNewUser } from "../api/apiUsers.js";
import { showToast } from "../utils/toastify.js";
import { navigate } from "../router.js";
import { showSpinner, hideSpinner } from "../components/spinner.js";
import { validation } from "../utils/validations.js";

export default function signUp(container) {
  container.innerHTML = "";

  // Wrapper principal centered
  const wrapper = document.createElement("div");
  wrapper.className = "max-w-md mx-auto px-4 pt-12 pb-18 md:pt-0";

  // title subtitle centered on top
  const headerInfo = document.createElement("div");
  headerInfo.className = "text-center mb-8";

  const title = document.createElement("h1");
  title.className =
    "text-3xl md:text-4xl font-extrabold text-[#1e1d1d] dark:text-white mb-4";
  title.textContent = "Únete a Tagama";

  const subtitle = document.createElement("p");
  subtitle.className =
    "text-lg text-[var(--color-gray)] dark:text-[var(--color-text)] mb-6";
  subtitle.textContent =
    "Crea tu cuenta y comienza a explorar talleres creativos increíbles.";

  headerInfo.appendChild(title);
  headerInfo.appendChild(subtitle);

  const form = document.createElement("form");
  form.className =
    "bg-white dark:bg-[#1a1a1a] rounded-2xl shadow p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700";

  function createInput(type, id, placeholder) {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.className =
      "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
    input.id = id;
    return input;
  }

  // Name
  const nameDiv = document.createElement("div");
  const nameLabel = document.createElement("label");
  nameLabel.setAttribute("for", "signup-name");
  nameLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  nameLabel.textContent = "Nombre";
  const nameInput = createInput("text", "signup-name", "Tu nombre completo");
  nameDiv.appendChild(nameLabel);
  nameDiv.appendChild(nameInput);

  // Email
  const emailDiv = document.createElement("div");
  const emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "signup-email");
  emailLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  emailLabel.textContent = "Email";
  const emailInput = createInput("email", "signup-email", "tu@email.com");
  emailDiv.appendChild(emailLabel);
  emailDiv.appendChild(emailInput);

  // password
  const passwordDiv = document.createElement("div");
  const passwordLabel = document.createElement("label");
  passwordLabel.setAttribute("for", "signup-password");
  passwordLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  passwordLabel.textContent = "Contraseña";
  const passwordInput = createInput(
    "password",
    "signup-password",
    "Mínimo 6 caracteres"
  );
  passwordDiv.appendChild(passwordLabel);
  passwordDiv.appendChild(passwordInput);

  // Repeat password
  const repeatDiv = document.createElement("div");
  const repeatLabel = document.createElement("label");
  repeatLabel.setAttribute("for", "signup-repeat");
  repeatLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  repeatLabel.textContent = "Repetir contraseña";
  const repeatInput = createInput(
    "password",
    "signup-repeat",
    "Confirma tu contraseña"
  );
  repeatDiv.appendChild(repeatLabel);
  repeatDiv.appendChild(repeatInput);

  //register button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "mt-6 bg-[#ad5733] dark:bg-[#f49167] text-white dark:text-black font-bold py-2 px-6 rounded-full hover:bg-[#797b6c] dark:hover:bg-[#ad5733] transition";
  submitBtn.textContent = "Crear cuenta";

  // login text
  const loginText = document.createElement("p");
  loginText.className =
    "text-center text-sm mt-4 text-gray-600 dark:text-gray-400";

  const loginLink = document.createElement("a");
  loginLink.href = "/login";
  loginLink.setAttribute("data-link", "");
  loginLink.id = "login-link";
  loginLink.textContent = "¡Inicia sesión!";
  loginLink.className =
    "text-[#ad5733] dark:text-[#f49167] font-medium hover:underline transition-colors";

  loginText.appendChild(document.createTextNode("¿Ya tienes una cuenta? "));
  loginText.appendChild(loginLink);

  // add fields to the form
  form.appendChild(nameDiv);
  form.appendChild(emailDiv);
  form.appendChild(passwordDiv);
  form.appendChild(repeatDiv);
  form.appendChild(submitBtn);
  form.appendChild(loginText);

  wrapper.appendChild(headerInfo);
  wrapper.appendChild(form);
  container.appendChild(wrapper);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const signupName = nameInput.value.trim();
      const signupEmail = emailInput.value.trim();
      const signupPassword = passwordInput.value.trim();
      const signupRepPassword = repeatInput.value.trim();

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
