import {  useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import PageNotFound from "./pages/404/pageNotFound";
import Home from "./pages/home/Home";
import SearchResult from "./pages/searchResult/SearchResult";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Details from "./pages/details/Details";
import Explore from "./pages/explore/Explore";
import axios from "axios";


import './utils/api.js'

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  console.log(url);
  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = async () => {
    try {
      const res = await axios.get("/configuration");
      console.log(res);
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url));
    } catch (err) {
      console.log(err);
    }
  };

  const genresCall = async () => {
    let promises = [];
    let endPoint = ["tv", "movie"];
    let allGenres = {};

    endPoint.forEach((url) => {
      promises.push(axios.get(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    data.map(({genres}) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;