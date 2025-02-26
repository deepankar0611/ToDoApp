// Login Form (only on login.html)
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
  
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'todo.html';
      } else {
        document.getElementById('message').textContent = data;
      }
    });
  }
  
  // Signup Form (only on signup.html)
  if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('signupUsername').value;
      const password = document.getElementById('signupPassword').value;
  
      const response = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const message = await response.text();
      document.getElementById('message').textContent = message;
    });
  }
  
  // To-Do App Functions (only on todo.html)
  function addTodo() {
    const input = document.getElementById('todoInput');
    const list = document.getElementById('todoList');
    const todoText = input.value.trim();
  
    if (todoText) {
      const li = document.createElement('li');
      li.textContent = todoText;
      list.appendChild(li);
      input.value = '';
    }
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html'; // Redirect to login instead of index.html
  }
  
  // Check if logged in on todo.html
  if (window.location.pathname.includes('todo.html') && !localStorage.getItem('token')) {
    window.location.href = 'login.html'; // Redirect to login instead of index.html
  }