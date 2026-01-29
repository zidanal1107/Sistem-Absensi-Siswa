let users = JSON.parse(localStorage.getItem("usersData")) || [];

// Fallback jika corrupt
if (!Array.isArray(users)) users = [];

const userTable = document.getElementById("userTable");
const nilaiTable = document.getElementById("nilaiTable");

function saveToStorage() {
    localStorage.setItem("usersData", JSON.stringify(users));
}

// Navigation
function showSection(section) {
    document.getElementById("usersSection").classList.add("d-none");
    document.getElementById("nilaiSection").classList.add("d-none");

    if (section === "users") document.getElementById("usersSection").classList.remove("d-none");
    if (section === "nilai") document.getElementById("nilaiSection").classList.remove("d-none");
}

// Modal
const modal = new bootstrap.Modal(document.getElementById("userModal"));

function openAddModal() {
    document.getElementById("editIndex").value = "";
    document.getElementById("nis").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("kelas").value = "";
    modal.show();
}

// Grade converter
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

// Save user
function saveUser() {
    const nis = document.getElementById("nis").value.trim();
    const nama = document.getElementById("nama").value.trim();
    const kelas = document.getElementById("kelas").value.trim();
    const editIndex = document.getElementById("editIndex").value;

    if (!nis || !nama || !kelas) {
        alert("Lengkapi semua data!");
        return;
    }

    // Anti duplikat NIS
    const duplicate = users.some((u, i) => u.nis === nis && i != editIndex);
    if (duplicate) {
        alert("NIS sudah terdaftar!");
        return;
    }

    if (editIndex === "") {
        users.push({
            nis,
            nama,
            kelas,
            nilai: "",
            status: "Aktif"
        });
    } else {
        users[editIndex] = { ...users[editIndex], nis, nama, kelas };
    }

    saveToStorage();
    modal.hide();
    renderAll();
}

// Render
function renderAll() {
    userTable.innerHTML = "";
    nilaiTable.innerHTML = "";

    users.forEach((u, i) => {
        const nilai = u.nilai === "" || u.nilai == null ? "" : Number(u.nilai);
        const grade = nilai === "" ? "-" : getGrade(nilai);
        const gradeColor = grade === "-" ? "bg-secondary" : getGradeColor(grade);

        // DATA SISWA
        userTable.innerHTML += `
        <tr>
            <td>${i + 1}</td>
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
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(${i})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${i})">Hapus</button>
            </td>
        </tr>
        `;

        // NILAI
        nilaiTable.innerHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${u.nis}</td>
            <td>${u.nama}</td>
            <td>
                <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    class="form-control form-control-sm" 
                    value="${nilai === "" ? "" : nilai}" 
                    onchange="updateNilai(${i}, this.value)">
            </td>
            <td><span class="badge ${gradeColor}">${grade}</span></td>
        </tr>
        `;
    });
}


// Update nilai
function updateNilai(index, value) {
    let nilai = parseInt(value);

    if (isNaN(nilai) || nilai < 0) nilai = 0;
    if (nilai > 100) nilai = 100;

    users[index].nilai = nilai;
    saveToStorage();
    renderAll();
}

// Update status
function updateStatus(index, value) {
    users[index].status = value;
    saveToStorage();
    renderAll();
}

// Edit user
function editUser(index) {
    const u = users[index];
    document.getElementById("editIndex").value = index;
    document.getElementById("nis").value = u.nis;
    document.getElementById("nama").value = u.nama;
    document.getElementById("kelas").value = u.kelas;
    modal.show();
}

// Delete user
function deleteUser(index) {
    if (confirm("Hapus siswa ini?")) {
        users.splice(index, 1);
        saveToStorage();
        renderAll();
    }
}

// Logout
function logout() {
    if (confirm("Yakin ingin logout?")) {
        localStorage.removeItem("isAdminLogin");
        window.location.href = "./login.html";
    }
}

// Init
renderAll();
