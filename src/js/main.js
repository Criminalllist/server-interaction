import '../styles/style.css';

const resultElement = document.querySelector('[data-js-result]');

const createPostFormElement = document.querySelector('[data-js-create-form]');

createPostFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const formData = new FormData(createPostFormElement);
  const formDataObject = Object.fromEntries(formData);

  fetch('http://localhost:3000/posts', {
    method: 'POST',
    body: JSON.stringify({ ...formDataObject, views: 0 }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
});

const getPostByIdFormElement = document.querySelector('[data-js-get-form]');
const postIdFieldElement =
  getPostByIdFormElement.querySelector('[data-js-id-field]');

getPostByIdFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  fetch(`http://localhost:3000/posts/${postIdFieldElement.value}`)
    .then((response) => {
      if (!response.ok) {
        const errorMessage =
          response.status === 404
            ? 'Пост с указанными id не найден'
            : 'Что-то пошло не так, пожалуйста, попробуйте еще раз';
        throw new Error(errorMessage);
      }

      return response.json();
    })
    .then((data) => {
      const { title, views } = data;
      console.log(views);

      resultElement.innerHTML = `<span> ${title} | просмотров: ${views}</span>`;
    })
    .catch((error) => {
      resultElement.innerHTML = `<span>${error}</span>`;
    });
});

const searchPostFormElement = document.querySelector('[data-js-search-form]');
const searchViewsFieldElement = searchPostFormElement.querySelector(
  '[data-js-search-field]',
);

searchPostFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  fetch(`http://localhost:3000/posts?views_ne=${searchViewsFieldElement.value}`)
    .then((response) => response.json())
    .then((data) => {
      resultElement.innerHTML = data
        .map(
          ({ title, views }) => `<span>${title} просмотров: ${views};  </span>`,
        )
        .join('');
    });
});
