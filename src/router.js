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

const privatePages = ["/home", "/profile", "/workshops"];

export async function router() {
  const path = window.location.pathname;
  const view = routes[path];
  const container = document.getElementById("app");
  const currentUser = getCurrentUser();

  const header = document.getElementById("header");
  const navbarModule = await import("./components/navbar.js");
  navbarModule.default(header);

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

  const isPrivate = privatePages.some((page) => path.startsWith(page));
  if (isPrivate && !currentUser) {
    navigate("/login");
    return;
  }

  if (path === "/" && currentUser) {
    navigate("/home");
    return;
  }

  if (match) {
    const module = await match.view();

    match.params.id
      ? module.default(container, match.params.id)
      : module.default(container);

    window.scrollTo(0, 0);
  } else {
    const module = await import("./views/notfound.js");
    module.default(container);
    window.scrollTo(0, 0);
  }
}

export function navigate(path) {
  history.pushState(null, "", path);
  router();
}

export function handleLinks() {
  document.body.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-link]");
    if (link) {
      event.preventDefault();
      navigate(link.getAttribute("href"));
    }
  });
  window.addEventListener("popstate", router);
}
