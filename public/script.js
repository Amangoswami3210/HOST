const tableBody = document.getElementById("tableBody");
const message = document.getElementById("message");
const fileInput = document.getElementById("fileInput");

// Upload file
function uploadFile() {
  if (!fileInput.files.length) {
    alert("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("/upload", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      message.textContent = "File uploaded successfully";
      fileInput.value = "";
      loadFiles();
    });
}

// Load files into table
function loadFiles() {
  fetch("/files")
    .then(res => res.json())
    .then(data => {
      tableBody.innerHTML = "";
      data.forEach((file, index) => {
        tableBody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${file.originalName}</td>
            <td>${file.dateTime}</td>
            <td>${file.version}</td>
            <td>${file.status}</td>
            <td>
              <a href="/download/${file.storedName}">Download</a>
            </td>
          </tr>
        `;
      });
    });
}

// Load table on page refresh
loadFiles();
