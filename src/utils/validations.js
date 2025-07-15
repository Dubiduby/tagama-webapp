import { showToast } from "./toastify";



export function validation({ name, email, password }) {
  if (name !== undefined) {
    const regexName = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,50}$/;
    if ((name.length < 2 && name.length > 30) || !name) {
      showToast({
        text: "The name must contain only letters and spaces, with a minimum of 2 letters.",
        type: "error",
      });

      return false;
    }
  }

  if (email !== undefined) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regexEmail.test(email)) {
      showToast({
        text: "Invalid email.",
        type: "error",
      });

      return false;
    }
  }

  if (password !== undefined) {
    const regexPassword = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

    if (!regexPassword.test(password)) {
      showToast({
        text: "The password must be longer than 6 characters and contain at least one number and one letter.",
        type: "error",
      });

      return false;
    }
  }

  return true;
}
