import * as _ from 'lodash';
import onChange from 'on-change';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import parcer from './parcer.js';
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
    uiState: {
      isReaded: [],
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

  const errorType = (error) => {
    if (error.isParsingError) {
      return 'badUrl';
    }
    if (error.isAxiosError) {
      return 'Network Error';
    }
    return null;
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
        renderPostsFirstly(mystate, 'viewMessage', i18nextInstance);
        break;
      case 'feed.feedName':
        renderFeedFyrstly(mystate.feed.feedName);
        break;
      case 'modal':
        renderModal(mystate.modal, elements);
        break;
      case 'uiState.isReaded':
        renderPostsFirstly(mystate, 'viewMessage', i18nextInstance);
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

  const parceUrl = (url) => {
    const parsedURL = new URL('https://allorigins.hexlet.app/get');
    parsedURL.searchParams.set('disableCache', 'true');
    parsedURL.searchParams.set('url', url);
    return parsedURL;
  };

  const addFeed = (state, url, data) => {
    state.push(url);
    watchedState.arrayUrl.push(watchedState.valueFromInput);
    const { title, description, posts } = data;
    posts.forEach((element) => {
      const details = { id: _.uniqueId() };
      Object.assign(element, details);
    });
    mystate.feed.posts.unshift(posts);
    watchedState.feed.posts = [...mystate.feed.posts.flat()];
    watchedState.feed.feedName = {
      title,
      description,
    };
    watchedState.formProcess.state = 'finished';
  };

  const updateFeed = (firstData, previousPosts) => {
    const { posts } = firstData;
    const prevAndUpdatedPosts = [...previousPosts, ...posts];
    const resultPosts = _.uniqBy(prevAndUpdatedPosts, 'name');
    watchedState.feed.posts = resultPosts;
  };

  const getData = (urlAddress) => {
    axios
      .get(parceUrl(urlAddress))
      .then((data) => {
        const previousPosts = mystate.feed.posts;
        const firstData = parcer(data);
        if (!mystate.feeds.includes(urlAddress)) {
          addFeed(mystate.feeds, urlAddress, firstData);
        } else {
          updateFeed(firstData, previousPosts);
        }
        setTimeout(getData, 5000, urlAddress);
      })
      .catch((error) => {
        watchedState.formProcess.error = errorType(error);
        watchedState.formProcess.state = 'error';
      });
  };

  const validate = () => {
    const schema = yup.object({
      name: yup.string().url().notOneOf(watchedState.arrayUrl),
    });
    return schema
      .validate({ name: watchedState.valueFromInput }, { strict: true })
      .then(() => '')
      .catch((error) => {
        if (error.message === 'name must be a valid URL') {
          return error.message;
        }
        return 'double';
      });
  };

  elements.form.addEventListener('submit', (e) => {
    const currentValue = e.target.querySelector('input').value;
    e.preventDefault();

    watchedState.valueFromInput = elements.input.value;

    validate().then((errors) => {
      if (errors === '') {
        watchedState.formProcess.state = 'sending';
        getData(currentValue);
      } else {
        watchedState.formProcess.error = `${errors}`;
        watchedState.formProcess.state = 'error';
      }
    }, (error) => {
      watchedState.formProcess.error = error.message;
      watchedState.formProcess.state = 'error';
    });
  });

  elements.postsList.addEventListener('click', (e) => {
    const element = mystate.feed.posts.find((item) => item.id === e.target.getAttribute('data-id'));
    watchedState.uiState.isReaded.push(element.id);
    watchedState.modal = element;
  });
};
