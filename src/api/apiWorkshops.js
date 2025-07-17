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
