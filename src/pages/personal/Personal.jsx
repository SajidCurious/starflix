import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaBookmark, FaStar, FaArrowLeft, FaPlay, FaTrash, FaEdit } from "react-icons/fa";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { apiDataService } from "../../utils/apiDataService";
import EditReviewForm from "../../components/editReviewForm/EditReviewForm";
import "./style.scss";

const Personal = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("watchlist");
  const [watchlist, setWatchlist] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log('🔍 DEBUG - Loading user data:', { 
        userId: user.id, 
        userEmail: user.email
      });
      
      const [watchlistData, favouritesData, reviewsData] = await Promise.all([
        apiDataService.getWatchlist(user.id),
        apiDataService.getFavourites(user.id),
        apiDataService.getReviews(user.id)
      ]);
      
      console.log('🔍 DEBUG - Loaded data:', { 
        watchlistData, 
        favouritesData, 
        reviewsData,
        watchlistCount: watchlistData?.length || 0,
        favouritesCount: favouritesData?.length || 0,
        reviewsCount: reviewsData?.length || 0
      });
      
      // Additional debugging - check localStorage directly
      console.log('🔍 DEBUG - localStorage check:', {
        favouritesKey: `starflix_favourites_${user.id}`,
        watchlistKey: `starflix_watchlist_${user.id}`,
        favouritesFromStorage: localStorage.getItem(`starflix_favourites_${user.id}`),
        watchlistFromStorage: localStorage.getItem(`starflix_watchlist_${user.id}`)
      });
      
      setWatchlist(watchlistData);
      setFavourites(favouritesData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await apiDataService.removeFromWatchlist(user.id, movieId);
      setWatchlist(prev => prev.filter(item => item.movieId !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleRemoveFromFavourites = async (movieId) => {
    try {
      await apiDataService.removeFromFavourites(user.id, movieId);
      setFavourites(prev => prev.filter(item => item.movieId !== movieId));
    } catch (error) {
      console.error('Error removing from favourites:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await apiDataService.deleteReview(user.id, reviewId);
      setReviews(prev => prev.filter(item => item.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleReviewUpdated = () => {
    setEditingReview(null);
    loadUserData(); // Reload data to get updated review
  };

  const handleBackClick = () => {
    navigate("/");
  };


  const renderContent = () => {
    if (loading) {
      return (
        <div className="contentSection">
          <div className="loadingState">
            <div className="spinner"></div>
            <p>Loading your data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "watchlist":
        return (
          <div className="contentSection">
            <h3>Your Watchlist ({watchlist.length})</h3>
            <p>Movies and TV shows you've added to watch later.</p>
            {watchlist.length === 0 ? (
              <div className="emptyState">
                <FaBookmark className="emptyIcon" />
                <h4>No items in your watchlist yet</h4>
                <p>Start exploring movies and TV shows to add them to your watchlist!</p>
              </div>
            ) : (
                      <div className="itemsGrid">
                        {watchlist.map((item) => (
                          <div 
                            key={item.movieId} 
                            className="itemCard"
                            onClick={() => navigate(`/${item.media_type || 'movie'}/${item.movieId}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="itemPoster">
                              <img 
                                src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/no-poster.png'} 
                                alt={item.title || item.name}
                              />
                              {/* Delete button in top-right corner */}
                              <button 
                                className="deleteBtn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromWatchlist(item.movieId);
                                }}
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '50%',
                                  border: '1px solid white',
                                  background: 'rgba(255, 71, 87, 0.9)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  zIndex: 10000,
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = '#ff4757';
                                  e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'rgba(255, 71, 87, 0.9)';
                                  e.target.style.transform = 'scale(1)';
                                }}
                              >
                                <FaTrash />
                              </button>
                              <div className="itemOverlay">
                                <button className="playBtn">
                                  <FaPlay />
                                </button>
                              </div>
                            </div>
                            <div className="itemInfo">
                              <h4>{item.title || item.name}</h4>
                              <p>{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</p>
                            </div>
                          </div>
                        ))}
                      </div>
            )}
          </div>
        );
      
      case "favourites":
        return (
          <div className="contentSection">
            <h3>Your Favourites ({favourites.length})</h3>
            <p>Movies and TV shows you've marked as favourites.</p>
            {favourites.length === 0 ? (
              <div className="emptyState">
                <FaHeart className="emptyIcon" />
                <h4>No favourites yet</h4>
                <p>Like movies and TV shows to see them in your favourites!</p>
              </div>
            ) : (
                      <div className="itemsGrid">
                        {favourites.map((item) => (
                          <div 
                            key={item.movieId} 
                            className="itemCard"
                            onClick={() => navigate(`/${item.media_type || 'movie'}/${item.movieId}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="itemPoster">
                              <img 
                                src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/no-poster.png'} 
                                alt={item.title || item.name}
                              />
                              {/* Delete button in top-right corner */}
                              <button 
                                className="deleteBtn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromFavourites(item.movieId);
                                }}
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '50%',
                                  border: '1px solid white',
                                  background: 'rgba(255, 71, 87, 0.9)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  zIndex: 10000,
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = '#ff4757';
                                  e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'rgba(255, 71, 87, 0.9)';
                                  e.target.style.transform = 'scale(1)';
                                }}
                              >
                                <FaTrash />
                              </button>
                              <div className="itemOverlay">
                                <button className="playBtn">
                                  <FaPlay />
                                </button>
                              </div>
                            </div>
                            <div className="itemInfo">
                              <h4>{item.title || item.name}</h4>
                              <p>{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</p>
                            </div>
                          </div>
                        ))}
                      </div>
            )}
          </div>
        );
      
      case "reviews":
        return (
          <div className="contentSection">
            <h3>My Reviews ({reviews.length})</h3>
            <p>Reviews you've written for movies and TV shows.</p>
            {reviews.length === 0 ? (
              <div className="emptyState">
                <FaStar className="emptyIcon" />
                <h4>No reviews yet</h4>
                <p>Write reviews for movies and TV shows you've watched!</p>
              </div>
            ) : (
              <div className="reviewsList">
                        {editingReview && (
                          <EditReviewForm 
                            review={editingReview}
                            userFirebaseId={user.id}
                            onReviewUpdated={handleReviewUpdated}
                            onClose={() => setEditingReview(null)}
                          />
                        )}
                        {reviews.map((review) => (
                          <div key={review.id} className="reviewCard">
                            <div className="reviewHeader">
                              <div 
                                className="reviewMovie"
                                onClick={() => navigate(`/movie/${review.movieId}`)}
                                style={{ cursor: 'pointer' }}
                              >
                                <img 
                                  src={review.moviePoster ? `https://image.tmdb.org/t/p/w200${review.moviePoster}` : '/no-poster.png'} 
                                  alt={review.movieTitle}
                                />
                                <div className="reviewMovieInfo">
                                  <h4>{review.movieTitle}</h4>
                                  <p>Movie ID: {review.movieId}</p>
                                </div>
                              </div>
                              <div className="reviewActions">
                                <button 
                                  className="editReviewBtn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditReview(review);
                                  }}
                                  title="Edit review"
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  className="deleteReviewBtn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteReview(review.id);
                                  }}
                                  title="Delete review"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                    <div className="reviewContent">
                      <div className="reviewRating">
                        {Array.from({ length: 5 }, (_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < (review.rating || 0) ? 'filled' : 'empty'} 
                          />
                        ))}
                      </div>
                      <p className="reviewText">{review.reviewText || 'No review text available.'}</p>
                      <p className="reviewDate">
                        {new Date(review.createdAt).toLocaleDateString() || 'Unknown date'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="personalPage">
      <ContentWrapper>
        <div className="personalHeader">
          <button className="backBtn" onClick={handleBackClick}>
            <FaArrowLeft />
            Back to Home
          </button>
          <h1>Personal</h1>
        </div>

        <div className="personalContent">
          <div className="tabsContainer">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "watchlist" ? "active" : ""}`}
                onClick={() => setActiveTab("watchlist")}
              >
                <FaBookmark />
                Watchlist
              </button>
              <button
                className={`tab ${activeTab === "favourites" ? "active" : ""}`}
                onClick={() => setActiveTab("favourites")}
              >
                <FaHeart />
                Favourites
              </button>
              <button
                className={`tab ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                <FaStar />
                My Reviews
              </button>
            </div>
          </div>

          <div className="tabContent">
            {renderContent()}
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Personal;
