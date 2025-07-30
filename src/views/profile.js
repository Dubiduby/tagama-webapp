import "../assets/styles/profile.css";
import { getUserById, updateUserById, deleteUser } from "../api/apiUsers.js";
import { validation } from "../utils/validations.js";
import { showToast } from "../utils/toastify.js";
import Toastify from "toastify-js"; // Si necesitas HTML personalizado

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
    container.appendChild($("p", {}, "No has iniciado sesión."));
    return;
  }

  const user = await getUserById(currentUser.id);

  const avatar = $("img", {
    class: "profile-avatar",
    src:
      user.avatarUrl ||
      "https://res.cloudinary.com/demo/image/upload/v1699999999/user.png",
    alt: "Avatar",
  });

  // Icon edit image
  const editAvatarBtn = $(
    "button",
    {
      class: "edit-avatar-btn",
      onclick: () => {
        uploadSection.style.display = "flex";
      },
    },
    "🖊️"
  );

  // Input y upload button
  const fileInput = $("input", {
    type: "file",
    accept: "image/*",
    style: { marginTop: "10px" },
  });

  const uploadBtn = $(
    "button",
    {
      class: "upload-btn",
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
      class: "upload-avatar-section",
      style: { display: "none", flexDirection: "column", gap: "10px" },
    },
    fileInput,
    uploadBtn
  );

  const sidebar = $(
    "aside",
    { class: "profile-sidebar" },
    $(
      "div",
      { class: "profile-avatar-box" },
      avatar,
      editAvatarBtn,
      uploadSection,
      $(
        "div",
        { class: "profile-user-data" },
        $("span", { class: "profile-user-label" }, user.name),
        $("span", { class: "profile-user-value" }, user.email),
        // Título de Talleres
        $("h3", { class: "profile-workshop-title" }, "Talleres"),
        // Contadores de workshops
        $(
          "div",
          { class: "profile-workshop-counts" },
          $(
            "div",
            { class: "profile-count" },
            $(
              "span",
              { class: "profile-count-number" },
              user.enrolledWorkshops ? user.enrolledWorkshops.length : 0
            ),
            $("span", { class: "profile-count-label" }, " Inscritos")
          ),
          $(
            "div",
            { class: "profile-count" },
            $(
              "span",
              { class: "profile-count-number" },
              user.createdWorkshops ? user.createdWorkshops.length : 0
            ),
            $("span", { class: "profile-count-label" }, " Creados")
          ),
          $(
            "div",
            { class: "profile-count" },
            $(
              "span",
              { class: "profile-count-number" },
              user.savedWorkshops ? user.savedWorkshops.length : 0
            ),
            $("span", { class: "profile-count-label" }, " Guardados")
          )
        )
      )
    ),
    $(
      "button",
      {
        class: "logout-btn",
        onclick: () => {
          localStorage.removeItem("currentUser");
          window.location.href = "/login";
        },
      },
      "Cerrar sesión"
    )
  );

  const nameInput = $("input", {
    type: "text",
    placeholder: user.name,
    class: "profile-input",
    id: "profile-name",
  });
  const emailInput = $("input", {
    type: "email",
    placeholder: user.email,
    class: "profile-input",
    id: "profile-email",
  });
  const passInput = $("input", {
    type: "password",
    placeholder: "********",
    class: "profile-input",
    id: "profile-password",
  });
  const repeatInput = $("input", {
    type: "password",
    placeholder: "Repetir contraseña",
    class: "profile-input",
    id: "profile-repeat",
  });

  const cancelBtn = $(
    "button",
    { type: "button", class: "cancel-btn" },
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
      class: "profile-form",
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

    $("label", { for: "profile-name" }, "Nombre"),
    nameInput,
    $("label", { for: "profile-email" }, "Email"),
    emailInput,
    $("label", { for: "profile-password" }, "Contraseña"),
    passInput,
    $("label", { for: "profile-repeat" }, "Repetir contraseña"),
    repeatInput,
    $("button", { type: "submit", class: "save-btn" }, "Guardar cambios"),
    cancelBtn
  );

  let deleteToastId = null;
  const deleteBtn = $(
    "button",
    {
      class: "delete-btn",
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
    { class: "danger-area" },
    $("h4", {}, "Zona de peligro"),
    deleteBtn
  );

  const layout = $(
    "div",
    { class: "profile-layout" },
    sidebar,
    $(
      "main",
      { class: "profile-main" },
      $("h2", {}, "Editar perfil"),
      form,
      dangerArea
    )
  );

  container.appendChild(layout);
}
