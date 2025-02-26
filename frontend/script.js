document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const addBtn = document.getElementById("addBtn");
    const input = document.getElementById("todoInput");
    const list = document.getElementById("todoList");
    const logoutBtn = document.querySelector(".logout-btn");
    const usernameDisplay = document.getElementById("usernameDisplay");

    // 🔹 LOGIN FORM HANDLING (Only on login.html)
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("loginUsername").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            try {
                const response = await fetch("http://localhost:5001/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", username);
                    window.location.href = "todo.html";
                } else {
                    document.getElementById("message").textContent = data.message || "Login failed";
                }
            } catch (error) {
                console.error("Login Error:", error);
            }
        });
    }

    // 🔹 SIGNUP FORM HANDLING (Only on signup.html)
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("signupUsername").value.trim();
            const password = document.getElementById("signupPassword").value.trim();

            if (username && password) {
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
                localStorage.setItem("token", "authenticated"); // Simulated token

                alert("Signup successful! Redirecting to To-Do List...");
                window.location.href = "todo.html";
            } else {
                alert("Please enter valid credentials.");
            }
        });
    }

    // 🔹 TO-DO LIST HANDLING (Only on todo.html)
    if (window.location.pathname.includes("todo.html")) {
        if (!localStorage.getItem("token")) {
            window.location.href = "login.html";
        } else {
            const username = localStorage.getItem("username");
            if (usernameDisplay && username) {
                usernameDisplay.textContent = `Welcome, ${username}!`;
            }
        }

        // Load saved tasks
        loadTodos();

        // Add task on button click
        addBtn?.addEventListener("click", addTodo);

        // Add task on Enter key press
        input?.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                addTodo();
            }
        });

        // Logout event
        logoutBtn?.addEventListener("click", logout);
    }

    // 🔹 FUNCTION: Add To-Do Task
    function addTodo() {
        const todoText = input.value.trim();
        if (!todoText) return;

        const todoItem = createTodoItem(todoText);
        list.appendChild(todoItem);

        saveTodos();
        input.value = "";
    }

    // 🔹 FUNCTION: Create a To-Do Item
    function createTodoItem(todoText) {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = todoText;

        // Edit Button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.onclick = () => editTodo(li, span, editBtn);

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = () => {
            li.remove();
            saveTodos();
        };

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    // 🔹 FUNCTION: Edit a Task
    function editTodo(li, span, editBtn) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = span.textContent;
        input.classList.add("edit-input");

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("save-btn");

        saveBtn.onclick = () => {
            span.textContent = input.value;
            li.replaceChild(span, input);
            li.replaceChild(editBtn, saveBtn);
            saveTodos();
        };

        li.replaceChild(input, span);
        li.replaceChild(saveBtn, editBtn);
        input.focus();
    }

    // 🔹 FUNCTION: Save To-Dos to LocalStorage
    function saveTodos() {
        const todos = [];
        document.querySelectorAll(".todo-list li span").forEach(span => {
            todos.push(span.textContent);
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    // 🔹 FUNCTION: Load To-Dos from LocalStorage
    function loadTodos() {
        const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
        savedTodos.forEach(todoText => {
            const todoItem = createTodoItem(todoText);
            list.appendChild(todoItem);
        });
    }

    // 🔹 FUNCTION: Logout User
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "login.html";
    }
});
