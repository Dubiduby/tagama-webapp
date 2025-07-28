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

export async function updateUser(userId, updatedData) {
  const url = `https://68760d8d814c0dfa653a6647.mockapi.io/final/users/${userId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to update user:", error);
    return null;
  }
}