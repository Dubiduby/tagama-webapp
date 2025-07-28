import "../assets/styles/profile.css";
import { getUserById, updateUserById, deleteUser } from "../api/apiUsers.js";
import { validation } from "../utils/validations.js";
import { showToast } from "../utils/toastify.js";
import Toastify from "toastify-js"; // Si necesitas HTML personalizado

export default async function profile(container) {
  
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
    });
    return el;
  }


  container.innerHTML = "";


  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    container.appendChild($("p", {}, "You are not logged in."));
    return;
  }


  const user = await getUserById(currentUser.id);


  const avatar = $("img", {
    class: "profile-avatar",
    src: user.avatarUrl || "https://res.cloudinary.com/demo/image/upload/v1699999999/user.png",
    alt: "Avatar"
  });


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


  const nameInput = $("input", {
    type: "text",
    placeholder: user.name,
    class: "profile-input",
    id: "profile-name"
  });
  const emailInput = $("input", {
    type: "email",
    placeholder: user.email,
    class: "profile-input",
    id: "profile-email"
  });
  const passInput = $("input", {
    type: "password",
    placeholder: "********",
    class: "profile-input",
    id: "profile-password"
  });
  const repeatInput = $("input", {
    type: "password",
    placeholder: "Repeat Password",
    class: "profile-input",
    id: "profile-repeat"
  });


  const cancelBtn = $("button", { type: "button", class: "cancel-btn" }, "Cancel");
  cancelBtn.addEventListener("click", () => {
    nameInput.value = "";
    emailInput.value = "";
    passInput.value = "";
    repeatInput.value = "";
    showToast("Changes have been canceled.", "info");
  });

  const form = $("form", { class: "profile-form", onsubmit: async e => {
    e.preventDefault();


    const newName = nameInput.value ? nameInput.value : user.name;
    const newEmail = emailInput.value ? emailInput.value : user.email;
    const newPassword = passInput.value ? passInput.value : user.password;
    const newRepeat = repeatInput.value ? repeatInput.value : user.password;


    if (!validation({
      name: newName,
      email: newEmail,
      password: newPassword
    })) {
      return;
    }

    if (passInput.value && passInput.value !== repeatInput.value) {
      showToast("Passwords do not match.", "error");
      return;
    }

    const updatedUser = {
      ...user,
      name: newName,
      email: newEmail,
      password: newPassword
    };

    if (
      newName === user.name &&
      newEmail === user.email &&
      !passInput.value
    ) {
      showToast("No changes to save.", "info");
      return;
    }

    try {
      const result = await updateUserById(user.id, updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(result));
      showToast("Profile updated!", "success");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      showToast("Error updating profile.", "error");
    }
  }},

    $("label", { for: "profile-name" }, "Name"),
    nameInput,
    $("label", { for: "profile-email" }, "Email"),
    emailInput,
    $("label", { for: "profile-password" }, "Password"),
    passInput,
    $("label", { for: "profile-repeat" }, "Repeat Password"),
    repeatInput,
    $("button", { type: "submit", class: "save-btn" }, "Save Changes"),
    cancelBtn
  );

  let deleteToastId = null;
  const deleteBtn = $("button", {
    class: "delete-btn",
    onclick: () => {
      if (deleteToastId) return;
      deleteToastId = Toastify({
        text: `
          <span>Are you sure you want to delete your account?</span>
          <button id="confirm-delete-btn" style="margin-left:10px;padding:4px 10px;background:#ef4444;color:#fff;border:none;border-radius:4px;cursor:pointer;">Yes, delete</button>
        `,
        duration: 3000,
        gravity: "top",
        position: "center",
        close: true,
        escapeMarkup: false,
        backgroundColor: "#fff0f0",
        stopOnFocus: true,
        callback: () => { deleteToastId = null; }
      }).showToast();

      setTimeout(() => {
        const confirmBtn = document.getElementById("confirm-delete-btn");
        if (confirmBtn) {
          confirmBtn.onclick = async (e) => {
            e.stopPropagation();
            await deleteUser(user.id);
            localStorage.clear();
            showToast("Account deleted!", "success");
            setTimeout(() => window.location.href = "/login", 1200);
          };
        }
      }, 100);
    }
  }, "DELETE ACCOUNT");

  const dangerArea = $("div", { class: "danger-area" },
    $("h4", {}, "Danger area"),
    deleteBtn
  );


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