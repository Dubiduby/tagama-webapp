const baseUrl = "https://68760d8d814c0dfa653a6647.mockapi.io/final/users";

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
