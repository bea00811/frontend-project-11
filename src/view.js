export const renderPostsFirstly = (state) => {
  console.log(state);
  console.log('this is state');

  const posts = document.querySelector('.posts');

  const myContainer = document.createElement('ul');
  myContainer.classList.add('posts-container');
  posts.append(myContainer);

  for (let i = 0; i < state.posts.length; i += 1) {
    const myListEl = document.createElement('li');
    const myLink = document.createElement('a');
    myLink.innerHTML = state.posts[i].name;
    myLink.setAttribute('href', state.posts[i].link);
    myLink.setAttribute('target', '_blank');
    myLink.className = 'link';
    myListEl.appendChild(myLink);
    myContainer.append(myListEl);

    if (state.posts[i].isReaded === false) {
      myLink.classList.add('fw-bold');
    } else {
      myLink.classList.add('fw-normal');
    }
    myLink.setAttribute('data-id', state.posts[i].id);
  }
};

export const renderFeedFyrstly = (state) => {
  const feed = document.querySelector('.feeds');
  console.log(state);
  console.log(state.title);

  for (let i = state.title.length - 1; i >= 0; i -= 1) {
    const test = document.createElement('li');
    const test2 = document.createElement('h4');
    const test3 = document.createElement('p');
    test2.innerHTML = state.title[i];
    test3.innerHTML = state.description[i];
    test.appendChild(test2);
    test.appendChild(test3);
    feed.appendChild(test);
  }
};

export const renderPosts = (state) => {
  const myContainer1 = document.querySelector('.posts-container');
  myContainer1.innerHTML = '';
  for (let i = 0; i < state.posts.length; i += 1) {
    const myListEl = document.createElement('li');
    const myLink = document.createElement('a');
    myLink.innerHTML = state.posts[i].name;
    myLink.setAttribute('href', state.posts[i].link);
    myLink.setAttribute('target', '_blank');
    myLink.className = 'link';
    myListEl.appendChild(myLink);
    myContainer1.append(myListEl);
    if (state.posts[i].isReaded === false) {
      myLink.classList.add('fw-bold');
    } else {
      myLink.classList.add('fw-normal');
    }
    myLink.setAttribute('data-id', state.posts[i].id);
  }
};

export const renderFeed = (state) => {
  const feed = document.querySelector('.feeds');
  feed.innerHTML = '';
  for (let i = state.title.length - 1; i >= 0; i -= 1) {
    const test = document.createElement('li');
    const test2 = document.createElement('h4');
    const test3 = document.createElement('p');
    test2.innerHTML = state.title[i];
    test3.innerHTML = state.description[i];
    test.appendChild(test2);
    test.appendChild(test3);
    feed.appendChild(test);
  }
};
