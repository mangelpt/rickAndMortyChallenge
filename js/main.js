import { fetchAPI } from "./services/APIservice.js"
import { BASE_URL } from "../js/constants.js";

const getRequests = async (endpoint) => {
  const requests = [];
  const allData = await fetchAPI(endpoint);
  const pages = allData.info.pages;
  for (let i = 1; i <= pages; i++) {
    requests.push(fetch(`${BASE_URL}${endpoint}/?page=` + i));
  }
  return requests;
}

const getAllData = async (endpoint) => {
  const allData = [];
  const requests = await getRequests(endpoint);
  const response = await Promise.all(requests);
  const data = await Promise.all(response.map(res => res.json()));
  data.forEach(object => allData.push(...object.results));
  return allData;
}

const getAllNames = async (endpoint) => {
  const names = [];
  const arrayOfData = await getAllData(endpoint);
  arrayOfData.forEach((object) => names.push(object.name));
  return names;
}

const countLetters = async (endpoint, letter) => {
  const names = await getAllNames(endpoint);
  let counter = 0;
  names.forEach((name) => {
    const regex = new RegExp(letter, "gi");
    const letters = name.match(regex)?.length ?? 0;
    counter += letters;
  })
  return counter;
}



const test = await countLetters("episode", "e");
console.log(test);
