// @ts-check
import * as _ from 'lodash';
import onChange from 'on-change';
import './style.css';
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import {
  pushUrl, getPosts, getUpdatedPost, isDoublesinArr,
} from './controllers.js';
import {
  renderFeedFyrstly, renderPostsFirstly, renderPosts, renderFeed,
} from './view.js';

i18next.init({
  lng: 'ru', // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    ru: {
      translation: {
        doubleurl: 'RSS уже существует',
        invalidUrl: 'Вы ввели неправильный URL',
      },
    },
  },
});

const mystate = {
  valuefrominput: ' ',
  arrayUrl: [],
  feed: null,
};

const watchedState = onChange(mystate, (path, value, previousValue) => {
  console.log('path:', path);
  console.log('value:', value);
  console.log('previousValue:', previousValue);
  switch (path) {
    case 'feed':
      renderFeedFyrstly(mystate.feed);
      renderPostsFirstly(mystate.feed);
      break;
    case 'feed.posts':
      renderPosts(mystate.feed);
      break;
    case 'feed.title':
      renderFeed(mystate.feed);
      break;

    default:
      console.log('nothing changed');
  }
});

const resultTitles = [];
const resultDescriptions = [];
const getData = (urlAddress) => {
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(urlAddress)}`,
    )
    .then((data) => {
      if (mystate.feed === null) {
        const firstData = getPosts(data);
        watchedState.feed = firstData;
      }

      const updatedData = getUpdatedPost(data);
      const { updatedPosts } = updatedData;
      const previousPosts = mystate.feed.posts;

      const updatedTitles = updatedData.title;
      const updatedDescriptions = updatedData.description;

      const PrevAndUpdatedPosts = [...updatedPosts, ...previousPosts];

      const resultPosts = _.uniqBy(PrevAndUpdatedPosts, 'name');

      resultTitles.push(updatedTitles);
      console.log(_.uniq(resultTitles.flat()));
      console.log('resultTitles');

      resultDescriptions.push(updatedDescriptions);
      console.log(_.uniq(resultDescriptions.flat()));
      console.log('resultDescriptions');

      watchedState.feed.posts = resultPosts;
      watchedState.feed.title = _.uniq(resultTitles.flat());
      watchedState.feed.description = _.uniq(resultDescriptions.flat());
      console.log('previousData');
    })
    .catch(() => {
      console.log('error');
    });
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
    getData(url);
    setTimeout(() => {
      checkRss(url);
    }, 12000);
  };

  checkRss(urlAddress);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  watchedState.valuefrominput = formElement.value;
  const validDataInput = schema.validate({ name: watchedState.valuefrominput }, { strict: true });

  validDataInput.then((result) => {
    if (!watchedState.arrayUrl.includes(watchedState.valuefrominput)) {
      watchedState.arrayUrl.push(watchedState.valuefrominput);
      parseData(formElement.value);
      console.log(mystate.feed);
      document.getElementById('url-input').style.border = 'none';
      console.log('All right! Theres no mistakes and doubles in inputs!');
      document.getElementById('output').innerHTML = i18next.t('RSS успешно загружен');
      formElement.value = '';
    } else {
      document.getElementById('url-input').style.border = '4px solid red';
      document.getElementById('output').innerHTML = i18next.t('RSS уже существует');
      formElement.value = '';
      console.log(`you have doubles in inputs ${result}`);
    }
  }, (error) => {
    document.getElementById('url-input').style.border = '4px solid red';
    document.getElementById('output').innerHTML = i18next.t('Вы ввели неправильный URL');
    formElement.value = '';
    console.log(`oops!${error}`);
  });
});
