import { useEffect } from "react";
import { fetchDataFromApi } from "./utils/api";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { apiDataService } from "./utils/apiDataService";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import Personal from "./pages/personal/Personal";
import PageNotFound from "./pages/404/PageNotFound";
import { ToastProvider } from "./components/toast/ToastProvider";

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  console.log(url);

  useEffect(() => {
    // Initialize Supabase
    apiDataService.checkHealth().catch(console.error);
    
    // Initialize API configuration
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      // handle success
      console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };
      dispatch(getApiConfiguration(url));
    }).catch((error) => {
      console.error('Failed to fetch API configuration:', error);
      // Fallback URLs for when TMDB API is not available
      const fallbackUrl = {
        backdrop: "https://image.tmdb.org/t/p/original",
        poster: "https://image.tmdb.org/t/p/original", 
        profile: "https://image.tmdb.org/t/p/original",
      };
      dispatch(getApiConfiguration(fallbackUrl));
    });
  };

  const genresCall = async () => {
    try {
      let promises = [];
      let endPoints = ["tv", "movie"];
      let allGenres = {};

      endPoints.forEach((url) => {
        promises.push(fetchDataFromApi(`/genre/${url}/list`));
      });

      const data = await Promise.all(promises);
      console.log(data);
      data.map(({ genres }) => {
        return genres.map((item) => (allGenres[item.id] = item));
      });

      dispatch(getGenres(allGenres));
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      // Use empty genres object as fallback
      dispatch(getGenres({}));
    }
  };

  return (
    <BrowserRouter>
      <ToastProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/:mediaType/:id" element={<Details />} />
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/explore/:mediaType" element={<Explore />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
