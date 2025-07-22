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

//Login request

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

//Data to update has to be in this format: for example -> updateUser({name: currentUser.name})
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
