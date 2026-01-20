// Authentication utility functions
export const auth = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const loggedIn = localStorage.getItem('superAdminLoggedIn') === 'true';
    
    // Check session timeout (24 hours)
    if (loggedIn) {
      const loginTime = localStorage.getItem('superAdminLoginTime');
      if (loginTime) {
        const hoursSinceLogin = (new Date() - new Date(loginTime)) / (1000 * 60 * 60);
        if (hoursSinceLogin > 24) {
          auth.logout();
          return false;
        }
      }
    }
    
    return loggedIn;
  },

  // Login function
  login: (username, password) => {
    // In a real app, this would be an API call
    const superAdminCredentials = {
      username: 'superadmin',
      password: 'Admin@123'
    };

    if (username === superAdminCredentials.username && 
        password === superAdminCredentials.password) {
      
      localStorage.setItem('superAdminLoggedIn', 'true');
      localStorage.setItem('superAdminUsername', username);
      localStorage.setItem('superAdminLoginTime', new Date().toISOString());
      
      return {
        success: true,
        message: 'Login successful'
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials'
    };
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('superAdminLoggedIn');
    localStorage.removeItem('superAdminUsername');
    localStorage.removeItem('superAdminLoginTime');
    
    // Clear all localStorage data (optional - uncomment if needed)
    // localStorage.clear();
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  },

  // Get current user info
  getCurrentUser: () => {
    return {
      username: localStorage.getItem('superAdminUsername'),
      loginTime: localStorage.getItem('superAdminLoginTime'),
      isAuthenticated: localStorage.getItem('superAdminLoggedIn') === 'true'
    };
  },

  // Check session validity
  checkSession: () => {
    const user = auth.getCurrentUser();
    if (!user.isAuthenticated) return false;

    const loginTime = new Date(user.loginTime);
    const currentTime = new Date();
    const hoursDiff = (currentTime - loginTime) / (1000 * 60 * 60);

    return hoursDiff < 24; // Session valid for 24 hours
  }
};

// Session timeout handler
export const setupSessionTimeout = (onTimeout) => {
  const checkTimeout = () => {
    const loginTime = localStorage.getItem('superAdminLoginTime');
    if (loginTime) {
      const hoursSinceLogin = (new Date() - new Date(loginTime)) / (1000 * 60 * 60);
      if (hoursSinceLogin > 24) {
        auth.logout();
        if (onTimeout) onTimeout();
      }
    }
  };

  // Check every minute
  setInterval(checkTimeout, 60000);

  // Also check when window/tab becomes active
  window.addEventListener('focus', checkTimeout);
  window.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkTimeout();
    }
  });
};