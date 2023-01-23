const localStorageKey = 'DATA_BOOKSHELF';

const judulBuku = document.querySelector('#judulBuku');
const penulis = document.querySelector('#penulis');
const tahun = document.querySelector('#tahun');
const readed = document.querySelector('#sudahDibaca');
const btnSubmit = document.querySelector('#submit');

let checkInput = [];
let checkJudul = null;
let checkPenulis = null;
let checkTahun = null;

window.addEventListener('load', function () {
  if (localStorage.getItem(localStorageKey) !== null) {
    const dataBookShelf = getData();
    showData(dataBookShelf);
  }
});

btnSubmit.addEventListener('click', function () {
  if (btnSubmit.value == '') {
    checkInput = [];

    judulBuku.classList.remove('error');
    penulis.classList.remove('error');
    tahun.classList.remove('error');

    if (judulBuku.value == '') {
      checkJudul = false;
    } else {
      checkJudul = true;
    }

    if (penulis.value == '') {
      checkPenulis = false;
    } else {
      checkPenulis = true;
    }

    if (tahun.value == '') {
      checkTahun = false;
    } else {
      checkTahun = true;
    }

    checkInput.push(checkJudul, checkPenulis, checkTahun);
    let resultCheck = validation(checkInput);

    if (resultCheck.includes(false)) {
      return false;
    } else {
      const newBook = {
        id: +new Date(),
        judulBuku: judulBuku.value.trim(),
        penulis: penulis.value.trim(),
        tahun: tahun.value,
        isCompleted: readed.checked,
      };
      insertData(newBook);

      judulBuku.value = '';
      penulis.value = '';
      tahun.value = '';
      readed.checked = false;
    }
  } else {
    const bookData = getData().filter((a) => a.id != btnSubmit.value);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    const newBook = {
      id: btnSubmit.value,
      judulBuku: judulBuku.value.trim(),
      penulis: penulis.value.trim(),
      tahun: tahun.value,
      isCompleted: readed.checked,
    };
    insertData(newBook);
    btnSubmit.innerHTML = 'Tambahkan Buku';
    btnSubmit.value = '';
    judulBuku.value = '';
    penulis.value = '';
    tahun.value = '';
    readed.checked = false;
  }
});

function validation(check) {
  let resultCheck = [];

  check.forEach((a, i) => {
    if (a == false) {
      if (i == 0) {
        judulBuku.classList.add('error');
        resultCheck.push(false);
      } else if (i == 1) {
        penulis.classList.add('error');
        resultCheck.push(false);
      } else {
        tahun.classList.add('error');
        resultCheck.push(false);
      }
    }
  });

  return resultCheck;
}

//showData
function showData(books = []) {
  const inCompleted = document.querySelector('#incompleteBookshelfList');
  const completed = document.querySelector('#completeBookshelfList');

  inCompleted.innerHTML = '';
  completed.innerHTML = '';

  books.forEach((book) => {
    if (book.isCompleted == false) {
      let el = `
            <article class="book_item">
                <h3>${book.judulBuku}</h3>
                <p>Penulis: ${book.penulis}</p>
                <p>Tahun: ${book.tahun}</p>

                <div class="action">
                    <button class="green" onclick="readedBook('${book.id}')">Selesai dibaca</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;

      inCompleted.innerHTML += el;
    } else {
      let el = `
            <article class="book_item">
                <h3>${book.judulBuku}</h3>
                <p>Penulis: ${book.penulis}</p>
                <p>Tahun: ${book.tahun}</p>

                <div class="action">
                    <button class="green" onclick="unreadedBook('${book.id}')">Belum selesai di Baca</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;
      completed.innerHTML += el;
    }
  });
}

//Tambah data
function insertData(book) {
  let bookData = [];

  if (localStorage.getItem(localStorageKey) === null) {
    localStorage.setItem(localStorageKey, 0);
  } else {
    bookData = JSON.parse(localStorage.getItem(localStorageKey));
  }

  bookData.unshift(book);
  localStorage.setItem(localStorageKey, JSON.stringify(bookData));

  showData(getData());
}

function getData() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}


//Selesai Dibaca
function readedBook(id) {
  let confirmation = confirm('Pindahkan ke bagian selesai dibaca?');

  if (confirmation == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: bookDataDetail[0].id,
      judulBuku: bookDataDetail[0].judulBuku,
      penulis: bookDataDetail[0].penulis,
      tahun: bookDataDetail[0].tahun,
      isCompleted: true,
    };

    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    insertData(newBook);
  } else {
    return 0;
  }
}

//Belum selesai dibaca
function unreadedBook(id) {
  let confirmation = confirm('Pindahkan ke bagian belum selesai dibaca?');

  if (confirmation == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: bookDataDetail[0].id,
      judulBuku: bookDataDetail[0].judulBuku,
      penulis: bookDataDetail[0].penulis,
      tahun: bookDataDetail[0].tahun,
      isCompleted: false,
    };

    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    insertData(newBook);
  } else {
    return 0;
  }
}

function editBook(id) {
  const bookDataDetail = getData().filter((a) => a.id == id);
  judulBuku.value = bookDataDetail[0].judulBuku;
  penulis.value = bookDataDetail[0].penulis;
  tahun.value = bookDataDetail[0].tahun;
  bookDataDetail[0].isCompleted ? (readed.checked = true) : (readed.checked = false);

  btnSubmit.innerHTML = 'Edit buku';
  btnSubmit.value = bookDataDetail[0].id;
}

function deleteBook(id) {
  let confirmation = confirm('Hapus Buku?');

  if (confirmation == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));
    showData(getData());
  } else {
    return 0;
  }
}
