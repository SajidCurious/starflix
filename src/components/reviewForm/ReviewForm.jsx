import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaStar, FaTimes } from 'react-icons/fa';
import { apiDataService } from '../../utils/apiDataService';
import { useToast } from '../toast/ToastProvider';
import './style.scss';

const ReviewForm = ({ movieData, onReviewSubmitted, onClose }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { showError, showSuccess } = useToast();
  
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showError('Please login to write a review!');
      return;
    }

    if (rating === 0) {
      showError('Please select a rating!');
      return;
    }

    if (!reviewText.trim()) {
      showError('Please write a review!');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        movieId: movieData.id,
        movieTitle: movieData.title || movieData.name,
        moviePoster: movieData.poster_path,
        rating: rating,
        reviewText: reviewText.trim()
      };

      const userData = {
        email: user.email,
        name: user.name,
        avatar: user.avatar
      };

      await apiDataService.addReview(user.id, reviewData, userData);
      
      showSuccess(`⭐ Review submitted successfully!`);
      
      // Reset form
      setRating(0);
      setReviewText('');
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // Close the form
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Error submitting review:', error);
      showError(`Failed to submit review: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  if (!isAuthenticated) {
    return (
      <div className="reviewForm">
        <div className="reviewFormHeader">
          <h3>Write a Review</h3>
          <button className="closeBtn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="loginPrompt">
          <p>Please login to write a review for this movie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviewForm">
      <div className="reviewFormHeader">
        <h3>Write a Review</h3>
        <button className="closeBtn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      
      <div className="movieInfo">
        <img 
          src={movieData.poster_path ? `https://image.tmdb.org/t/p/w200${movieData.poster_path}` : '/no-poster.png'} 
          alt={movieData.title || movieData.name}
        />
        <div className="movieDetails">
          <h4>{movieData.title || movieData.name}</h4>
          <p>{movieData.release_date?.split('-')[0] || movieData.first_air_date?.split('-')[0]}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="ratingSection">
          <label>Your Rating:</label>
          <div className="starRating">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`star ${star <= (hoveredRating || rating) ? 'filled' : 'empty'}`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
              />
            ))}
            <span className="ratingText">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
            </span>
          </div>
        </div>

        <div className="reviewSection">
          <label htmlFor="reviewText">Your Review:</label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            rows={6}
            maxLength={1000}
            required
          />
          <div className="charCount">
            {reviewText.length}/1000 characters
          </div>
        </div>

        <div className="formActions">
          <button 
            type="button" 
            className="cancelBtn" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submitBtn"
            disabled={isSubmitting || rating === 0 || !reviewText.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
