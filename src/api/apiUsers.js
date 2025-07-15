const baseUrl = "https://68760d8d814c0dfa653a6647.mockapi.io/final/users"
export async function createNewUser(newUser) {
  const url = `${baseUrl}`;
  try {const response = await fetch(url, {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name:newUser.signupName, email:newUser.signupEmail, password: newUser.signupPassword }),
  });
  if (!response.ok) {
    throw new Error('Could not create user', response.status);
  }
  return await response.json();
    
  } catch (error) {
    console.error("Error creating NewUser", error)
  }
  
}
