import "../assets/styles/login.css";
import { getUsers } from "../api/apiUsers";
import {toastify}

export default function login(container) {
  //Dentro de esta función iría todo el contenido de login
  container.innerHTML = "";

  const app = document.getElementById("app");

  const loginContainer = document.createElement("div");
  loginContainer.classList.add("login-container");
  const loginForm = document.createElement("form");
  loginForm.classList.add("login-form");
  const loginEmail = document.createElement("input");
  loginEmail.type = "email";
  loginEmail.placeholder = "Enter your best email";
  loginEmail.name = "email";
  const loginPassword = document.createElement("input");
  loginPassword.type = "password";
  loginPassword.placeholder = "Enter a save password";
  loginPassword.name = "password";

  loginForm.appendChild(loginEmail);
  loginForm.appendChild(loginPassword);
  loginContainer.appendChild(loginForm);
  app.appendChild(loginContainer);

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;
    
    const users = await getUsers();




  });
}
