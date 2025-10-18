import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaBookmark } from "react-icons/fa";
import { apiDataService } from "../../utils/apiDataService";
import { useToast } from "../toast/ToastProvider";

import "./style.scss";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";
import Img from "../lazyLoadImages/LazyImg";
const MovieCard = ({ data, fromSearch, mediaType }) => {
  const { url } = useSelector((state) => state.home);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { showFavourite, showWatchlist, showError } = useToast();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const posterUrl = data.poster_path
    ? url.poster + data.poster_path
    : PosterFallback;

  // Check if movie is in favourites and watchlist
  useEffect(() => {
    if (isAuthenticated && user) {
      checkMovieStatus();
    }
  }, [isAuthenticated, user, data.id]);

  // Debug authentication state
  useEffect(() => {
    console.log('MovieCard Debug:', { isAuthenticated, user: !!user, movieId: data.id });
  }, [isAuthenticated, user, data.id]);

  const checkMovieStatus = async () => {
    try {
      const [favouriteStatus, watchlistStatus] = await Promise.all([
        apiDataService.isFavourite(user.id, data.id),
        apiDataService.isInWatchlist(user.id, data.id)
      ]);
      setIsFavourite(favouriteStatus);
      setIsInWatchlist(watchlistStatus);
    } catch (error) {
      console.error('Error checking movie status:', error);
    }
  };

  const handleFavouriteClick = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (!isAuthenticated) {
      showError('Please login to add movies to your favourites!');
      return;
    }
    
    setIsLoading(true);
    try {
      if (isFavourite) {
        await apiDataService.removeFromFavourites(user.id, data.id);
        setIsFavourite(false);
        showFavourite(`❤️ "${data.title || data.name}" removed from favourites!`);
      } else {
        await apiDataService.addToFavourites(user.id, {
          id: data.id,
          title: data.title || data.name,
          name: data.name,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          release_date: data.release_date,
          first_air_date: data.first_air_date,
          vote_average: data.vote_average,
          overview: data.overview,
          genre_ids: data.genre_ids,
          media_type: data.media_type || mediaType
        }, {
          email: user.email,
          name: user.name,
          avatar: user.avatar
        });
        setIsFavourite(true);
        showFavourite(`❤️ "${data.title || data.name}" added to favourites!`);
      }
    } catch (error) {
      console.error('Error updating favourites:', error);
      showError('Failed to update favourites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchlistClick = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (!isAuthenticated) {
      showError('Please login to add movies to your watchlist!');
      return;
    }
    
    setIsLoading(true);
    try {
      if (isInWatchlist) {
        await apiDataService.removeFromWatchlist(user.id, data.id);
        setIsInWatchlist(false);
        showWatchlist(`🔖 "${data.title || data.name}" removed from watchlist!`);
      } else {
        await apiDataService.addToWatchlist(user.id, {
          id: data.id,
          title: data.title || data.name,
          name: data.name,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          release_date: data.release_date,
          first_air_date: data.first_air_date,
          vote_average: data.vote_average,
          overview: data.overview,
          genre_ids: data.genre_ids,
          media_type: data.media_type || mediaType
        }, {
          email: user.email,
          name: user.name,
          avatar: user.avatar
        });
        setIsInWatchlist(true);
        showWatchlist(`🔖 "${data.title || data.name}" added to watchlist!`);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      showError('Failed to update watchlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="movieCard"
      onClick={() => navigate(`/${data.media_type || mediaType}/${data.id}`)}
    >
      <div className="posterBlock">
        <Img className="posterImg" src={posterUrl} />
        
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
            className={`actionBtn favouriteBtn ${isFavourite ? 'active' : ''}`}
            onClick={handleFavouriteClick}
            disabled={isLoading}
            title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '1px solid white',
              background: isFavourite ? '#ff4757' : 'rgba(255, 71, 87, 0.7)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '10px',
              zIndex: 10000,
              transition: 'all 0.3s ease'
            }}
          >
            <FaHeart />
          </button>
          <button
            className={`actionBtn watchlistBtn ${isInWatchlist ? 'active' : ''}`}
            onClick={handleWatchlistClick}
            disabled={isLoading}
            title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '1px solid white',
              background: isInWatchlist ? '#4CAF50' : 'rgba(76, 175, 80, 0.7)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '10px',
              zIndex: 10000,
              transition: 'all 0.3s ease'
            }}
          >
            <FaBookmark />
          </button>
        </div>
        
        {!fromSearch && (
          <React.Fragment>
            <CircleRating rating={data.vote_average.toFixed(1)} />
            <Genres data={data.genre_ids.slice(0, 2)} />
          </React.Fragment>
        )}
      </div>
      <div className="textBlock">
        <span className="title">{data.title || data.name}</span>
        <span className="date">
          {dayjs(data.release_date || data.first_air_date).format("MMM D, YYYY")}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
