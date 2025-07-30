const baseUrl = "https://68760d8d814c0dfa653a6647.mockapi.io/final/workshops";

export async function getWorkshops() {
  const url = `${baseUrl}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const workshops = await response.json();
    console.log(workshops);
    return workshops;
  } catch (error) {
    console.error("Error fetching workshops", error);
    return null;
  }
}

export async function createWorkshop(workshopData) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workshopData),
  });
  return response.json();
}

export async function deleteWorkshop(id) {
  const url = `${baseUrl}/${id}`;
  console.log("DELETE URL:", url); // Debug
  const response = await fetch(url, { method: "DELETE" });
  console.log("DELETE status:", response.status);
  return response.ok;
}

export async function updateWorkshop(dataToUpdate) {
  const url = `${baseUrl}/${dataToUpdate.id}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdate),
    });
    if (!response.ok) {
      throw new Error("Could not update workshop", response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating workshop", error);
  }
}


