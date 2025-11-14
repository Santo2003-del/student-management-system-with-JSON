// ===== Variables =====
let currentPage = 1;
let rowsPerPage = parseInt(document.getElementById("rowsPerPage").value);
let searchText = "";
let filteredStudents = [];

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const genderInput = document.getElementById("gender");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");

const saveBtn = document.getElementById("saveStudentBtn");
const resetBtn = document.getElementById("resetStudentBtn");

const rowsDropdown = document.getElementById("rowsPerPage");
const searchInput = document.getElementById("searchStudent");

const studentTableBody = document.querySelector("#studentTable tbody");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const pageText = document.getElementById("pageText");
const totalBox = document.getElementById("totalBox");


// ========= SIMPLE NUMERIC ID GENERATOR =========
function generateStudentId() {
  const students = window.studentList || [];

  if (students.length === 0) {
    return 1;
  }

  let maxId = 0;

  for (let i = 0; i < students.length; i++) {
    const sid = students[i].id || 0;
    if (sid > maxId) {
      maxId = sid;
    }
  }

  return maxId + 1;
}


// ========= SAVE / UPDATE STUDENT =========
saveBtn.onclick = function () {
  const fname = firstNameInput.value;
  const lname = lastNameInput.value;
  const gender = genderInput.value;
  const phone = phoneInput.value;
  const email = emailInput.value;
  const address = addressInput.value;

  // same simple behaviour, just keep id + families correctly
  if (window.selectedStudentIndex === null) {
    // ADD NEW STUDENT
    const s = {
      id: generateStudentId(),
      fname: fname,
      lname: lname,
      gender: gender,
      phone: phone,
      email: email,
      address: address,
      families: []
    };
    window.studentList.push(s);
  } else {
    // UPDATE EXISTING STUDENT (keep old id + families)
    const old = window.studentList[window.selectedStudentIndex] || {};
    const updated = {
      id: old.id || generateStudentId(),
      fname: fname,
      lname: lname,
      gender: gender,
      phone: phone,
      email: email,
      address: address,
      families: old.families || []
    };

    window.studentList[window.selectedStudentIndex] = updated;
    window.selectedStudentIndex = null;
    saveBtn.textContent = "Save";
  }

  resetBtn.click();
  showStudents();
};


// this function use to display table
function showStudents() {
  const list = searchText ? filteredStudents : window.studentList;

  const total = list.length;
  let start = (currentPage - 1) * rowsPerPage;
  let end = start + rowsPerPage;

  // if we deleted records and current page is out of range
  if (start >= total && total > 0) {
    currentPage = Math.ceil(total / rowsPerPage);
    start = (currentPage - 1) * rowsPerPage;
    end = start + rowsPerPage;
  }

  const part = list.slice(start, end);

  studentTableBody.innerHTML = "";
  let sr = start + 1;

  part.forEach(function (s, i) {
    // find real index of this student in main studentList
    const realIndex = window.studentList.indexOf(s);

    studentTableBody.innerHTML += `
            <tr>
                <td>${sr}</td>
                <td>${s.fname}</td>
                <td>${s.lname}</td>
                <td>${s.gender}</td>
                <td>${s.phone}</td>
                <td>${s.email}</td>
                <td>${s.address}</td>
                <td>
                    <button class="btn" onclick="editStudent(${realIndex})">Edit</button>
                    <button class="btn" onclick="deleteStudent(${realIndex})">Delete</button>
                    <button class="btn" onclick="openFamily(${realIndex})">Family</button>
                    <button class="btn" onclick="openView(${realIndex})">View</button>
                </td>
            </tr>
        `;
    sr++;
  });

  totalBox.textContent = "Total Records: " + total;
  updatePagination();
}



function editStudent(i) {
  const s = window.studentList[i];

  firstNameInput.value = s.fname;
  lastNameInput.value = s.lname;
  genderInput.value = s.gender;
  phoneInput.value = s.phone;
  emailInput.value = s.email;
  addressInput.value = s.address;

  window.selectedStudentIndex = i;
  saveBtn.textContent = "Update";
}



function deleteStudent(i) {
  if (confirm("Delete this student?")) {
    window.studentList.splice(i, 1);
    showStudents();
  }
}


searchInput.oninput = function () {
  searchText = searchInput.value.toLowerCase().trim();

  filteredStudents = window.studentList.filter(function (s) {
    return (
      (s.fname || "").toLowerCase().includes(searchText) ||
      (s.lname || "").toLowerCase().includes(searchText) ||
      (s.email || "").toLowerCase().includes(searchText)
    );
  });

  currentPage = 1;
  showStudents();
};


function updatePagination() {
  const list = searchText ? filteredStudents : window.studentList;
  const totalPages = Math.ceil(list.length / rowsPerPage);

  pageText.textContent = `Page ${currentPage} of ${totalPages || 1}`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages || totalPages === 0;
}


prevButton.onclick = function () {
  if (currentPage > 1) {
    currentPage--;
    showStudents();
  }
};


nextButton.onclick = function () {
  const list = searchText ? filteredStudents : window.studentList;
  const totalPages = Math.ceil(list.length / rowsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    showStudents();
  }
};


//this code define row per page
rowsDropdown.onchange = function () {
  rowsPerPage = parseInt(rowsDropdown.value);
  currentPage = 1;
  showStudents();
};


// extra: when user clicks Reset manually, exit edit mode too
resetBtn.onclick = function () {
  window.selectedStudentIndex = null;
  saveBtn.textContent = "Save";
};
