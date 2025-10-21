import React, { useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import { apiDataService } from '../../utils/apiDataService';
import { useToast } from '../toast/ToastProvider';
import './style.scss';

const EditReviewForm = ({ review, userFirebaseId, onReviewUpdated, onClose }) => {
  const { showError, showSuccess } = useToast();
  
  const [rating, setRating] = useState(review.rating || 0);
  const [reviewText, setReviewText] = useState(review.reviewText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        rating: rating,
        reviewText: reviewText.trim()
      };

      await apiDataService.updateReview(userFirebaseId, review._id || review.id, reviewData);
      
      showSuccess(`⭐ Review updated successfully!`);
      
      // Notify parent component
      if (onReviewUpdated) {
        onReviewUpdated();
      }
      
      // Close the form
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Error updating review:', error);
      showError(`Failed to update review: ${error.message}`);
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

  return (
    <div className="reviewForm editReviewForm">
      <div className="reviewFormHeader">
        <h3>Edit Review</h3>
        <button className="closeBtn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      
      <div className="movieInfo">
        <img 
          src={review.moviePoster ? `https://image.tmdb.org/t/p/w200${review.moviePoster}` : '/no-poster.png'} 
          alt={review.movieTitle}
        />
        <div className="movieDetails">
          <h4>{review.movieTitle}</h4>
          <p>Movie ID: {review.movieId}</p>
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
            {isSubmitting ? 'Updating...' : 'Update Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReviewForm;
