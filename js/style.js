const bookmarkForm = document.getElementById('bookmarkForm');
const siteTitleInput = document.getElementById('siteName');
const siteURLInput = document.getElementById('siteURL');
const bookmarkList = document.getElementById('bookmarkList');

let bookmarks = [];

bookmarkForm.setAttribute('novalidate', true);

window.addEventListener('DOMContentLoaded', function () {
  const savedBookmarks = localStorage.getItem('bookmarks');
  if (savedBookmarks) {
    bookmarks = JSON.parse(savedBookmarks);
    renderBookmarks();
  }
});

bookmarkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const siteName = siteTitleInput.value.trim();
  const siteURL = siteURLInput.value.trim();

  if (addBookmark(siteName, siteURL)) {
    siteTitleInput.value = '';
    siteURLInput.value = '';
    resetValidationStates(siteTitleInput);
    resetValidationStates(siteURLInput);
  }
});

function isValidURL(url) {
  const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

function addBookmark(name, url) {
  if (!name || !url) {
    showAlert();
    return false;
  }

  if (name.length < 3) {
    showAlert();
    return false;
  }

  if (!isValidURL(url)) {
    showAlert();
    return false;
  }

  const isDuplicate = bookmarks.some(bookmark =>
    bookmark.name.toLowerCase() === name.toLowerCase() || bookmark.url.toLowerCase() === url.toLowerCase()
  );

  if (isDuplicate) {
    return false;
  }

  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  bookmarks.push({ name: formattedName, url });
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();

  return true;
}

function resetValidationStates(input) {
  input.classList.remove('invalid', 'valid');
  input.style.boxShadow = '';
  input.style.border = '';
  input.setCustomValidity('');

  const label = input.previousElementSibling;
  const iconValid = label.querySelector('.valid-icon');
  const iconInvalid = label.querySelector('.invalid-icon');

  if (iconValid) iconValid.style.display = 'none';
  if (iconInvalid) iconInvalid.style.display = 'none';
}

function showAlert() {
  Swal.fire({
    title: `
      <h2 style="font-family: 'Arial', sans-serif; font-size: 30px; color:#D30820 ; text-align: center; ">
        Invalid Input
      </h2>

    `,
    html: `
      <div style="font-family: 'Verdana', sans-serif; font-size: 20px; color: black; text-align:left ; margin-top: 15px;">
        <p> 1. Site name must contain at least 3 characters. </p>
        <p> 2. Site URL must be valid (e.g., https://example.com). </p>
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
    backdrop: 'rgba(0, 0, 0, 0.10)',
    width: '550px',
    padding: '10px',
  });
}

function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
}


function renderBookmarks() {
  bookmarkList.innerHTML = '';
  bookmarks.forEach((bookmark, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-family: 'Tahoma', sans-serif; font-size: 16px;">${index + 1}</td>
      <td style="font-family: 'Tahoma', sans-serif; font-size: 16px;">${bookmark.name}</td>
      <td>
        <a href="${bookmark.url}" class="visit-btn" target="_blank" style="font-family: 'Verdana', sans-serif; font-size: 14px;">
          <i class="fa-regular fa-eye"></i> Visit
        </a>
      </td>
      <td>
        <button class="delete-btn" onclick="deleteBookmark(${index})" style="font-family: 'Verdana', sans-serif; font-size: 14px;">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </td>
    `;
    bookmarkList.appendChild(row);
  });
}


siteTitleInput.addEventListener('input', () => validateInput(siteTitleInput));
siteURLInput.addEventListener('input', () => validateInput(siteURLInput));


function validateInput(input) {
  const label = input.previousElementSibling;
  const iconValid = label.querySelector('.valid-icon');
  const iconInvalid = label.querySelector('.invalid-icon');

  if (input === siteTitleInput) {
    if (input.value.trim().length >= 3) {
      input.classList.add('valid');
      input.classList.remove('invalid');
      if (iconValid) iconValid.style.display = 'inline';
      if (iconInvalid) iconInvalid.style.display = 'none';
    } else {
      input.classList.add('invalid');
      input.classList.remove('valid');
      if (iconValid) iconValid.style.display = 'none';
      if (iconInvalid) iconInvalid.style.display = 'inline';
    }
  } else if (input === siteURLInput) {
    if (isValidURL(input.value)) {
      input.classList.add('valid');
      input.classList.remove('invalid');
      if (iconValid) iconValid.style.display = 'inline';
      if (iconInvalid) iconInvalid.style.display = 'none';
    } else {
      input.classList.add('invalid');
      input.classList.remove('valid');
      if (iconValid) iconValid.style.display = 'none';
      if (iconInvalid) iconInvalid.style.display = 'inline';
    }
  }
}

