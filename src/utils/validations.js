import { showToast } from "./toastify";

export function validation({ name, email, password }) {
  if (name !== undefined) {
    const regexName = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/;
    if (!name || name.length < 2 || name.length > 30 || !regexName.test(name)) {
      showToast(
        "El nombre debe contener solo letras y espacios, con un mínimo de 2 letras.",
        "error"
      );

      return false;
    }
  }

  if (email !== undefined) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regexEmail.test(email)) {
      showToast("Email inválido.", "error");

      return false;
    }
  }

  if (password !== undefined) {
    const regexPassword = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

    if (!regexPassword.test(password)) {
      showToast(
        "La contraseña debe tener más de 6 caracteres y contener al menos un número y una letra.",
        "error"
      );

      return false;
    }
  }

  return true;
}
