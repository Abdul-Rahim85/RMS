// Logout Controller
const logout_get = (req, res) => {
  res.redirect('/login');
}

// Login Controllers
const login_get = (req, res) => {
  res.render('auth/login', { title: 'Login' });
}

// Handle Login Post Request
const login_post = (req, res) => {
  const { username, password } = req.body;  
}

module.exports = {
  logout_get,
  login_get,
  login_post
}