import renderData from './js/renderData';

const imgUrls = {
  editUrl: document.querySelector('[data-edit-img]').href.baseVal,
  deleteUrl: document.querySelector('[data-delete-img]').href.baseVal,
};
const refs = {
  overlayEl: document.querySelector('.overlay'),
  addBtnEl: document.querySelector('[data-add]'),
};

renderData(imgUrls);

function toggleForm() {
  refs.overlayEl.classList.toggle('is-hidden');
}

refs.addBtnEl.addEventListener('click', toggleForm);
refs.overlayEl.addEventListener('click', e => {
  if (e.target.classList.contains('overlay')) {
    toggleForm();
  }
});

async function getNewId() {
  try {
    const response = await fetch('http://localhost:3000/movies');
    const data = await response.json();
    return (await data.length) + 1;
  } catch (err) {
    console.log(err);
  }
}

async function postNewMovie(obj) {
  try {
    const options = {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    };
    await fetch('http://localhost:3000/movies', options);
    return true;
  } catch (err) {
    console.log(err);
  }
}

document
  .querySelector('[data-add-form]')
  .addEventListener('submit', async e => {
    e.preventDefault();
    const id = await getNewId();
    const formData = {
      id: id,
      title: e.target.title.value,
      genre: e.target.genre.value,
      director: e.target.director.value,
      year: e.target.year.value,
    };
    let errors = 0;
    Object.values(formData).forEach(elem => {
      if (!!!elem) errors++;
    });
    if (errors === 0) {
      const resp = await postNewMovie(formData);
      if (resp) {
        toggleForm();
        renderData(imgUrls);
      }
    }
  });

async function deleteMovie(id) {
  try {
    await fetch(`http://localhost:3000/movies/${Number(id)}`, {
      method: 'DELETE',
    });
    return await true;
  } catch (err) {
    console.log(err);
  }
}

async function editMovie(id) {
  toggleForm();
  const response = await fetch(`http://localhost:3000/movies?id=${Number(id)}`);
  const data = await response.json();
}

document.querySelector('.movies').addEventListener('click', async e => {
  if (
    e.target.nodeName === 'BUTTON' ||
    e.target.nodeName === 'svg' ||
    e.target.nodeName === 'use'
  ) {
    let cardId = 0;
    let buttonEl;
    if (e.target.nodeName === 'BUTTON') {
      buttonEl = e.target;
      cardId = e.target.parentNode.parentNode.dataset.id;
    }
    if (e.target.nodeName === 'svg') {
      buttonEl = e.target.parentNode;
      cardId = e.target.parentNode.parentNode.parentNode.dataset.id;
    }
    if (e.target.nodeName === 'use') {
      buttonEl = e.target.parentNode.parentNode;
      cardId = e.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
    }
    let status = false;
    if (buttonEl.classList.contains('delete-btn')) {
      status = await deleteMovie(cardId);
    } else {
      status;
    }
    if (status) {
      renderData(imgUrls);
    }
  }
});
