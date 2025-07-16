import { showToast } from "./toastify";



export function validation({ name, email, password }) {
  if (name !== undefined) {
    const regexName = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/;
    if (!name || name.length < 2 || name.length > 30 || !regexName.test(name)) {
      showToast("The name must contain only letters and spaces, with a minimum of 2 letters.","error",
      );

      return false;
    }
  }

  if (email !== undefined) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regexEmail.test(email)) {
      showToast("Invalid email.","error",
      );

      return false;
    }
  }

  if (password !== undefined) {
    const regexPassword = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

    if (!regexPassword.test(password)) {
      showToast("The password must be longer than 6 characters and contain at least one number and one letter.","error",
      );

      return false;
    }
  }

  return true;
}
