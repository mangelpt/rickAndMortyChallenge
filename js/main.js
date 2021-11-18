import { fetchAPI } from "./services/APIservice.js"
import { BASE_URL } from "../js/constants.js";

const getRequests = async (endpoint) => {
  const allData = await fetchAPI(endpoint);
  const pages = allData.info.pages
  const requests = [];

  for (let i = 1; i <= pages; i++) {
    requests.push(fetch(`${BASE_URL}${endpoint}/?page=` + i));
  }
  return requests;
}


const getAllData = async (endpoint) => {
  const allData = []
  const requests = await getRequests(endpoint);
  const response = await Promise.all(requests);
  const data = await Promise.all(response.map(res => res.json()));
  data.forEach(object => allData.push(...object.results));
  return allData;
}

const test = await getAllData("episode");
console.log(test);



// async function fetchMetaData() {
//   let allData = [];
//   let morePagesAvailable = true;
//   let currentPage = 0;

//   while (morePagesAvailable) {
//     currentPage++;
//     const response = await fetch(`http://api.dhsprogram.com/rest/dhs/data?page=${currentPage}`)
//     let { data, total_pages } = await response.json();
//     data.forEach(e => allData.unshift(e));
//     morePagesAvailable = currentPage < total_pages;
//   }

//   return allData;
// }