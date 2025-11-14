window.openEducation = openEducation;

let eduPage = 1;
let eduRows = 5;
let eduSearchText = "";
let filteredEdu = [];

let activeFamily = null;
let editEduIndex = null;
let activeFamilyIndex = null;

const classInput = document.getElementById("className");
const subjectInput = document.getElementById("subject");
const marksInput = document.getElementById("marks");

const eduTableBody = document.querySelector("#educationTable tbody");
const eduRowsDropdown = document.getElementById("eduRows");
const eduSearchInput = document.getElementById("searchEdu");

const eduPagination = document.getElementById("eduPagination");
const eduTotalBox = document.getElementById("eduTotal");

const eduPopup = document.getElementById("educationPopup");
const saveEduBtn = document.getElementById("saveEduBtn");
const clearEduBtn = document.getElementById("clearEduBtn");

const eduForm = document.getElementById("educationForm");


// genarate  eduction id 
function generateEduId(educations) {
    if (!educations || educations.length === 0) return 1;

    let max = 0;
    for (let i = 0; i < educations.length; i++) {
        const id = educations[i].eid || 0;
        if (id > max) max = id;
    }
    return max + 1;
}
//open education ppop-up
function openEducation(fid) {

    const s = window.studentList[activeStudentIndex];
    activeFamilyIndex = fid;
    
    const fam = s.families[fid];
    if (!fam) {
        console.error("Family not found:", fid);
        return;
    }
    if (!fam.educations) fam.educations = [];
    activeFamily = fam;
    filteredEdu = fam.educations;

    eduPage = 1;

    showEducation();
    eduPopup.style.display = "flex";
}


//close pop-up
function closeEducation() {
    eduPopup.style.display = "none";
    resetEducationForm();
}

saveEduBtn.onclick = function () {
    const cls = classInput.value.trim();
    const sub = subjectInput.value.trim();
    const mark = marksInput.value.trim();
    
    if (!cls || !sub || !mark) {
        alert("Please fill all fields");
        return;
    }
    const newEdu = {
        eid: generateEduId(activeFamily.educations),
        degree: cls,
        year: sub,
        percentage: mark
    };
    if (editEduIndex === null) {
        activeFamily.educations.push(newEdu);
    }
    else {
        const old = activeFamily.educations[editEduIndex];

        activeFamily.educations[editEduIndex] = {
            eid: old.eid,
            degree: cls,
            year: sub,
            percentage: mark
        };
    }

    resetEducationForm();
    filteredEdu = activeFamily.educations;

    showEducation();
};

function showEducation() {
    const list = filteredEdu;
    const total = list.length;

    let start = (eduPage - 1) * eduRows;
    let end = start + eduRows;

    if (start >= total && total > 0) {
        eduPage = Math.ceil(total / eduRows);
        start = (eduPage - 1) * eduRows;
        end = start + eduRows;
    }

    const part = list.slice(start, end);

    eduTableBody.innerHTML = "";
    let sr = start + 1;

    part.forEach((e, i) => {
        const realIndex = activeFamily.educations.indexOf(e);

        eduTableBody.innerHTML += `
            <tr>
                <td>${sr}</td>
                <td>${e.degree}</td>
                <td>${e.year}</td>
                <td>${e.percentage}</td>
                <td>
                    <button class="btn" onclick="editEducation(${realIndex})">Edit</button>
                    <button class="btn" onclick="deleteEducation(${realIndex})">Delete</button>
                </td>
            </tr>
        `;

        sr++;
    });

    updateEduPagination();
    eduTotalBox.textContent = `Total Records: ${total}`;
}

function editEducation(i) {
    const e = activeFamily.educations[i];

    classInput.value = e.degree;
    subjectInput.value = e.year;
    marksInput.value = e.percentage;

    editEduIndex = i;
    saveEduBtn.textContent = "Update";
}
function deleteEducation(i) {
    if (confirm("Delete this record?")) {
        activeFamily.educations.splice(i, 1);
        filteredEdu = activeFamily.educations;
        showEducation();
    }
}

eduSearchInput.oninput = function () {
    eduSearchText = eduSearchInput.value.toLowerCase().trim();

    filteredEdu = activeFamily.educations.filter(e => {
        return (
            (e.degree || "").toLowerCase().includes(eduSearchText) ||
            (e.year || "").toLowerCase().includes(eduSearchText)
        );
    });

    eduPage = 1;
    showEducation();
};

eduRowsDropdown.onchange = function () {
    eduRows = parseInt(eduRowsDropdown.value);
    eduPage = 1;
    showEducation();
};

function updateEduPagination() {
    const totalPages = Math.ceil(filteredEdu.length / eduRows);

    eduPagination.innerHTML = `
        <button class="btn" onclick="prevEduPage()" ${eduPage === 1 ? "disabled" : ""}>« Prev</button>
        <span>Page ${eduPage} of ${totalPages || 1}</span>
        <button class="btn" onclick="nextEduPage()" ${eduPage === totalPages ? "disabled" : ""}>Next »</button>
    `;
}

function prevEduPage() {
    if (eduPage > 1) {
        eduPage--;
        showEducation();
    }
}

function nextEduPage() {
    const totalPages = Math.ceil(filteredEdu.length / eduRows);

    if (eduPage < totalPages) {
        eduPage++;
        showEducation();
    }
}
function resetEducationForm() {
    eduForm.reset();              
    editEduIndex = null;            
    saveEduBtn.textContent = "Save";
}

clearEduBtn.onclick = function () {
    resetEducationForm();
};

