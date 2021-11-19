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

const getLocations = async (requests) => {
  const allLocations = [];
  const response = await Promise.all(requests);
  const data = await Promise.all(response.map(res => res.json()));
  data.forEach(location => allLocations.push(location.location.name));
  return [...new Set(allLocations)];
}

const getEpisodeLocations = async (resource, id) => {
  const characterRequests = []
  const episodes = await fetchAPI(`${resource}/${id}`);
  const characters = episodes.characters;
  const name = episodes.name;
  const episode = episodes.episode;
  characters.forEach((characterR) => characterRequests.push(fetch(characterR)));
  const locations = await getLocations(characterRequests)
  return [name, episode, locations]
}

const showResults = async () => {
  // Char counter
  const startTimeCharCounter = performance.now();
  const episodeCount = await countLetters("episode", "e");
  const locationCount = await countLetters("location", "l");
  const characterCount = await countLetters("character", "c");
  const endTimeCharCounter = performance.now();
  const milliseconds = endTimeCharCounter - startTimeCharCounter;
  const TimeCharCounterInSeconds = (milliseconds / 1000) % 60
  // Episode locations
  const startTimeLocations = performance.now();
  const [name, episode, locations] = await getEpisodeLocations("episode", 1);
  const endTimeLocations = performance.now();
  const millisecondsLocations = endTimeLocations - startTimeLocations;
  const TimeLocationsInSeconds = (millisecondsLocations / 1000) % 60;

  return [
    {
      "exercise_name": "Char counter",
      "time": TimeCharCounterInSeconds,
      "in_time": TimeCharCounterInSeconds < 3,
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
      "time": TimeLocationsInSeconds,
      "in_time": TimeLocationsInSeconds < 3,
      "results": [
        {
          "name": name,
          "episode": episode,
          "locations": locations
        }
      ]
    }
  ]
}


const startTotalTime = performance.now();
const results = await showResults();
console.log(JSON.stringify(results));
const endTotalTime = performance.now();

const totalMilliseconds = endTotalTime - startTotalTime;
const totalTimeInSeconds = (totalMilliseconds / 1000) % 60;
console.log(totalTimeInSeconds);