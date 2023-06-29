// @ts-check
import * as _ from 'lodash';
import onChange from 'on-change';
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import getPosts from './controllers.js';
import { renderFeedFyrstly, renderPostsFirstly, renderModal } from './view.js';

i18next.init({
  lng: 'ru', // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    ru: {
      translation: {
        double: 'RSS уже существует',
        valid: 'Ссылка должна быть валидным URL',
        badurl: 'Ресурс не содержит валидный RSS',
        mistake: 'Ошибка сети',
        success: 'RSS успешно загружен',
        empty: 'Не должно быть пустым',
        viewMessage: 'Просмотр',
      },
    },
  },
});

const mystate = {
  repeat: null,
  feeds: [],
  valuefrominput: ' ',
  arrayUrl: [],
  feed: {
    title: [],
    description: [],
    posts: [],
  },
};

const watchedState = onChange(mystate, (path, value, previousValue) => {
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

    default:
      console.log('nothing changed');
  }
});
const descriptions = [];
const titles = [];

const getData = (urlAddress) => {
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

        document.getElementById('output').innerHTML = i18next.t('success');
        formElement.value = '';
      } else {
        const PrevAndUpdatedPosts = [...previousPosts, ...posts];
        const resultPosts = _.uniqBy(PrevAndUpdatedPosts, 'name');
        titles.push(title);
        descriptions.push(description);
        const resultTitles = _.uniq(titles);
        const resultDescriptions = _.uniq(descriptions);
        console.log('description');
        watchedState.feed.posts = resultPosts;
        watchedState.feed.title = resultTitles;
        watchedState.feed.description = resultDescriptions;
      }
    })
    .catch(() => {
      if (!mystate.feeds.includes(urlAddress)) {
        document.getElementById('output').innerHTML = i18next.t('mistake');
      } else {
        document.getElementById('output').innerHTML = i18next.t('badurl');
      }
    });
};

const getData2 = (urlAddress) => {
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(urlAddress)}`,
    )
    .then((data) => {
      const firstData = getPosts(data);

      const { title, description, posts } = firstData;
      const previousPosts = mystate.feed.posts;

      const PrevAndUpdatedPosts = [...posts, ...previousPosts];
      const resultPosts = _.uniqBy(PrevAndUpdatedPosts, 'name');
      titles.push(title);
      descriptions.push(description);
      const resultTitles = _.uniq(titles);
      const resultDescriptions = _.uniq(descriptions);
      console.log('description');

      watchedState.feed.posts = resultPosts;
      watchedState.feed.title = resultTitles;
      watchedState.feed.description = resultDescriptions;
    })
    .catch(() => {});
};

const schema = yup.object({
  name: yup.string().url().nullable(),
});

const formElement = document.getElementById('url-input');
const form = document.getElementById('rss-form');

// Hexlet All origins
const parseData = (urlAddress) => {
  getData(urlAddress);

  const checkRss = (url) => {
    setTimeout(() => {
      getData(url);
      checkRss(url);
    }, 5000);
  };

  checkRss(urlAddress);
};

form.addEventListener('submit', (e) => {
  console.log(e.target.querySelector('input').value);
  const currentValue = e.target.querySelector('input').value;
  console.log('e.target.value');
  e.preventDefault();
  watchedState.valuefrominput = formElement.value;

  if (watchedState.valuefrominput === '') {
    document.getElementById('output').innerHTML = i18next.t('empty');
    return;
  }
  const validDataInput = schema.validate({ name: watchedState.valuefrominput }, { strict: true });

  validDataInput.then((result) => {
    if (!watchedState.arrayUrl.includes(watchedState.valuefrominput)) {
      watchedState.arrayUrl.push(watchedState.valuefrominput);
      parseData(currentValue);
      document.getElementById('url-input').style.border = 'none';
    } else {
      document.getElementById('url-input').style.border = '4px solid red';
      document.getElementById('output').innerHTML = i18next.t('double');
    }
  }, (error) => {
    document.getElementById('url-input').style.border = '4px solid red';
    document.getElementById('output').innerHTML = i18next.t('valid');
    console.log(`oops!${error}`);
  });
});

document.querySelector('.posts-list').addEventListener('click', (e) => {
  console.log(e.target.getAttribute('data-id'));
  const item = mystate.feed.posts.find((item) => item.id === e.target.getAttribute('data-id'));
  item.isReaded = true;
  e.target.parentNode.querySelector('a').className = 'fw-normal';
  console.log(e.target.parentNode.querySelector('a'));
  console.log('itemparentNode');
  renderModal(item);
});
