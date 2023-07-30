export const renderPostsFirstly = (state, viewMessage, i18next) => {
  const newList = document.createElement('ul');
  for (let i = 0; i < state.posts.length; i += 1) {
    const myListEl = document.createElement('li');
    const myLink = document.createElement('a');
    myLink.textContent = state.posts[i].name;
    myLink.setAttribute('href', state.posts[i].link);
    myLink.setAttribute('target', '_blank');
    if (state.posts[i].isReaded === false) {
      myLink.classList.add('fw-bold');
    } else {
      myLink.classList.add('fw-normal');
    }
    myLink.setAttribute('data-id', state.posts[i].id);
    const button = document.createElement('button');
    button.textContent = i18next.t(viewMessage);
    button.setAttribute('data-bs-toggle', 'modal');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('data-bs-target', '#exampleModal');
    button.setAttribute('data-id', state.posts[i].id);
    myListEl.append(myLink, button);
    newList.append(myListEl);
  }

  const oldList = document.querySelector('.posts-list');
  oldList.replaceChildren(...newList.children);
};

export const renderFeedFyrstly = (state) => {
  const newList = document.querySelector('.feeds-list');
  const listItem = document.createElement('li');
  const title = document.createElement('h4');
  const description = document.createElement('p');
  title.textContent = state.title;
  description.textContent = state.description;
  listItem.append(title, description);
  newList.append(listItem);
};

export const renderModal = (item, selectors) => {
  const elements = selectors;
  elements.title.textContent = item.name;
  elements.description.textContent = item.postDescription;

  const link = document.querySelector('.link-container a');
  link.setAttribute('href', item.link);

  if (item.isReaded === true) {
    link.classList.add('fw-normal');
  } else {
    link.classList.add('fw-bold');
  }
};

export const blockUi = (selectors) => {
  const elements = selectors;
  elements.btn.disabled = true;
  elements.input.setAttribute('readonly', 'true');
};

export const unBlockUi = (selectors) => {
  const elements = selectors;
  elements.btn.disabled = false;
  elements.input.removeAttribute('readonly');
  elements.input.style.border = 'none';
  elements.input.focus();
};

export const showStatus = (state, selectors, i18next) => {
  const elements = selectors;

  if (state.state === 'finished') {
    elements.output.textContent = i18next.t('success');
  } else {
    elements.output.textContent = i18next.t(state.error);
    elements.input.style.border = '4px solid red';
  }
};
