// Temporary Mock Authentication Service for Testing
// Replace this with the real Firebase service once Firebase is configured

export const authService = {
  // Mock email/password authentication
  async loginWithEmail(email, password) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - replace with actual Firebase validation
    if (email && password && password.length >= 6) {
      return {
        success: true,
        user: {
          id: `mock_${Date.now()}`,
          email: email,
          name: email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
          loginMethod: 'email'
        }
      };
    } else if (password.length < 6) {
      throw new Error('Password should be at least 6 characters long.');
    } else {
      throw new Error('Invalid credentials. Please try again.');
    }
  },

  // Mock Google OAuth authentication
  async loginWithGoogle() {
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      user: {
        id: `google_${Date.now()}`,
        email: "user@gmail.com",
        name: "Google User",
        avatar: "https://ui-avatars.com/api/?name=Google+User&background=random",
        loginMethod: 'google'
      }
    };
  },

  // Mock sign up
  async signUp(email, password, displayName) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password && password.length >= 6) {
      return {
        success: true,
        user: {
          id: `new_${Date.now()}`,
          email: email,
          name: displayName || email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${displayName || email.split('@')[0]}&background=random`,
          loginMethod: 'email'
        }
      };
    } else if (password.length < 6) {
      throw new Error('Password should be at least 6 characters long.');
    } else {
      throw new Error('Please provide valid email and password');
    }
  },

  // Mock logout
  async logout() {
    localStorage.removeItem('starflix_user');
    return { success: true };
  },

  // Mock auth state listener
  onAuthStateChanged(callback) {
    // Return a mock unsubscribe function
    return () => {};
  },

  // Mock get current user
  getCurrentUser() {
    return null;
  }
};

