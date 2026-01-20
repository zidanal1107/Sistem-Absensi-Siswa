document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // console.log(username, password);
    let savedUsername = localStorage.getItem('username');
    let savedPassword = localStorage.getItem('password');

    if (username === "" || password === "") {
        alert("Masih ada yang kosong!");
        return;
    }

    if (username === savedUsername && password === savedPassword) {
        alert("Login berhasil");
    } else if (username !== savedUsername) {
        alert("Username salah!");
    } else if (password !== savedPassword) {
        alert("Password salah!");
    }
});