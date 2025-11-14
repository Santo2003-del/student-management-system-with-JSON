let viewStudent = null;

let viewFamPage = 1;
let viewFamRows = 5;
let viewFamSearch = "";
let viewFamFiltered = [];

let viewEduPage = 1;
let viewEduRows = 5;
let viewEduSearch = "";
let viewEduFiltered = [];

const viewPopup = document.getElementById("viewPopup");
const viewContainer = document.getElementById("viewContainer");

window.openView = openView;

function openView(index) {
    viewStudent = window.studentList[index];

    viewFamPage = 1;
    viewFamRows = 5;
    viewFamSearch = "";

    viewEduPage = 1;
    viewEduRows = 5;
    viewEduSearch = "";

    renderView();
    viewPopup.style.display = "flex";
}

function closeView() {
    viewPopup.style.display = "none";
}

function renderView() {
    const s = viewStudent;

    viewContainer.innerHTML = `
        <div class="popup-section">
            <p><b>Name:</b> ${s.fname} ${s.lname}</p>
            <p><b>Gender:</b> ${s.gender}</p>
            <p><b>Phone:</b> ${s.phone}</p>
            <p><b>Email:</b> ${s.email}</p>
            <p><b>Address:</b> ${s.address}</p>
        </div>

        <hr>

        ${sectionHTML(
            "Family Members",
            "vFamRows", "vFamSearch", "vFamTable",
            "vFamPrev", "vFamPageText", "vFamNext", "vFamTotal"
        )}

        <hr>

        ${sectionHTML(
            "Education Details",
            "vEduRows", "vEduSearch", "vEduTable",
            "vEduPrev", "vEduPageText", "vEduNext", "vEduTotal"
        )}
    `;

    bindViewEvents();
    showViewFamily();
    showViewEducation();
}

function sectionHTML(title, rows, search, table, prev, page, next, total) {
    return `
    <div class="popup-section">
        <h4>${title}</h4>

        <div class="table-controls">
            <div>
                <label>Rows:</label>
                <select id="${rows}">
                    <option>5</option>
                    <option>10</option>
                </select>
            </div>

            <div>
                <label>Search:</label>
                <input type="text" id="${search}" placeholder="Search...">
            </div>
        </div>

        <table id="${table}">
            <thead></thead>
            <tbody></tbody>
        </table>

        <div class="pagination-box">
            <button id="${prev}" class="btn">« Prev</button>
            <span id="${page}">Page 1 of 1</span>
            <button id="${next}" class="btn">Next »</button>
        </div>

        <p id="${total}">Total Records: 0</p>
    </div>`;
}

/* ---------------- FAMILY SECTION ---------------- */

function filterViewFamilies() {
    let list = viewStudent.families || [];
    if (!viewFamSearch) return list;

    let t = viewFamSearch.toLowerCase();
    let out = [];

    for (let i = 0; i < list.length; i++) {
        let f = list[i];
        if (
            f.memberName.toLowerCase().includes(t) ||
            f.relation.toLowerCase().includes(t) ||
            f.phone.toLowerCase().includes(t)
        ) {
            out.push(f);
        }
    }
    return out;
}

function showViewFamily() {
    const tbody = document.querySelector("#vFamTable tbody");
    const thead = document.querySelector("#vFamTable thead");

    let list = filterViewFamilies();
    let total = list.length;

    thead.innerHTML = `
        <tr>
            <th>Sr</th>
            <th>Name</th>
            <th>Relation</th>
            <th>Phone</th>
        </tr>
    `;

    let totalPages = Math.ceil(total / viewFamRows);
    if (totalPages < 1) totalPages = 1;

    if (viewFamPage > totalPages) viewFamPage = totalPages;

    let start = (viewFamPage - 1) * viewFamRows;
    let end = start + viewFamRows;

    tbody.innerHTML = "";
    let sr = start + 1;

    for (let i = start; i < end && i < total; i++) {
        let f = list[i];
        tbody.innerHTML += `
            <tr>
                <td>${sr}</td>
                <td>${f.memberName}</td>
                <td>${f.relation}</td>
                <td>${f.phone}</td>
            </tr>
        `;
        sr++;
    }

    document.getElementById("vFamPageText").textContent = "Page " + viewFamPage + " of " + totalPages;
    document.getElementById("vFamTotal").textContent = "Total Records: " + total;

    document.getElementById("vFamPrev").disabled = viewFamPage === 1;
    document.getElementById("vFamNext").disabled = viewFamPage === totalPages;
}

/* ---------------- EDUCATION SECTION ---------------- */

function flattenEducations() {
    const fam = viewStudent.families || [];
    let temp = [];

    for (let i = 0; i < fam.length; i++) {
        let e = fam[i].educations || [];
        for (let j = 0; j < e.length; j++) {
            temp.push({
                member: fam[i].memberName,
                degree: e[j].degree,
                year: e[j].year,
                percentage: e[j].percentage
            });
        }
    }
    return temp;
}

function filterViewEducation() {
    let list = flattenEducations();
    if (!viewEduSearch) return list;

    let t = viewEduSearch.toLowerCase();
    let out = [];

    for (let i = 0; i < list.length; i++) {
        let e = list[i];
        if (
            e.member.toLowerCase().includes(t) ||
            e.degree.toLowerCase().includes(t) ||
            e.year.toLowerCase().includes(t)
        ) {
            out.push(e);
        }
    }
    return out;
}

function showViewEducation() {
    const tbody = document.querySelector("#vEduTable tbody");
    const thead = document.querySelector("#vEduTable thead");

    let list = filterViewEducation();
    let total = list.length;

    thead.innerHTML = `
        <tr>
            <th>Sr</th>
            <th>Family Member</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Marks</th>
        </tr>
    `;

    let totalPages = Math.ceil(total / viewEduRows);
    if (totalPages < 1) totalPages = 1;

    if (viewEduPage > totalPages) viewEduPage = totalPages;

    let start = (viewEduPage - 1) * viewEduRows;
    let end = start + viewEduRows;

    tbody.innerHTML = "";
    let sr = start + 1;

    for (let i = start; i < end && i < total; i++) {
        let e = list[i];
        tbody.innerHTML += `
            <tr>
                <td>${sr}</td>
                <td>${e.member}</td>
                <td>${e.degree}</td>
                <td>${e.year}</td>
                <td>${e.percentage}</td>
            </tr>
        `;
        sr++;
    }

    document.getElementById("vEduPageText").textContent = "Page " + viewEduPage + " of " + totalPages;
    document.getElementById("vEduTotal").textContent = "Total Records: " + total;

    document.getElementById("vEduPrev").disabled = viewEduPage === 1;
    document.getElementById("vEduNext").disabled = viewEduPage === totalPages;
}

/* ---------------- EVENTS ---------------- */

function bindViewEvents() {
    const famRows = document.getElementById("vFamRows");
    const famSearch = document.getElementById("vFamSearch");

    famRows.value = viewFamRows;
    famSearch.value = viewFamSearch;

    famRows.onchange = function () {
        viewFamRows = parseInt(this.value);
        viewFamPage = 1;
        showViewFamily();
    };

    famSearch.oninput = function () {
        viewFamSearch = this.value.toLowerCase().trim();
        viewFamPage = 1;
        showViewFamily();
    };

    document.getElementById("vFamPrev").onclick = function () {
        if (viewFamPage > 1) {
            viewFamPage--;
            showViewFamily();
        }
    };

    document.getElementById("vFamNext").onclick = function () {
        let list = filterViewFamilies();
        let totalPages = Math.ceil(list.length / viewFamRows);
        if (viewFamPage < totalPages) {
            viewFamPage++;
            showViewFamily();
        }
    };

    const eduRows = document.getElementById("vEduRows");
    const eduSearch = document.getElementById("vEduSearch");

    eduRows.value = viewEduRows;
    eduSearch.value = viewEduSearch;

    eduRows.onchange = function () {
        viewEduRows = parseInt(this.value);
        viewEduPage = 1;
        showViewEducation();
    };

    eduSearch.oninput = function () {
        viewEduSearch = this.value.toLowerCase().trim();
        viewEduPage = 1;
        showViewEducation();
    };

    document.getElementById("vEduPrev").onclick = function () {
        if (viewEduPage > 1) {
            viewEduPage--;
            showViewEducation();
        }
    };

    document.getElementById("vEduNext").onclick = function () {
        let list = filterViewEducation();
        let totalPages = Math.ceil(list.length / viewEduRows);
        if (viewEduPage < totalPages) {
            viewEduPage++;
            showViewEducation();
        }
    };
}
