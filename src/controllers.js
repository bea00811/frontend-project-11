import * as _ from 'lodash';
// import i18next from 'i18next';

const getPosts = (data) => {
  const parser = new DOMParser();
  const doc1 = parser.parseFromString(data.data.contents, 'application/xml');

  if (doc1.querySelector('parsererror') === null) {
    const title = doc1.querySelector('title').textContent;
    const description = doc1.querySelector('description').textContent;
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
  // document.getElementById('output').innerHTML = i18next.t('badurl');
};

export default getPosts;
