import * as _ from 'lodash';
import onChange from 'on-change';
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
  showStatus,
} from './view.js';

export default () => {
  const elements = {
    form: document.getElementById('rss-form'),
    formElement: document.getElementById('url-input'),
    input: document.getElementById('url-input'),
    output: document.getElementById('output'),
    btn: document.querySelector('.btn'),
    postsList: document.querySelector('.posts-list'),
    description: document.querySelector('.modal-body'),
    title: document.getElementById('exampleModalLabel'),
    linkContainer: document.querySelector('.link-container'),
    linkPodContainer: document.createElement('div'),
    link: document.querySelector('.link-container a'),
  };

  const mystate = {
    formProcess: {
      error: '',
      state: 'filling',
      valid: '',
    },
    modal: '',
    feeds: [],
    valueFromInput: ' ',
    arrayUrl: [],
    feed: {
      feedName: {},
      posts: [],
    },
  };

  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru', // if you're using a language detector, do not define the lng option
    debug: true,
    resources: {
      ru: {
        translation: {
          double: 'RSS уже существует',
          'name must be a valid URL': 'Ссылка должна быть валидным URL',
          badUrl: 'Ресурс не содержит валидный RSS',
          'Network Error': 'Ошибка сети',
          success: 'RSS успешно загружен',
          viewMessage: 'Просмотр',
        },
      },
    },
  });

  const watchedState = onChange(mystate, (path, value) => {
    switch (path) {
      case 'feed.posts':
        renderPostsFirstly(mystate.feed, 'viewMessage', i18nextInstance);
        break;
      case 'feed.feedName':
        renderFeedFyrstly(mystate.feed.feedName);
        break;
      case 'modal':
        renderModal(mystate.modal, elements);
        break;

      case 'formProcess.state':
        if (value === 'sending') {
          blockUi(elements);
        } else {
          unBlockUi(elements);
          showStatus(watchedState.formProcess, elements, i18nextInstance);
        }
        break;
      default:
        break;
    }
  });

  const getData = (urlAddress) => {
    const decodedString = encodeURIComponent(urlAddress);
    const parsedURL = new URL('https://allorigins.hexlet.app/get');
    parsedURL.searchParams.set('disableCache', 'true');
    axios
      .get(`${parsedURL}&url=${decodedString}`)
      .then((data) => {
        const previousPosts = mystate.feed.posts;
        const firstData = getPosts(data);

        if (!mystate.feeds.includes(urlAddress)) {
          mystate.feeds.push(urlAddress);

          const { title, description, posts } = firstData;
          watchedState.feed.posts = posts;
          watchedState.feed.feedName = {
            title,
            description,
          };

          watchedState.formProcess.state = 'finished';
        } else {
          const { posts } = firstData;
          const prevAndUpdatedPosts = [...previousPosts, ...posts];
          const resultPosts = _.uniqBy(prevAndUpdatedPosts, 'name');
          watchedState.feed.posts = resultPosts;
        }
      })
      .catch((error) => {
        watchedState.formProcess.error = error.message;
        watchedState.formProcess.state = 'error';
      });
  };

  // Hexlet All origins
  const parseData = (urlAddress, elements1) => {
    getData(urlAddress, elements1);
    setTimeout(() => {
      getData(urlAddress, elements1);
    }, 5000);
  };

  elements.form.addEventListener('submit', (e) => {
    const currentValue = e.target.querySelector('input').value;
    e.preventDefault();

    watchedState.valueFromInput = elements.formElement.value;

    const validate = () => {
      const schema = yup.object({
        name: yup.string().url().nullable(),
      });
      return schema.validate({ name: watchedState.valueFromInput }, { strict: true });
    };

    const validDataInput = validate();

    validDataInput.then(() => {
      if (!watchedState.arrayUrl.includes(watchedState.valueFromInput)) {
        watchedState.arrayUrl.push(watchedState.valueFromInput);
        watchedState.formProcess.state = 'sending';
        parseData(currentValue, elements);
      } else {
        watchedState.formProcess.error = 'double';
        watchedState.formProcess.state = 'error';
      }
    }, (error) => {
      watchedState.formProcess.error = error.message;
      watchedState.formProcess.state = 'error';
    });
  });

  elements.postsList.addEventListener('click', (e) => {
    const element = mystate.feed.posts.find((item) => item.id === e.target.getAttribute('data-id'));
    element.isReaded = true;
    watchedState.modal = element;
  });
};
