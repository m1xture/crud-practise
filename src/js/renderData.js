import cardTemplate from '../card.handlebars';

export default async function renderData({ deleteUrl, editUrl }) {
  try {
    const response = await fetch('http://localhost:3000/movies');
    const data = await response.json();
    data.forEach(movieObj => {
      movieObj.editUrl = editUrl;
      movieObj.deleteUrl = deleteUrl;
    });
    const markup = cardTemplate({ movies: data });
    document.querySelector('.movies').innerHTML = markup;
  } catch (err) {
    console.log('[RENDER ERROR]' + ' ' + err);
    return err;
  }
}
