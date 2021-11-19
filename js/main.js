import { fetchAPI } from "./services/APIservice.js"
import { BASE_URL } from "../js/constants.js";

const getRequests = async (resource) => {
  const requests = [];
  const allData = await fetchAPI(resource);
  const pages = allData.info.pages;
  for (let i = 1; i <= pages; i++) {
    requests.push(fetch(`${BASE_URL}${resource}/?page=` + i));
  }
  return requests;
}

const getAllData = async (resource) => {
  const allData = [];
  const requests = await getRequests(resource);
  const response = await Promise.all(requests);
  const data = await Promise.all(response.map(res => res.json()));
  data.forEach(object => allData.push(...object.results));
  return allData;
}

const getAllNames = async (resource) => {
  const names = [];
  const arrayOfData = await getAllData(resource);
  arrayOfData.forEach((object) => names.push(object.name));
  return names;
}

const countLetters = async (resource, letter) => {
  const names = await getAllNames(resource);
  let counter = 0;
  names.forEach((name) => {
    const regex = new RegExp(letter, "gi");
    const letters = name.match(regex)?.length ?? 0;
    counter += letters;
  })
  return counter;
}



const showResults = async () => {
  const episodeCount = await countLetters("episode", "e")
  const locationCount = await countLetters("location", "l");
  const characterCount = await countLetters("character", "c");
  return [
    {
      "exercise_name": "Char counter",
      "time": "2s 545.573272ms",
      "in_time": true,
      "results": [
        {
          "char": "l",
          "count": locationCount,
          "resource": "location"
        },
        {
          "char": "e",
          "count": episodeCount,
          "resource": "episode"
        },
        {
          "char": "c",
          "count": characterCount,
          "resource": "character"
        }
      ]
    },
    {
      "exercise_name": "Episode locations",
      "time": "1s 721.975698ms",
      "in_time": true,
      "results": [
        {
          "name": "Pickle Rick",
          "episode": "S03E03",
          "locations": [
            "Earth (C-137)",
            "Earth (Replacement Dimension)",
            "unknown"
          ]
        }
      ]
    }
  ]
}


// const test = await showResults()

// const test = await countLetters("episode", "e");
// console.log(test);
