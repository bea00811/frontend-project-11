import * as _ from 'lodash';

export const isDoublesinArr = (arrayOfUrl) => {
  const countItems = {};

  for (const item of arrayOfUrl) {
    // если элемент уже был, то прибавляем 1, если нет - устанавливаем 1
    countItems[item] = countItems[item] ? countItems[item] + 1 : 1;
  }

  const isDouble = Object.keys(countItems)
    .map((item) => countItems[item] > 1)
    .includes(true);

  return isDouble;
};

export const getPosts = (data) => {
  const parser = new DOMParser();
  const doc1 = parser.parseFromString(data.data.contents, 'application/xml');

  if (doc1.querySelector('parsererror') === null) {
    const title = [doc1.querySelector('title').textContent];
    const description = [doc1.querySelector('description').textContent];
    const items = doc1.querySelectorAll('item');

    const posts = [];

    items.forEach((el) => {
      const name = el.querySelector('title').textContent;
      const postDescription = el.querySelector('description').textContent;
      const link = el.querySelector('link').textContent;
      posts.push({
        name,
        postDescription,
        isReaded: false,
        id: _.uniqueId(),
        link,
      });
    });

    const result = { title, description, posts };
    console.log(result);
    console.log('from addposts');
    return result;
  }
  throw new Error('OOps!!:)) Network response was parcerror. This msg is from appPosts func');
};

export const getUpdatedPost = (data) => {
  const parser = new DOMParser();
  const doc1 = parser.parseFromString(data.data.contents, 'application/xml');

  if (doc1.querySelector('parsererror') === null) {
    const title = [doc1.querySelector('title').textContent];
    const description = [doc1.querySelector('description').textContent];
    const items = doc1.querySelectorAll('item');

    const updatedPosts = [];
    items.forEach((el) => {
      const name = el.querySelector('title').textContent;
      const postDescription = el.querySelector('description').textContent;
      const link = el.querySelector('link').textContent;
      updatedPosts.push({
        name,
        postDescription,
        isReaded: false,
        id: _.uniqueId('updated_'),
        link,
      });
    });

    const result = { title, description, updatedPosts };

    return result;
  }
  throw new Error('OOps!!:)) Network response was parcerror. From getUpdatedPosts this msg.');
};

export const pushUrl = (state, value) => {
  state.push(value);
};
