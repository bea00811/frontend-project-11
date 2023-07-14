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
  console.log(state.title);
  console.log(state.description);
  const newList1 = document.querySelector('.feeds-list');
  const listItem = document.createElement('li');
  const title = document.createElement('h4');
  const description = document.createElement('p');
  title.innerHTML = state.title;
  description.innerHTML = state.description;
  listItem.appendChild(title);
  listItem.appendChild(description);
  newList1.append(listItem);
};

export const renderModal = (item) => {
  const description = document.querySelector('.modal-body');
  const title = document.getElementById('exampleModalLabel');

  title.innerHTML = item.name;
  description.innerHTML = item.postDescription;

  const linkContainer = document.querySelector('.link-container');
  const linkPodContainer = document.createElement('div');
  const link = document.createElement('a');

  link.innerHTML = 'Читать полностью';
  link.setAttribute('href', item.link);
  link.setAttribute('target', '_blank');
  link.classList.add('btn', 'btn-primary', 'full-article');
  linkPodContainer.appendChild(link);
  linkContainer.replaceChildren(...linkPodContainer.children);

  linkContainer.appendChild = link;

  if (item.isReaded === true) {
    link.classList.add('fw-normal');
  } else {
    link.classList.add('fw-bold');
  }
};

export const blockUi = (selectors) => {
  const elements = selectors;
  elements.btn.disabled = true;
  elements.btn.classList.add('active-i-am');
  elements.input.setAttribute('readonly', 'true');
};

export const unBlockUi = (selectors) => {
  const elements = selectors;
  elements.btn.disabled = false;
  elements.input.removeAttribute('readonly');
  elements.input.style.border = 'none';
};

export const showError = (error, selectors, i18next) => {
  const elements = selectors;
  elements.output.innerHTML = i18next.t(error);
  elements.input.style.border = '4px solid red';
};
