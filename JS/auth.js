// JS/auth.js
document.addEventListener('DOMContentLoaded', function() {
  // Your existing auth-related JS from script.js
  // Modified to point to your backend:
  const API_URL = 'http://localhost:5000/api/auth';

  // Example login function
  async function handleLogin(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      // ... rest of your code
    } catch (err) {
      console.error('Login error:', err);
    }
  }
});