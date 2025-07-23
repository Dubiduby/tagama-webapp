import "../assets/styles/profile.css";
import { getUserById, updateUserById, deleteUser } from "../api/apiUsers.js";
import { validation } from "../utils/validations.js";
import { showToast } from "../utils/toastify.js";

// Helper funcional para crear elementos
function $(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'class') {
      el.className = v;
    } else if (k === 'style' && typeof v === 'object') {
      Object.assign(el.style, v);
    } else if (k === 'for') {
      el.htmlFor = v;
    } else {
      el.setAttribute(k, v);
    }
  });
  children.flat().forEach(child => {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
    // Si no es string, number, ni Node, lo ignora
  });
  return el;
}

export default async function profile(container) {
  container.innerHTML = "";

  // Simulación: obtener usuario actual de localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    container.appendChild($("p", {}, "You are not logged in."));
    return;
  }

  // Obtener datos actualizados de MockAPI
  const user = await getUserById(currentUser.id);

  // Sidebar (avatar, nombre, email, stats, logout)
  const avatar = $("img", {
    class: "profile-avatar",
    src: user.avatarUrl || "https://res.cloudinary.com/demo/image/upload/v1699999999/user.png",
    alt: "Avatar"
  });
  const avatarEditBtn = $("button", { class: "avatar-edit-btn", title: "Change avatar" }, "✏️");

  const sidebar = $("aside", { class: "profile-sidebar" },
  $("div", { class: "profile-avatar-box" },
    avatar,
    $("div", { class: "profile-user-data" },
      $("span", { class: "profile-user-label" }, user.name),
      $("span", { class: "profile-user-value" }, user.email)
    )    
  ),
 

    $("button", {
      class: "logout-btn",
      onclick: () => {
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
      }
    }, "Logout")
  );

  // Formulario de edición
  const nameInput = $("input", { type: "text", value: user.name, class: "profile-input", id: "profile-name" });
  const emailInput = $("input", { type: "email", value: user.email, class: "profile-input", id: "profile-email" });
  const passInput = $("input", { type: "password", class: "profile-input", id: "profile-password" });
  const repeatInput = $("input", { type: "password", class: "profile-input", id: "profile-repeat" });

  const form = $("form", { class: "profile-form", onsubmit: async e => {
    e.preventDefault();
    if (!validation({
    name: nameInput.value,
    email: emailInput.value,
    password: passInput.value || user.password
  })) {
    // showToast ya muestra el error, solo retorna
    return;
  }

  // Solo actualiza los campos que han cambiado.
  const updatedUser = {};
  if (nameInput.value !== user.name) updatedUser.name = nameInput.value;
  if (emailInput.value !== user.email) updatedUser.email = emailInput.value;
  if (passInput.value) updatedUser.password = passInput.value;

  if (Object.keys(updatedUser).length === 0) {
    showToast("No changes to save.", "info");  
    return;
  }

   try {
    const result = await updateUserById(user.id, { ...user, ...updatedUser });
    localStorage.setItem("currentUser", JSON.stringify(result));
    showToast("Profile updated!", "success");
    setTimeout(() => window.location.reload(), 1200);
  } catch (err) {
    showToast("Error updating profile.", "error");
  }


  // Actualiza en MockAPI solo los campos cambiados
  const result = await updateUserById(user.id, { ...user, ...updatedUser });
  localStorage.setItem("currentUser", JSON.stringify(result));
  showToast("Profile updated!", "success");
  window.location.reload();
  }},
  
    $("label", { for: "profile-name" }, "Name"),
    nameInput,
    $("label", { for: "profile-email" }, "Email"),
    emailInput,
    $("label", { for: "profile-password" }, "Password"),
    passInput,
    $("label", { for: "profile-repeat" }, "Repeat Password"),
    repeatInput,
    $("button", { type: "submit", class: "save-btn" }, "Save Changes")
  );

  // Danger area
  const dangerArea = $("div", { class: "danger-area" },
    $("h4", {}, "Danger area"),
    $("button", {
      class: "delete-btn",
      onclick: async () => {
        if (window.confirm("Are you sure? This action will delete your account and is irreversible.")) {
          await deleteUser(user.id);
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }, "DELETE ACCOUNT")
  );

  // Layout principal
  const layout = $("div", { class: "profile-layout" },
    sidebar,
    $("main", { class: "profile-main" },
      $("h2", {}, "Edit profile"),
      form,
      dangerArea
    )
  );

  container.appendChild(layout);
}