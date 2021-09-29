import "../sass/main.scss";
import ImageFinder from './apiService.js';
import refs from "./refs.js";
import galleryCard from '../templates/galleryCard.hbs';
import { Notify } from 'notiflix'; 
import "../../node_modules/basiclightbox/dist/basicLightbox.min.css";
import "../../node_modules/basiclightbox/dist/basicLightbox.min.js";
import '../../node_modules/@pnotify/core/dist/BrightTheme.css';
import "../../node_modules/@pnotify/core/dist/PNotify.css";
import throtle from '../../node_modules/lodash.throttle/index.js'

const imageFinder = new ImageFinder();

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/src/simple-lightbox.scss';

const gallery = new SimpleLightbox('.gallery a');

// const observer = new IntersectionObserver((entries, observer) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       renderFn();
//       observer.unobserve(entry.target);
//     }
//   });
// });

bindEvents();

// functions
function bindEvents() {
    refs.form.addEventListener('submit', e => {
      e.preventDefault();
      imageFinder.query = refs.form.query.value.trim();
      refs.gallery.innerHTML = '';
      renderFn();
  });
}

async function renderFn(isFirstQuery = false) {
  try {
    const data = await imageFinder.getPhotos();

    appendGalleryMarkup(data.hits);

    if (isFirstQuery) {
      if (data.totalHits) Notify.success(`We found ${data.totalHits} images.`);
      else {
        Notify.failure('Please try again.');
        return;
      }
    }

    if (data.hits.length < imageFinder.perPage) {
      Notify.info("Sorry, there are no images matching your search query.");
      return;
    }
      
  } catch (err) {
    console.log(err);
    Notify.failure(`Something wrong(${err.message})`);
  }
}

function appendGalleryMarkup(hits) {
  const markup = galleryCard(hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

window.addEventListener('scroll', throtle(() => { 
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (clientHeight + scrollTop >= scrollHeight-500) {
            renderFn();
        }
        if (scrollTop > 200) { 
            refs.upBtn.classList.remove('is-hidden')
        }
        if (scrollTop < 200) { 
            refs.upBtn.classList.add('is-hidden')
        }
        }, 300)
);