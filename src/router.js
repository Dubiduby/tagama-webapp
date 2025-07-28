import { getCurrentUser } from "./api/apiUsers.js";

const routes = {
  "/login": () => import("./views/login.js"),
  "/signup": () => import("./views/signup.js"),
  "/home": () => import("./views/home.js"),
  "/workshops/:id": () => import("./views/detail.js"),
  "/workshops": () => import("./views/workshops.js"),
  "/profile": () => import("./views/profile.js"),
  "/notfound": () => import("./views/notfound.js"),
  "/contact": () => import("./views/contact.js"),
};

//routes that require login
const privatePages = ["/home", "/profile", "/workshops"];

export async function router() {
  const path = window.location.pathname;
  const view = routes[path];
  const container = document.getElementById("app");
  const currentUser = getCurrentUser();

  // Se inyecta la navbar antes de la vista
  const header = document.getElementById("header");
  const navbarModule = await import("./components/navbar.js");
  navbarModule.default(header);

  //matching routes for dinamic paths in case to add more dinamic routes in the future
  function matchRoute(path) {
    for (const route in routes) {
      if (route.includes("/:id")) {
        const base = route.split("/:id")[0];
        if (path.startsWith(base + "/")) {
          const id = path.split("/")[2];
          return { view: routes[route], params: { id } };
        }
      } else if (route === path) {
        return { view: routes[route], params: {} };
      }
    }
    return null;
  }

  const match = matchRoute(path);

  //private routes for dinamic paths
  const isPrivate = privatePages.some((page) => path.startsWith(page));
  if (isPrivate && !currentUser) {
    navigate("/login");
    return;
  }

  if (match) {
    const module = await match.view();
    // Pasa el parámetro id si existe
    match.params.id
      ? module.default(container, match.params.id)
      : module.default(container);
  } else {
    const module = await import("./views/notfound.js"); //load not found if the view doesn't exist
    module.default(container);
  }
}

//Función navigate para utilizar navigate(/home) por ejemplo cuando se quiera redirigir a una página --------------------------------

export function navigate(path) {
  history.pushState(null, "", path); //change the URL in the browser without reloading the page.
  router();
}

//Función handleLinks para que maneje los enlaces a otras páginas--------------------------------------------------------------------------

export function handleLinks() {
  //en vez de poner un listener en cada enlace, se pone uno solo en el body y se capturan todos los clics que ocurren dentro. (delegación de eventos)

  document.body.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-link]"); //busca el evento más cercano al que se hizo click que sea un a con el atributo data-link
    if (link) {
      console.log("SPA link clicked:", link.href);
      event.preventDefault();
      navigate(link.getAttribute("href"));
    }
  });
  window.addEventListener("popstate", router); //Esto hace que cuando el usuario use los botones de "atrás" o "adelante", se llame a la función router para mostrar la vista correspondiente a la URL actual.
}
