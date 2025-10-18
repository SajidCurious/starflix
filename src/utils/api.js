import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const TMBD_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzczZTAyYTZlZDdmMDM0NzEzNzI5MDA3MWEwYzEyOSIsIm5iZiI6MTc1NzQ3MzQzMC4wMzMsInN1YiI6IjY4YzBlYTk2MDQ1OWUzN2YxNzFiZDg2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jTYzse9lXmqdCGDDu6aTHm5l1YMTb4QWx8WGDcFt7R0';

const headers = {
  Authorization: "bearer " + TMBD_TOKEN,
};

export const fetchDataFromApi = async (url, params) => {
  try {
    const { data } = await axios.get(BASE_URL + url, { headers, params });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
