const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const response = await fetch('/auth/login', {
    method: 'POST',
    body: formData
  });
  const result = await response.json();
  if (result.success) {
    window.location.href = '/dashboard';
  } else {
    alert('Login failed: ' + result.message);
  } 
});