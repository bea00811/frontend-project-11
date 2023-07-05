export const renderPostsFirstly = (state, viewMessage, i18next) => {
  // console.log(state);
  // console.log('this is state');

  const newList = document.createElement('ul');
  newList.className = 'newlist';
  for (let i = 0; i < state.posts.length; i += 1) {
    const myListEl = document.createElement('li');
    const myLink = document.createElement('a');
    myLink.innerHTML = state.posts[i].name;
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
    myListEl.append(myLink);
    myListEl.append(button);
    newList.append(myListEl);
  }

  const oldList = document.querySelector('.posts-list');
  oldList.replaceChildren(...newList.children);
};

export const renderFeedFyrstly = (state) => {
  const newList1 = document.createElement('ul');
  newList1.className = 'newlist';

  for (let i = state.title.length - 1; i >= 0; i -= 1) {
    const listItem = document.createElement('li');
    const title1 = document.createElement('h4');
    const description1 = document.createElement('p');
    title1.innerHTML = state.title[i];
    description1.innerHTML = state.description[i];
    listItem.appendChild(title1);
    listItem.appendChild(description1);
    newList1.append(listItem);
  }

  const oldList1 = document.querySelector('.feeds-list');
  oldList1.replaceChildren(...newList1.children);
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
    link.classList.add('red');
  } else {
    link.classList.add('fw-normal');
  }
};

export const blockUi = (selectors) => {
  console.log(selectors);
  console.log('selectors blockUi');
  const elements = selectors;
  elements.btn.disabled = true;
  elements.btn.classList.add('active-i-am');
  elements.input.setAttribute('readonly', 'true');
};

export const unBlockUi = (selectors) => {
  console.log(selectors);
  console.log('selectors unblockUi');
  const elements = selectors;
  elements.btn.disabled = false;
  elements.input.removeAttribute('readonly');
};
