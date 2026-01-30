let users = JSON.parse(localStorage.getItem("usersData")) || [];
if (!Array.isArray(users)) users = [];

const userTable = document.getElementById("userTable");
const nilaiTable = document.getElementById("nilaiTable");

// MODALS
const modal = new bootstrap.Modal(document.getElementById("userModal"));
const nilaiModal = new bootstrap.Modal(document.getElementById("nilaiModal"));

// SAVE STORAGE
function saveToStorage() {
    localStorage.setItem("usersData", JSON.stringify(users));
}

// NAVIGATION
function showSection(section) {
    document.getElementById("usersSection").classList.add("d-none");
    document.getElementById("nilaiSection").classList.add("d-none");

    if (section === "users") document.getElementById("usersSection").classList.remove("d-none");
    if (section === "nilai") document.getElementById("nilaiSection").classList.remove("d-none");
}

// OPEN ADD MODAL
function openAddModal() {
    document.getElementById("editIndex").value = "";
    document.getElementById("nis").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("kelas").value = "";

    resetErrors();
    modal.show();
}

// RESET ERROR UI
function resetNilaiError() {
    document.getElementById("nilaiInputPrak").classList.remove("input-error");
    document.getElementById("nilaiInputTeor").classList.remove("input-error");

    document.querySelectorAll("#errNilai").forEach(err => {
        err.classList.add("d-none");
    });
}

// PASSWORD GENERATOR
function generatePassword(absen, nis) {
    let randomPart = "";
    for (let i = 0; i < 5; i++) {
        randomPart += Math.floor(Math.random() * 10);
    }
    return `${absen}${randomPart}${nis}`;
}

// GRADE SYSTEM
function getGrade(nilai) {
    nilai = Number(nilai);

    if (nilai >= 90) return "A+";
    if (nilai >= 80) return "A";
    if (nilai >= 75) return "B+";
    if (nilai >= 70) return "B";
    if (nilai >= 65) return "C+";
    if (nilai >= 60) return "C";
    if (nilai >= 50) return "D";
    if (nilai >= 30) return "E";
    return "F";
}

function getGradeColor(grade) {
    if (grade === "A+" || grade === "A") return "bg-success";
    if (grade === "B+" || grade === "B") return "bg-info";
    if (grade === "C+" || grade === "C") return "bg-warning";
    return "bg-danger";
}

// SAVE USER
function saveUser() {
    const nisInput = document.getElementById("nis");
    const namaInput = document.getElementById("nama");
    const kelasInput = document.getElementById("kelas");

    const errNis = document.getElementById("errNis");
    const errNama = document.getElementById("errNama");
    const errKelas = document.getElementById("errKelas");

    const nis = nisInput.value.trim();
    const nama = namaInput.value.trim();
    const kelas = kelasInput.value.trim();
    const editIndex = document.getElementById("editIndex").value;

    let valid = true;

    resetErrors();

    // VALIDASI KOSONG
    if (!nis) {
        nisInput.classList.add("input-error");
        errNis.textContent = "NIS wajib diisi";
        errNis.classList.remove("d-none");
        valid = false;
    }

    if (!nama) {
        namaInput.classList.add("input-error");
        errNama.classList.remove("d-none");
        valid = false;
    }

    if (!kelas) {
        kelasInput.classList.add("input-error");
        errKelas.classList.remove("d-none");
        valid = false;
    }

    if (!valid) return;

    // VALIDASI NIS UNIK
    const nisExists = users.some((u, i) => u.nis === nis && i != editIndex);
    if (nisExists) {
        nisInput.classList.add("input-error");
        errNis.textContent = "NIS sudah terdaftar";
        errNis.classList.remove("d-none");
        return;
    }

    // TAMBAH USER BARU
    if (editIndex === "") {
        const absen = users.length > 0
            ? Math.max(...users.map(u => u.absen || 0)) + 1
            : 1;

        const password = generatePassword(absen, nis);

        users.push({
            absen,
            nis,
            nama,
            kelas,
            nilai: "",
            status: "Aktif",
            password
        });

    } else {
        // EDIT USER
        users[editIndex] = {
            ...users[editIndex],
            nis,
            nama,
            kelas
        };
    }

    saveToStorage();
    modal.hide();
    renderAll();
}

// RENDER TABLE
function renderAll() {
    userTable.innerHTML = "";
    nilaiTable.innerHTML = "";

    users.forEach((u, i) => {

        // Pastikan nilai final valid
        const nilaiFinal = u.nilai == null || u.nilai === "" ? "" : Number(u.nilai);

        // Grade logic
        const grade = nilaiFinal === "" ? "-" : getGrade(nilaiFinal);
        const gradeColor = grade === "-" ? "bg-secondary" : getGradeColor(grade);

        // ================= TABLE DATA SISWA =================
        userTable.innerHTML += `
        <tr>
            <td>${u.absen}</td>
            <td>${u.nis}</td>
            <td>${u.nama}</td>
            <td>${u.kelas}</td>
            <td><span class="badge ${gradeColor}">${grade}</span></td>
            <td>
                <select class="form-select form-select-sm" onchange="updateStatus(${i}, this.value)">
                    <option ${u.status === "Aktif" ? "selected" : ""}>Aktif</option>
                    <option ${u.status === "Nonaktif" ? "selected" : ""}>Nonaktif</option>
                    <option ${u.status === "Libur" ? "selected" : ""}>Libur</option>
                </select>
            </td>
            <td>${u.password}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(${i})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${i})">Hapus</button>
            </td>
        </tr>
        `;

        // ================= TABLE INPUT NILAI =================
        nilaiTable.innerHTML += `
        <tr>
            <td>${u.absen}</td>
            <td>${u.nis}</td>
            <td>${u.nama}</td>
            <td><span class="badge ${gradeColor}">${grade}</span></td>
            <td>
                <button class="btn btn-success btn-sm" onclick="pilih(${i})">
                    Pilih
                </button>
            </td>
        </tr>
        `;
    });
}


// PILIH SISWA INPUT NILAI
function pilih(index) {
    const u = users[index];

    document.getElementById("nilaiIndex").value = index;
    document.getElementById("nilaiNama").value = u.nama;

    document.getElementById("nilaiInputPrak").value = u.nilaiPrak ?? "";
    document.getElementById("nilaiInputTeor").value = u.nilaiTeor ?? "";

    resetNilaiError();
    nilaiModal.show();
}

// SIMPAN NILAI
function simpanNilai() {
    const index = document.getElementById("nilaiIndex").value;

    const inputPrak = document.getElementById("nilaiInputPrak");
    const inputTeor = document.getElementById("nilaiInputTeor");

    const errNilai = document.querySelectorAll("#errNilai");

    let nilaiPrak = inputPrak.value.trim();
    let nilaiTeor = inputTeor.value.trim();

    let valid = true;

    resetNilaiError();

    // VALIDASI PRAKTIKUM
    if (nilaiPrak === "") {
        inputPrak.classList.add("input-error");
        errNilai[0].classList.remove("d-none");
        valid = false;
    }

    // VALIDASI TEORI
    if (nilaiTeor === "") {
        inputTeor.classList.add("input-error");
        errNilai[1].classList.remove("d-none");
        valid = false;
    }

    if (!valid) return;

    nilaiPrak = parseInt(nilaiPrak);
    nilaiTeor = parseInt(nilaiTeor);

    if (isNaN(nilaiPrak) || nilaiPrak < 0) nilaiPrak = 0;
    if (nilaiPrak > 100) nilaiPrak = 100;

    if (isNaN(nilaiTeor) || nilaiTeor < 0) nilaiTeor = 0;
    if (nilaiTeor > 100) nilaiTeor = 100;

    // HITUNG NILAI FINAL (RATA-RATA)
    const nilaiFinal = Math.round((nilaiPrak + nilaiTeor) / 2);

    users[index].nilaiPrak = nilaiPrak;
    users[index].nilaiTeor = nilaiTeor;
    users[index].nilai = nilaiFinal;

    saveToStorage();
    renderAll();
    nilaiModal.hide();
}

// STATUS UPDATE
function updateStatus(index, value) {
    users[index].status = value;
    saveToStorage();
}

// EDIT USER
function editUser(index) {
    const u = users[index];

    document.getElementById("editIndex").value = index;
    document.getElementById("nis").value = u.nis;
    document.getElementById("nama").value = u.nama;
    document.getElementById("kelas").value = u.kelas;

    resetErrors();
    modal.show();
}

// DELETE USER
function deleteUser(index) {
    if (confirm("Hapus siswa ini?")) {
        users.splice(index, 1);
        saveToStorage();
        renderAll();
    }
}

// LOGOUT
function logout() {
    if (confirm("Yakin ingin logout?")) {
        localStorage.removeItem("isAdminLogin");
        window.location.href = "./login.html";
    }
}

// INIT
renderAll();
