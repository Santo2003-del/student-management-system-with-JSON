let familyPage = 1;
let familyRows = 5;
let familySearchText = "";
let filteredFamilies = [];

let activeStudentIndex = null;
let editingFamilyIndex = null;

const memberNameInput = document.getElementById("memberName");
const relationInput = document.getElementById("relation");
const memberPhoneInput = document.getElementById("memberPhone");

const familyTableBody = document.querySelector("#familyTable tbody");
const familyRowsDropdown = document.getElementById("familyRows");
const familySearchInput = document.getElementById("searchFamily");

const familyPagination = document.getElementById("familyPagination");
const familyTotalBox = document.getElementById("familyTotal");

const familyPopup = document.getElementById("familyPopup");
const saveFamilyBtn = document.getElementById("saveFamilyBtn");
const clearFamilyBtn = document.getElementById("clearFamilyBtn");

const familyForm = document.getElementById("familyForm");


// ganerate  family id to this
function generateFamilyId(families) {
    if (!families || families.length === 0) return 1;

    let max = 0;
    for (let i = 0; i < families.length; i++) {
        const id = families[i].fid || 0;
        if (id > max) max = id;
    }
    return max + 1;
}


//open family pop-up  to this
function openFamily(index) {
    activeStudentIndex = index;

    const s = window.studentList[index];
    if (!s.families) s.families = [];

    filteredFamilies = s.families;
    familyPage = 1;

    showFamilies();
    familyPopup.style.display = "flex";
}
//close pop-up
function closeFamily() {
    familyPopup.style.display = "none";
    resetFamilyForm();
}
//save falily deatils too  it
saveFamilyBtn.onclick = function () {
    const name = memberNameInput.value.trim();
    const rel = relationInput.value.trim();
    const phone = memberPhoneInput.value.trim();

    if (!name || !rel || !phone) {
        alert("Please fill all fields");
        return;
    }

    const s = window.studentList[activeStudentIndex];

    const newFamily = {
        fid: generateFamilyId(s.families),
        memberName: name,
        relation: rel,
        phone: phone,
        educations: []
    };
    if (editingFamilyIndex === null) {
        s.families.push(newFamily);
    }
    else {
        const old = s.families[editingFamilyIndex];
        s.families[editingFamilyIndex] = {
            fid: old.fid,
            memberName: name,
            relation: rel,
            phone: phone,
            educations: old.educations || []
        };
    }
    resetFamilyForm();
    filteredFamilies = s.families;
    showFamilies();
};
//show family table
function showFamilies() {
    const list = filteredFamilies;
    const total = list.length;

    let start = (familyPage - 1) * familyRows;
    let end = start + familyRows;

    if (start >= total && total > 0) {
        familyPage = Math.ceil(total / familyRows);
        start = (familyPage - 1) * familyRows;
        end = start + familyRows;
    }
    const part = list.slice(start, end);
    familyTableBody.innerHTML = "";
    let sr = start + 1;
    part.forEach((f, i) => {
        const realIndex = window.studentList[activeStudentIndex].families.indexOf(f);

        familyTableBody.innerHTML += `
            <tr>
                <td>${sr}</td>
                <td>${f.memberName}</td>
                <td>${f.relation}</td>
                <td>${f.phone}</td>
                <td>
                    <button class="btn" onclick="editFamily(${realIndex})">Edit</button>
                    <button class="btn" onclick="deleteFamily(${realIndex})">Delete</button>
                    <button class="btn" onclick="openEducation(${realIndex})">Education</button>
                </td>
            </tr>
        `;
        sr++;
    });

    updateFamilyPagination();
    familyTotalBox.textContent = `Total Records: ${total}`;
}
function editFamily(i) {
    const s = window.studentList[activeStudentIndex];
    const f = s.families[i];

    memberNameInput.value = f.memberName;
    relationInput.value = f.relation;
    memberPhoneInput.value = f.phone;

    editingFamilyIndex = i;
    saveFamilyBtn.textContent = "Update";
}

function deleteFamily(i) {
    const s = window.studentList[activeStudentIndex];

    if (confirm("Delete this member?")) {
        s.families.splice(i, 1);
        filteredFamilies = s.families;
        showFamilies();
    }
}

familySearchInput.oninput = function () {
 const s = window.studentList[activeStudentIndex];
 const t = familySearchInput.value.toLowerCase().trim();

    filteredFamilies = s.families.filter(f => {
        return (
            f.memberName.toLowerCase().includes(t) ||
            f.relation.toLowerCase().includes(t) ||
            f.phone.toLowerCase().includes(t)
        );
    });

    familyPage = 1;
    showFamilies();
};

familyRowsDropdown.onchange = function () {
    familyRows = parseInt(familyRowsDropdown.value);
    familyPage = 1;
    showFamilies();
};

function updateFamilyPagination() {
    const totalPages = Math.ceil(filteredFamilies.length / familyRows);

    familyPagination.innerHTML = `
        <button class="btn" onclick="prevFamilyPage()" ${familyPage === 1 ? "disabled" : ""}>« Prev</button>
        <span>Page ${familyPage} of ${totalPages || 1}</span>
        <button class="btn" onclick="nextFamilyPage()" ${familyPage === totalPages ? "disabled" : ""}>Next »</button>
    `;
}

function prevFamilyPage() {
    if (familyPage > 1) {
        familyPage--;
        showFamilies();
    }
}

function nextFamilyPage() {
    const totalPages = Math.ceil(filteredFamilies.length / familyRows);
    if (familyPage < totalPages) {
        familyPage++;
        showFamilies();
    }
}

function resetFamilyForm() {
    familyForm.reset();            
    editingFamilyIndex = null;       
    saveFamilyBtn.textContent = "Save";
}

clearFamilyBtn.onclick = function () {
    resetFamilyForm();
};

