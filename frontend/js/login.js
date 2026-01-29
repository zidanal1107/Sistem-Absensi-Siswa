const form = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");

const userError = document.querySelector(".user-kosong");
const passError = document.querySelector(".pass-kosong");
const popup = document.getElementById("successPopup");

const adminLogin = {
    usernameA: "110107",
    passwordA: "Admin123"
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    if (username.value.trim() === "") {
        username.classList.add("error");
        userError.classList.remove("d-none");
        valid = false;
    } else {
        username.classList.remove("error");
        userError.classList.add("d-none");
    }

    if (password.value.trim() === "") {
        password.classList.add("error");
        passError.classList.remove("d-none");
        valid = false;
    } else {
        password.classList.remove("error");
        passError.classList.add("d-none");
    }

    // Cek login admin jika form valid
    if (valid) {
        if (username.value === adminLogin.usernameA &&
            password.value === adminLogin.passwordA) {
            // tandai sebagai login admin
            localStorage.setItem("isAdminLogin", "true");

            popup.classList.add("show");
            popup.textContent = `Selamat datang Admin`;
            popup.style.backgroundColor = "#0d6efd";

            setTimeout(() => {
                window.location.href = "./modeAdmin.html";
            }, 1000);
            return;
        }

        // Jika login siswa → tampilkan popup
        popup.classList.add("show");
        popup.textContent = `Berhasil login dengan NIS ${username.value}`

        // Sembunyikan popup setelah 3 detik
        setTimeout(() => {
            popup.classList.remove("show");
        }, 3000);

        // Reset form
        form.reset();
    }
});

// Realtime clear error
username.addEventListener("input", () => {
    username.classList.remove("error");
    userError.classList.add("d-none");
});

password.addEventListener("input", () => {
    password.classList.remove("error");
    passError.classList.add("d-none");
});
