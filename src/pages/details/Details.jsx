import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";

import useFetch from "../../hooks/useFetch";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendation";
import ReviewForm from "../../components/reviewForm/ReviewForm";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { apiDataService } from "../../utils/apiDataService";

const Details = () => {
  const { mediaType, id } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(false);
  
  const { data, loading } = useFetch(`/${mediaType}/${id}/videos`);
  const { data: credits, loading: creditsLoading } = useFetch(
    `/${mediaType}/${id}/credits`
  );
  const { data: movieData, loading: movieLoading } = useFetch(`/${mediaType}/${id}`);

  // Check if user has already reviewed this movie
  useEffect(() => {
    const checkReviewStatus = async () => {
      if (isAuthenticated && user && movieData) {
        setCheckingReview(true);
        try {
          const reviewed = await apiDataService.hasReviewed(user.id, movieData.id);
          setHasReviewed(reviewed);
        } catch (error) {
          console.error('Error checking review status:', error);
        } finally {
          setCheckingReview(false);
        }
      }
    };

    checkReviewStatus();
  }, [isAuthenticated, user, movieData]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setHasReviewed(true);
    // You could add a success message here if needed
  };

  return (
    <div>
      <DetailsBanner video={data?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      <VideosSection data={data} loading={loading} />
      
      {/* Review Section */}
      {isAuthenticated && movieData && (
        <div className="reviewSection">
          <ContentWrapper>
            <div className="reviewHeader">
              <h2>Write a Review</h2>
              <p>Share your thoughts about this {mediaType === 'movie' ? 'movie' : 'TV show'}</p>
              
              {checkingReview ? (
                <div className="reviewStatus">
                  <p>Checking review status...</p>
                </div>
              ) : hasReviewed ? (
                <div className="reviewStatus">
                  <p>✅ You have already reviewed this {mediaType === 'movie' ? 'movie' : 'TV show'}</p>
                  <p>Check your <a href="/personal" style={{color: 'var(--pink)'}}>Personal</a> page to view your review</p>
                </div>
              ) : !showReviewForm ? (
                <button 
                  className="writeReviewBtn"
                  onClick={() => setShowReviewForm(true)}
                >
                  Write a Review
                </button>
              ) : null}
            </div>
            
            {showReviewForm && !hasReviewed && (
              <ReviewForm 
                movieData={movieData}
                onReviewSubmitted={handleReviewSubmitted}
                onClose={() => setShowReviewForm(false)}
              />
            )}
          </ContentWrapper>
        </div>
      )}
      
      <Similar mediaType={mediaType} id={id} />
      <Recommendation mediaType={mediaType} id={id} />
    </div>
  );
};

export default Details;
