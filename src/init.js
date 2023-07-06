import * as _ from 'lodash';
import onChange from 'on-change';
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import getPosts from './controllers.js';
import {
  renderFeedFyrstly,
  renderPostsFirstly,
  renderModal,
  blockUi,
  unBlockUi,
  showError,
} from './view.js';

export const elements = {
  form: document.getElementById('rss-form'),
  formElement: document.getElementById('url-input'),
  input: document.getElementById('url-input'),
  output: document.getElementById('output'),
  btn: document.querySelector('.btn'),
};

// const i18nextInstance = i18next.createInstance();

i18next.init({
  lng: 'ru', // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    ru: {
      translation: {
        double: 'RSS уже существует',
        'name must be a valid URL': 'Ссылка должна быть валидным URL',
        badurl: 'Ресурс не содержит валидный RSS',
        'Network Error': 'Ошибка сети',
        success: 'RSS успешно загружен',
        empty: 'Не должно быть пустым',
        viewMessage: 'Просмотр',
      },
    },
  },
});

export const mystate = {
  error: '',
  formProcess: {
    error: '',
    state: 'filling',
    valid: '',
  },
  feeds: [],
  valuefrominput: ' ',
  arrayUrl: [],
  feed: {
    title: [],
    description: [],
    posts: [],
  },
};

export const watchedState = onChange(mystate, (path, value, previousValue) => {
  console.log(path);
  console.log(value);
  console.log(previousValue);
  switch (path) {
    case 'feed.posts':
      renderPostsFirstly(mystate.feed, 'viewMessage', i18next);
      renderFeedFyrstly(mystate.feed);
      break;
    case 'feed.title':
      renderFeedFyrstly(mystate.feed);
      break;
    case 'feed.description':
      renderFeedFyrstly(mystate.feed);
      break;
    case 'formProcess.state':
      if (value === 'sending') {
        blockUi(elements);
      } else if (value === 'error') {
        unBlockUi(elements);
        showError(watchedState.formProcess.error, elements, i18next);
      } else if (value === 'finished') {
        unBlockUi(elements);
      }
      break;
    default:
      console.log('nothing changed');
  }
});
const descriptions = [];
const titles = [];

const getData = (urlAddress, selectors) => {
  const elementsGetData = selectors;
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(urlAddress)}`,
    )
    .then((data) => {
      const previousPosts = mystate.feed.posts;

      if (!mystate.feeds.includes(urlAddress)) {
        mystate.feeds.push(urlAddress);
        const firstData = getPosts(data);
        const { title, description, posts } = firstData;
        watchedState.feed.posts = posts;
        watchedState.feed.title.push(title);
        watchedState.feed.description.push(description);

        elementsGetData.output.innerHTML = i18next.t('success');
        watchedState.formProcess.state = 'finished';
        elementsGetData.formElement.value = '';
      } else {
        const firstData = getPosts(data);
        const { title, description, posts } = firstData;
        const PrevAndUpdatedPosts = [...previousPosts, ...posts];
        const resultPosts = _.uniqBy(PrevAndUpdatedPosts, 'name');
        titles.push(title);
        descriptions.push(description);
        const resultTitles = _.uniq(titles);
        const resultDescriptions = _.uniq(descriptions);
        watchedState.feed.posts = resultPosts;
        watchedState.feed.title = resultTitles;
        watchedState.feed.description = resultDescriptions;
      }
    })
    .catch((error) => {
      watchedState.formProcess.error = error.message;
      watchedState.formProcess.state = 'error';
    });
};

const schema = yup.object({
  name: yup.string().url().nullable(),
});

// Hexlet All origins
const parseData = (urlAddress, elements1) => {
  getData(urlAddress, elements1);

  const checkRss = (url, elements2) => {
    setTimeout(() => {
      getData(url, elements2);
      checkRss(url, elements2);
    }, 5000);
  };

  checkRss(urlAddress, elements);
};

export const run = (watchedState1, elements1) => {
  const watchedStateRun = watchedState1;
  const elementsRun = elements1;
  elements.form.addEventListener('submit', (e) => {
    const currentValue = e.target.querySelector('input').value;
    e.preventDefault();
    watchedStateRun.valuefrominput = elementsRun.formElement.value;
    const validDataInput = schema.validate({ name: watchedState.valuefrominput }, { strict: true });

    validDataInput.then(() => {
      if (!watchedStateRun.arrayUrl.includes(watchedStateRun.valuefrominput)) {
        watchedStateRun.arrayUrl.push(watchedStateRun.valuefrominput);
        watchedStateRun.formProcess.state = 'sending';
        parseData(currentValue, elements);
        elementsRun.input.style.border = 'none';
      } else {
        elementsRun.input.style.border = '4px solid red';
        elementsRun.output.innerHTML = i18next.t('double');
        // watchedStateRun.formProcess.state = 'error';
      }
    }, (error) => {
      elementsRun.input.style.border = '4px solid red';
      watchedState.formProcess.error = error.message;
      watchedStateRun.formProcess.state = 'error';
    });
  });
};

document.querySelector('.posts-list').addEventListener('click', (e) => {
  const item1 = mystate.feed.posts.find((item) => item.id === e.target.getAttribute('data-id'));
  item1.isReaded = true;
  e.target.parentNode.querySelector('a').className = 'fw-normal';
  renderModal(item1);
});
