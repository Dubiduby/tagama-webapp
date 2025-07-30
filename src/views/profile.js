import { getUserById, updateUserById, deleteUser } from "../api/apiUsers.js";
import { validation } from "../utils/validations.js";
import { showToast } from "../utils/toastify.js";
import Toastify from "toastify-js";

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
    container.appendChild($("p", { class: "text-center text-gray-600 mt-8" }, "No has iniciado sesión."));
    return;
  }

  const user = await getUserById(currentUser.id);

  const avatar = $("img", {
    class: "w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg",
    src:
      user.avatarUrl ||
      "https://res.cloudinary.com/demo/image/upload/v1699999999/user.png",
    alt: "Avatar",
  });

  // Icon edit image
  const editAvatarBtn = $(
    "button",
    {
      class: "absolute top-0 right-0 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-indigo-700 transition-colors shadow-md",
      onclick: () => {
        uploadSection.style.display = "flex";
      },
    },
    "✏️"
  );

  // Input y upload button
  const fileInput = $("input", {
    type: "file",
    accept: "image/*",
    class: "mt-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100",
  });

  const uploadBtn = $(
    "button",
    {
      class: "px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors",
      onclick: async () => {
        const file = fileInput.files[0];
        if (!file) return showToast("Selecciona una imagen", "info");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "profile_image");

        try {
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dpm2ylejh/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await res.json();

          if (data.secure_url) {
            avatar.src = data.secure_url;

            // Save new avatar image
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
      class: "flex flex-col gap-3 mt-4 p-4 bg-gray-50 rounded-lg",
      style: { display: "none" },
    },
    fileInput,
    uploadBtn
  );

  const sidebar = $(
    "aside",
    { class: "w-80 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6" },
    $(
      "div",
      { class: "flex flex-col items-center" },
      $(
        "div",
        { class: "relative" },
        avatar,
        editAvatarBtn
      ),
      uploadSection,
      $(
        "div",
        { class: "w-full text-center" },
        $("span", { class: "block text-xl font-bold text-gray-800 mb-1" }, user.name),
        $("span", { class: "block text-gray-600 text-sm" }, user.email),
        // Título de Talleres
        $("h3", { class: "text-lg font-semibold text-gray-800 mt-6 mb-4" }, "Talleres"),
        // Contadores de workshops
        $(
          "div",
          { class: "grid grid-cols-3 gap-4" },
          $(
            "div",
            { class: "text-center" },
            $(
              "span",
              { class: "block text-2xl font-bold text-indigo-600" },
              user.enrolledWorkshops ? user.enrolledWorkshops.length : 0
            ),
            $("span", { class: "text-sm text-gray-600" }, "Inscritos")
          ),
          $(
            "div",
            { class: "text-center" },
            $(
              "span",
              { class: "block text-2xl font-bold text-green-600" },
              user.createdWorkshops ? user.createdWorkshops.length : 0
            ),
            $("span", { class: "text-sm text-gray-600" }, "Creados")
          ),
          $(
            "div",
            { class: "text-center" },
            $(
              "span",
              { class: "block text-2xl font-bold text-yellow-600" },
              user.savedWorkshops ? user.savedWorkshops.length : 0
            ),
            $("span", { class: "text-sm text-gray-600" }, "Guardados")
          )
        )
      )
    ),
    $(
      "button",
      {
        class: "w-full px-4 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors",
        onclick: () => {
          localStorage.removeItem("currentUser");
          window.location.href = "/login";
        },
      },
      "Cerrar sesión"
    )
  );

  // Función para crear inputs con estilos consistentes
  function createInput(type, id, placeholder) {
    return $("input", {
      type: type,
      placeholder: placeholder,
      class: "w-full px-4 py-3 border border-gray-300 rounded-md text-base bg-gray-50 focus:border-indigo-500 focus:outline-none focus:bg-white transition-colors",
      id: id,
    });
  }

  const nameInput = createInput("text", "profile-name", user.name);
  const emailInput = createInput("email", "profile-email", user.email);
  const passInput = createInput("password", "profile-password", "********");
  const repeatInput = createInput("password", "profile-repeat", "Repetir contraseña");

  const cancelBtn = $(
    "button",
    { 
      type: "button", 
      class: "px-6 py-3 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors" 
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

  const form = $(
    "form",
    {
      class: "space-y-6",
      onsubmit: async (e) => {
        e.preventDefault();

        const newName = nameInput.value ? nameInput.value : user.name;
        const newEmail = emailInput.value ? emailInput.value : user.email;
        const newPassword = passInput.value ? passInput.value : user.password;
        const newRepeat = repeatInput.value ? repeatInput.value : user.password;

        if (
          !validation({
            name: newName,
            email: newEmail,
            password: newPassword,
          })
        ) {
          return;
        }

        if (passInput.value && passInput.value !== repeatInput.value) {
          showToast("Las contraseñas no coinciden.", "error");
          return;
        }

        const updatedUser = {
          ...user,
          name: newName,
          email: newEmail,
          password: newPassword,
        };

        if (
          newName === user.name &&
          newEmail === user.email &&
          !passInput.value
        ) {
          showToast("No hay cambios para guardar.", "info");
          return;
        }

        try {
          const result = await updateUserById(user.id, updatedUser);
          localStorage.setItem("currentUser", JSON.stringify(result));
          showToast("¡Perfil actualizado!", "success");
          setTimeout(() => window.location.reload(), 1200);
        } catch (err) {
          showToast("Error al actualizar el perfil.", "error");
        }
      },
    },

    $("label", { for: "profile-name", class: "block text-base font-medium text-gray-700 mb-2" }, "Nombre"),
    nameInput,
    $("label", { for: "profile-email", class: "block text-base font-medium text-gray-700 mb-2" }, "Email"),
    emailInput,
    $("label", { for: "profile-password", class: "block text-base font-medium text-gray-700 mb-2" }, "Contraseña"),
    passInput,
    $("label", { for: "profile-repeat", class: "block text-base font-medium text-gray-700 mb-2" }, "Repetir contraseña"),
    repeatInput,
    $("button", { type: "submit", class: "w-full px-6 py-3 bg-indigo-600 text-white rounded-md text-lg font-semibold hover:bg-indigo-700 transition-colors" }, "Guardar cambios"),
    cancelBtn
  );

  let deleteToastId = null;
  const deleteBtn = $(
    "button",
    {
      class: "w-full px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors",
      onclick: () => {
        if (deleteToastId) return;
        deleteToastId = Toastify({
          text: `
          <span>¿Estás seguro de que quieres eliminar tu cuenta?</span>
          <button id="confirm-delete-btn" style="margin-left:10px;padding:4px 10px;background:#ef4444;color:#fff;border:none;border-radius:4px;cursor:pointer;">Sí, eliminar</button>
        `,
          duration: 3000,
          gravity: "top",
          position: "center",
          close: true,
          escapeMarkup: false,
          backgroundColor: "#fff0f0",
          stopOnFocus: true,
          callback: () => {
            deleteToastId = null;
          },
        }).showToast();

        setTimeout(() => {
          const confirmBtn = document.getElementById("confirm-delete-btn");
          if (confirmBtn) {
            confirmBtn.onclick = async (e) => {
              e.stopPropagation();
              await deleteUser(user.id);
              localStorage.clear();
              showToast("¡Cuenta eliminada!", "success");
              setTimeout(() => (window.location.href = "/login"), 1200);
            };
          }
        }, 100);
      },
    },
    "ELIMINAR CUENTA"
  );

  const dangerArea = $(
    "div",
    { class: "mt-8 p-6 bg-red-50 border border-red-200 rounded-lg" },
    $("h4", { class: "text-lg font-semibold text-red-800 mb-4" }, "Zona de peligro"),
    deleteBtn
  );

  const layout = $(
    "div",
    { class: "max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8" },
    sidebar,
    $(
      "main",
      { class: "lg:col-span-2 bg-white rounded-xl shadow-lg p-8" },
      $("h2", { class: "text-2xl font-bold text-gray-800 mb-6" }, "Editar perfil"),
      form,
      dangerArea
    )
  );

  container.appendChild(layout);
}
