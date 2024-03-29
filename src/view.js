export const renderPostsFirstly = (state, viewMessage, i18next) => {
  const newState = state.feed;
  const newList = document.createElement('ul');
  for (let i = 0; i < newState.posts.length; i += 1) {
    const myListEl = document.createElement('li');
    myListEl.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'my-3');
    const myLink = document.createElement('a');
    myLink.textContent = newState.posts[i].name;
    myLink.setAttribute('href', newState.posts[i].link);
    myLink.setAttribute('target', '_blank');
    if (state.uiState.isReaded.includes(newState.posts[i].id)) {
      myLink.classList.add('fw-normal');
    } else {
      myLink.classList.add('fw-bold');
    }
    myLink.setAttribute('data-id', newState.posts[i].id);
    const button = document.createElement('button');
    button.textContent = i18next.t(viewMessage);
    button.setAttribute('data-bs-toggle', 'modal');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('data-bs-target', '#exampleModal');
    button.setAttribute('data-id', newState.posts[i].id);
    myListEl.append(myLink, button);
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
  listItem.prepend(title, description);
  newList.prepend(listItem);
};

export const renderModal = (item, selectors) => {
  const elements = selectors;
  elements.title.textContent = item.name;
  elements.description.textContent = item.postDescription;

  const link = document.querySelector('.link-container a');
  link.setAttribute('href', item.link);

  const currentLink = document.querySelector(`[data-id="${item.id}"]`);
  currentLink.classList.remove('fw-bold');
  currentLink.classList.add('fw-normal');
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
  elements.formElement.value = '';
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
