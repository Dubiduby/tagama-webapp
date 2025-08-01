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
  "/about": () => import("./views/aboutUs.js"),
  "/": () => import("./views/landing.js"),
};

//routes that require login
const privatePages = ["/home", "/profile", "/workshops"];

export async function router() {
  const path = window.location.pathname;
  const view = routes[path];
  const container = document.getElementById("app");
  const currentUser = getCurrentUser();

  // navbar injection before everything
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

  //if user is logged in and wants to go to "/"
  if (path === "/" && currentUser) {
    navigate("/home");
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

export function navigate(path) {
  history.pushState(null, "", path); //change the URL in the browser without reloading the page.
  router();
}

export function handleLinks() {
  document.body.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-link]");
    if (link) {
      console.log("SPA link clicked:", link.href);
      event.preventDefault();
      navigate(link.getAttribute("href"));
    }
  });
  window.addEventListener("popstate", router); //for back a forward buttons
}
