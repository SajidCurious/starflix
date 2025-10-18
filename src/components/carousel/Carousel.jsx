import React, { useRef, useState, useEffect } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { FaHeart, FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import PosterFallback from "../../assets/no-poster.png";
import { apiDataService } from "../../utils/apiDataService";
import { useToast } from "../toast/ToastProvider";

import "./style.scss";
import Img from "../lazyLoadImages/LazyImg";
import Genres from "../genres/Genres";
import CircleRating from "../circleRating/CircleRating";

const Carousel = ({ data, loading, endpoint, title }) => {
  const carouselContainer = useRef();
  const { url } = useSelector((state) => state.home);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { showFavourite, showWatchlist, showError } = useToast();

  const navigation = (dir) => {
    const container = carouselContainer.current;

    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const handleFavouriteClick = async (e, item) => {
    e.stopPropagation(); // Prevent card click
    if (!isAuthenticated) {
      showError('Please login to add movies to your favourites!');
      return;
    }
    
    console.log('🔍 DEBUG - Adding to favourites:', { 
      userId: user.id, 
      userEmail: user.email,
      movieData: item
    });
    
    try {
      await apiDataService.addToFavourites(user.id, {
        id: item.id,
        title: item.title || item.name,
        name: item.name,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
        overview: item.overview,
        genre_ids: item.genre_ids,
        media_type: item.media_type || endpoint
      }, {
        email: user.email,
        name: user.name,
        avatar: user.avatar
      });
      
      console.log('✅ Successfully added to favourites');
      showFavourite(`❤️ "${item.title || item.name}" added to favourites!`);
      
      // Debug: Check what's actually in localStorage
      const favourites = await apiDataService.getFavourites(user.id);
      console.log('🔍 DEBUG - Current favourites:', favourites);
    } catch (error) {
      console.error('❌ Error updating favourites:', error);
      showError(`Failed to add to favourites: ${error.message}`);
    }
  };

  const handleWatchlistClick = async (e, item) => {
    e.stopPropagation(); // Prevent card click
    if (!isAuthenticated) {
      showError('Please login to add movies to your watchlist!');
      return;
    }
    
    console.log('🔍 DEBUG - Adding to watchlist:', { 
      userId: user.id, 
      userEmail: user.email,
      movieData: item
    });
    
    try {
      await apiDataService.addToWatchlist(user.id, {
        id: item.id,
        title: item.title || item.name,
        name: item.name,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
        overview: item.overview,
        genre_ids: item.genre_ids,
        media_type: item.media_type || endpoint
      }, {
        email: user.email,
        name: user.name,
        avatar: user.avatar
      });
      
      console.log('✅ Successfully added to watchlist');
      showWatchlist(`🔖 "${item.title || item.name}" added to watchlist!`);
      
      // Debug: Check what's actually in localStorage
      const watchlist = await apiDataService.getWatchlist(user.id);
      console.log('🔍 DEBUG - Current watchlist:', watchlist);
    } catch (error) {
      console.error('❌ Error updating watchlist:', error);
      showError(`Failed to add to watchlist: ${error.message}`);
    }
  };
  const skItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton"></div>
        <div className="textBlock">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className="carousel">
        <ContentWrapper>
          {title && <div className="carouselTitle">{title}</div>}
          <BsFillArrowLeftCircleFill
            className="carouselLeftNav arrow"
            onClick={() => navigation("left")}
          />
          <BsFillArrowRightCircleFill
            className="carouselRighttNav arrow"
            onClick={() => navigation("right")}
          />
          {!loading ? (
            <div className="carouselItems" ref={carouselContainer}>
              {data?.map((item) => {
                const posterUrl = item.poster_path
                  ? url.poster + item.poster_path
                  : PosterFallback;
                return (
                  <div
                    key={item.id}
                    className="carouselItem"
                    onClick={() =>
                      navigate(`/${item.media_type || endpoint}/${item.id}`)
                    }
                  >
                    <div className="posterBlock">
                      <Img src={posterUrl} />
                      
                      {/* Action Buttons */}
                      <div className="actionButtons" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <button
                          onClick={(e) => handleFavouriteClick(e, item)}
                          style={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            border: '1.5px solid white',
                            background: '#ff4757',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '12px',
                            zIndex: 10000
                          }}
                        >
                          <FaHeart />
                        </button>
                        <button
                          onClick={(e) => handleWatchlistClick(e, item)}
                          style={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            border: '1.5px solid white',
                            background: '#00ff00',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '12px',
                            zIndex: 10000
                          }}
                        >
                          <FaBookmark />
                        </button>
                      </div>
                      
                      <CircleRating rating={item.vote_average.toFixed(1)} />
                      <Genres data={item.genre_ids.slice(0, 2)} />
                    </div>
                    <div className="textBlock">
                      <span className="title">{item.title || item.name}</span>
                      <span className="date">
                        {dayjs(item.release_date || item.first_air_date).format(
                          "MMM D, YYYY"
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="loadingSkeleton">
              {skItem()}
              {skItem()}
              {skItem()}
              {skItem()}
              {skItem()}
            </div>
          )}
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Carousel;
