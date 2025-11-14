window.db = { students: [] };
window.studentList = [];
window.selectedStudentIndex = null;

function loadData() {
  fetch("data.json")
      .then(function (response) {
        return response.json();
      })
    .then(function (data) {
      window.db = data || { students: [] };
      window.studentList = window.db.students || [];
      showStudents();
    })
    .catch(function () {
      window.db = { students: [] };
      window.studentList = [];
      showStudents();
    });
}

function downloadData() {


  window.db.students = window.studentList;
  const jsonText = JSON.stringify(window.db, null, 2);
  const blob = new Blob([jsonText], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "students.json";
  link.click();
}

window.onload = function () {
  loadData();
};
