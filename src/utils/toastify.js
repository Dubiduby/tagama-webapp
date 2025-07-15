import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function showToast({
  text = "Something happened",
  type = "success",
  duration = 3000,
  position = "right",
  gravity = "top",
} = {}) {
  const colors = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #ff416c, #ff4b2b)",
    info: "linear-gradient(to right, #2193b0, #6dd5ed)",
    warning: "linear-gradient(to right, #f7971e, #ffd200)",
  };

  Toastify({
    text,
    duration,
    close: true,
    gravity,
    position,
    style: {
      background: colors[type] || colors.info,
    },
  }).showToast();
}