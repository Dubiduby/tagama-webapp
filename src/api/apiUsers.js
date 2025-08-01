const baseUrl = "https://68760d8d814c0dfa653a6647.mockapi.io/final/users";

export async function createNewUser(newUser) {
  const url = `${baseUrl}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newUser.signupName,
        email: newUser.signupEmail,
        password: newUser.signupPassword,
        avatarUrl: new URL("../assets/images/user.png", import.meta.url).href,
      }),
    });
    if (!response.ok) {
      throw new Error("Could not create user", response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating NewUser", error);
  }
}

export async function getUsers() {
  const url = `${baseUrl}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users", error);
    return null;
  }
}

export function getCurrentUser() {
  try {
    const loadUser = localStorage.getItem("currentUser");

    if (!loadUser || loadUser === "null" || loadUser === "undefined") {
      return null;
    }

    return JSON.parse(loadUser);
  } catch (error) {
    console.error("Error parsing currentUser from localStorage:", error);

    localStorage.removeItem("currentUser");
    return null;
  }
}

export async function updateUser(DataToUpdate) {
  const currentUser = getCurrentUser();
  const url = `${baseUrl}/${currentUser.id}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(DataToUpdate),
    });
    if (!response.ok) {
      throw new Error("Could not update user", response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating user", error);
  }
}

export async function getUserById(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  if (!res.ok) throw new Error("User not found");
  return await res.json();
}

export async function updateUserById(id, userData) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Error updating user");
  return await res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error deleting user");
  return true;
}
