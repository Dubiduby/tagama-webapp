const routes = {
  "/login": () => import("./views/login.js"),
  "/signup": () => import("./views/signup.js"),
  "/home": () => import("./views/home.js"),
  "/detail": () => import("./views/detail.js"),
  "/workshops": () => import("./views/workshops.js"),
  "/profile": () => import("./views/profile.js"),
  "/notfound": () => import("./views/notfound.js"),
};

export async function router() {
  const path = window.location.pathname;
  const view = routes[path];
  const container = document.getElementById("app");

  // Se inyecta la navbar antes de la vista
  const header = document.getElementById("header");
  const navbarModule = await import("./components/navbar.js");
  navbarModule.default(header);

  if (view) {
    const module = await view();
    module.default(container);
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
      event.preventDefault();
      navigate(link.getAttribute("href"));
    }
  });
  window.addEventListener("popstate", router); //Esto hace que cuando el usuario use los botones de "atrás" o "adelante", se llame a la función router para mostrar la vista correspondiente a la URL actual.
}
