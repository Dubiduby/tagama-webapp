import { getUserById, updateUserById, deleteUser } from "../api/apiUsers.js";
import { validation } from "../utils/validations.js";
import { showToast } from "../utils/toastify.js";
import { showConfirmModal } from "../components/modals/confirmModal.js";

export default async function profile(container) {
  function $(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k.startsWith("on") && typeof v === "function") {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (k === "class") {
        el.className = v;
      } else if (k === "style" && typeof v === "object") {
        Object.assign(el.style, v);
      } else if (k === "for") {
        el.htmlFor = v;
      } else {
        el.setAttribute(k, v);
      }
    });
    children.flat().forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
    return el;
  }

  container.innerHTML = "";

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    container.appendChild(
      $(
        "p",
        { class: "text-center text-gray-600 dark:text-gray-400 mt-8" },
        "No has iniciado sesión."
      )
    );
    return;
  }

  const user = await getUserById(currentUser.id);

  const wrapper = $("div", { class: "max-w-5xl mx-auto px-4 py-12" });

  const flexDiv = $("div", {
    class: "flex flex-col md:flex-row gap-8 items-start",
  });

  const sidebarDiv = $("div", { class: "md:w-1/3 w-full mb-8 px-2 md:mb-0" });

  const avatar = $("img", {
    class:
      "w-32 h-32 rounded-full object-cover border-4 border-gray dark:border-gray-700 shadow-lg mx-auto mb-4",
    src:
      user.avatarUrl ||
      "https://res.cloudinary.com/demo/image/upload/v1699999999/user.png",
    alt: "Avatar",
  });

  const editAvatarBtn = document.createElement("button");
  editAvatarBtn.className =
    "absolute top-0 right-0 bg-[#ad5733] dark:bg-[#f49167] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-[#797b6c] dark:hover:bg-[#ad5733] transition-colors shadow-md";
  editAvatarBtn.onclick = () => {
    uploadSection.style.display = "flex";
  };
  editAvatarBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-white dark:text-dark-bg">
  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
</svg>`;

  const fileInput = $("input", {
    type: "file",
    accept: "image/*",
    class:
      "mt-2 text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ad5733] dark:file:bg-[#f49167] file:text-white hover:file:bg-[#797b6c] dark:hover:file:bg-[#ad5733]",
  });

  const uploadBtn = $(
    "button",
    {
      class:
        "px-4 py-2 bg-[#ad5733] dark:bg-[#f49167] text-white rounded-full text-sm font-medium hover:bg-[#797b6c] dark:hover:bg-[#ad5733] transition-colors",
      onclick: async () => {
        const file = fileInput.files[0];
        if (!file) return showToast("Selecciona una imagen", "info");

        const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const UPLOAD_PRESET_PROFILE = import.meta.env
          .VITE_CLOUDINARY_UPLOAD_PRESET_PROFILE;
        const urlCloudinary = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET_PROFILE);

        try {
          const res = await fetch(urlCloudinary, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (data.secure_url) {
            avatar.src = data.secure_url;

            const updatedUser = { ...user, avatarUrl: data.secure_url };
            await updateUserById(user.id, updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            showToast("¡Foto actualizada!", "success");
            uploadSection.style.display = "none";
          } else {
            showToast("Error al subir la imagen", "error");
          }
        } catch (err) {
          console.error(err);
          showToast("Fallo de red", "error");
        }
      },
    },
    "Subir nueva foto"
  );

  const uploadSection = $(
    "div",
    {
      class:
        "flex flex-col gap-3 mt-4 p-4 bg-gray-50 dark:bg-[#141414] rounded-lg border border-gray-200 dark:border-gray-700",
      style: { display: "none" },
    },
    fileInput,
    uploadBtn
  );

  const userInfo = $(
    "div",
    { class: "text-center mb-6" },
    $(
      "h1",
      {
        class:
          "text-3xl md:text-4xl font-extrabold text-[#1e1d1d] dark:text-white mb-4",
      },
      "Mi Perfil"
    ),
    $("div", { class: "relative inline-block" }, avatar, editAvatarBtn),
    uploadSection,
    $(
      "h2",
      { class: "text-xl font-bold text-[#1e1d1d] dark:text-white mb-2" },
      user.name
    ),
    $(
      "p",
      { class: "text-[var(--color-gray)] dark:text-[var(--color-text)] mb-4" },
      user.email
    ),

    $(
      "div",
      { class: "grid grid-cols-3 gap-4 mt-6" },
      $(
        "div",
        { class: "text-center" },
        $(
          "span",
          {
            class:
              "block text-2xl font-bold text-[#ad5733] dark:text-[#f49167]",
          },
          user.enrolledWorkshops ? user.enrolledWorkshops.length : 0
        ),
        $(
          "span",
          {
            class:
              "text-sm text-[var(--color-gray)] dark:text-[var(--color-text)]",
          },
          "Inscritos"
        )
      ),
      $(
        "div",
        { class: "text-center" },
        $(
          "span",
          {
            class:
              "block text-2xl font-bold text-[#ad5733] dark:text-[#f49167]",
          },
          user.createdWorkshops ? user.createdWorkshops.length : 0
        ),
        $(
          "span",
          {
            class:
              "text-sm text-[var(--color-gray)] dark:text-[var(--color-text)]",
          },
          "Creados"
        )
      ),
      $(
        "div",
        { class: "text-center" },
        $(
          "span",
          {
            class:
              "block text-2xl font-bold text-[#ad5733] dark:text-[#f49167]",
          },
          user.savedWorkshops ? user.savedWorkshops.length : 0
        ),
        $(
          "span",
          {
            class:
              "text-sm text-[var(--color-gray)] dark:text-[var(--color-text)]",
          },
          "Guardados"
        )
      )
    )
  );

  const logoutBtn = $(
    "button",
    {
      class:
        "w-full mt-6 bg-[#797b6c] dark:bg-[#797b6c] text-white font-bold py-2 px-6 rounded-full hover:bg-[#ad5733] dark:hover:bg-[#f49167] transition",
      onclick: () => {
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
      },
    },
    "Cerrar sesión"
  );

  sidebarDiv.appendChild(userInfo);
  sidebarDiv.appendChild(logoutBtn);

  const formDiv = $("div", { class: "md:w-2/3 w-full" });
  const form = $("form", {
    class:
      "bg-white dark:bg-[#1a1a1a] rounded-2xl shadow p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700",
    onsubmit: async (e) => {
      e.preventDefault();

      const updatedUser = { ...user };
      let hasChanges = false;

      if (nameInput.value && nameInput.value !== user.name) {
        updatedUser.name = nameInput.value;
        hasChanges = true;
      }

      if (emailInput.value && emailInput.value !== user.email) {
        updatedUser.email = emailInput.value;
        hasChanges = true;
      }

      if (passInput.value && passInput.value !== user.password) {
        if (passInput.value !== repeatInput.value) {
          showToast("Las contraseñas no coinciden.", "error");
          return;
        }
        updatedUser.password = passInput.value;
        hasChanges = true;
      }

      const fieldsToValidate = {};
      if (updatedUser.name !== user.name)
        fieldsToValidate.name = updatedUser.name;
      if (updatedUser.email !== user.email)
        fieldsToValidate.email = updatedUser.email;
      if (updatedUser.password !== user.password)
        fieldsToValidate.password = updatedUser.password;

      if (Object.keys(fieldsToValidate).length > 0) {
        if (!validation(fieldsToValidate)) {
          return;
        }
      }

      if (!hasChanges) {
        showToast("No hay cambios para guardar.", "info");
        return;
      }

      try {
        const result = await updateUserById(user.id, updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(result));
        showToast("¡Perfil actualizado!", "success");

        if (updatedUser.name !== user.name) nameInput.value = "";
        if (updatedUser.email !== user.email) emailInput.value = "";
        if (updatedUser.password !== user.password) {
          passInput.value = "";
          repeatInput.value = "";
        }

        setTimeout(() => window.location.reload(), 1200);
      } catch (err) {
        showToast("Error al actualizar el perfil.", "error");
      }
    },
  });

  function createInput(type, id, placeholder) {
    return $("input", {
      type: type,
      placeholder: placeholder,
      class:
        "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
      id: id,
    });
  }

  const nameDiv = $("div");
  const nameLabel = $(
    "label",
    {
      for: "profile-name",
      class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300",
    },
    "Nombre"
  );
  const nameInput = createInput("text", "profile-name", user.name);
  nameDiv.appendChild(nameLabel);
  nameDiv.appendChild(nameInput);

  const emailDiv = $("div");
  const emailLabel = $(
    "label",
    {
      for: "profile-email",
      class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300",
    },
    "Email"
  );
  const emailInput = createInput("email", "profile-email", user.email);
  emailDiv.appendChild(emailLabel);
  emailDiv.appendChild(emailInput);

  const passDiv = $("div");
  const passLabel = $(
    "label",
    {
      for: "profile-password",
      class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300",
    },
    "Contraseña"
  );
  const passInput = createInput("password", "profile-password", "********");
  passDiv.appendChild(passLabel);
  passDiv.appendChild(passInput);

  const repeatDiv = $("div");
  const repeatLabel = $(
    "label",
    {
      for: "profile-repeat",
      class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300",
    },
    "Repetir contraseña"
  );
  const repeatInput = createInput(
    "password",
    "profile-repeat",
    "Repetir contraseña"
  );
  repeatDiv.appendChild(repeatLabel);
  repeatDiv.appendChild(repeatInput);

  const cancelBtn = $(
    "button",
    {
      type: "button",
      class:
        "flex-1 bg-gray-500 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-600 transition",
    },
    "Cancelar"
  );
  cancelBtn.addEventListener("click", () => {
    nameInput.value = "";
    emailInput.value = "";
    passInput.value = "";
    repeatInput.value = "";
    showToast("Los cambios han sido cancelados.", "info");
  });

  const submitBtn = $(
    "button",
    {
      type: "submit",
      class:
        "flex-1 bg-[#ad5733] dark:bg-[#f49167] text-white font-bold py-2 px-6 rounded-full hover:bg-[#797b6c] dark:hover:bg-[#ad5733] transition",
    },
    "Guardar cambios"
  );

  const buttonContainer = $("div", { class: "flex gap-4 mt-6" });
  buttonContainer.appendChild(submitBtn);
  buttonContainer.appendChild(cancelBtn);

  const deleteBtn = $(
    "button",
    {
      class:
        "w-full bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition",
      onclick: () => {
        showConfirmModal({
          message: "¿Estás seguro de que quieres eliminar tu cuenta?",
          buttonText: "eliminar",
          buttonColor: "red",
          onConfirm: async () => {
            await deleteUser(user.id);
            localStorage.clear();
            showToast("¡Cuenta eliminada!", "success");
            setTimeout(() => (window.location.href = "/login"), 1200);
          },
          onCancel: () => {},
        });
      },
    },
    "ELIMINAR CUENTA"
  );

  const dangerArea = $(
    "div",
    {
      class:
        "mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg",
    },
    $(
      "h4",
      { class: "text-lg font-semibold text-red-800 dark:text-red-400 mb-4" },
      "Zona de peligro"
    ),
    deleteBtn
  );
  form.appendChild(nameDiv);
  form.appendChild(emailDiv);
  form.appendChild(passDiv);
  form.appendChild(repeatDiv);
  form.appendChild(buttonContainer);

  formDiv.appendChild(form);
  formDiv.appendChild(dangerArea);

  flexDiv.appendChild(sidebarDiv);
  flexDiv.appendChild(formDiv);
  wrapper.appendChild(flexDiv);
  container.appendChild(wrapper);
}
