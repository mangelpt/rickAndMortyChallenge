import { BASE_URL } from "../constants.js";

export const fetchAPI = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error("something wrong");
    }
    return await response.json();
  } catch (error) {
    console.log(error.message)
  }

}
