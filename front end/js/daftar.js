document.getElementById('registerForm').addEventListener("submit", function (e) {
    e.preventDefault();

    let fullname = document.getElementById('fullname').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let confirm = document.getElementById('confirm').value;

    // console.log(fullname + username + password + confirm);
    if (fullname === "" || username === "" || password === "" || confirm === "") {
        alert("Ada yang masih belum di isi!");
    } else if (password !== confirm) {
        alert("Password dan Konfirasi Password tidak sama");
    } else {
        alert("Berhasil login");
        localStorage.setItem('fullname', fullname)
        localStorage.setItem('username', username);
        localStorage.setItem('password', confirm);
    }
});