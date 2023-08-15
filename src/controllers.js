const parsePosts = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.data.contents, 'application/xml');

  if (doc.querySelector('parsererror') === null) {
    console.log(doc);
    const title = doc.querySelector('title').textContent;
    const description = doc.querySelector('description').textContent;
    const items = doc.querySelectorAll('item');

    const posts = [];

    items.forEach((el) => {
      const name = el.querySelector('title').textContent;
      const postDescription = el.querySelector('description').textContent;
      const link = el.querySelector('link').textContent;
      posts.push({
        name,
        postDescription,
        link,
      });
    });

    const result = { title, description, posts };
    return result;
  }
  // throw new Error(doc.querySelector('parsererror'));
  throw new Error('badUrl');
};

export default parsePosts;
