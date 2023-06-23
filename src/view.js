export const renderPostsFirstly = (state) => {
  console.log(state);
  console.log("this is state");

  const posts = document.querySelector(".posts");

  let myContainer = document.createElement("ul");
  myContainer.classList.add("posts-container");
  posts.append(myContainer);

  for (let i = 0; i < state.posts.length; i++) {
    let myListEl = document.createElement("li");
    let myLink = document.createElement("a");
    myLink.innerHTML = state.posts[i].name;
    myLink.setAttribute("href", state.posts[i].link);
    myLink.setAttribute("target", "_blank");
    myLink.className = "link";
    myListEl.appendChild(myLink);
    myContainer.append(myListEl);

    if (state.posts[i].isReaded === false) {
      myLink.classList.add("fw-bold");
    } else {
      myLink.classList.add("fw-normal");
    }
    myLink.setAttribute("data-id", state.posts[i].id);
  }
};

export const renderFeedFyrstly = (state) => {
  const feed = document.querySelector(".feeds");
  console.log(state);
  console.log(state.title);

  for (let i = state.title.length - 1; i >= 0; i--) {
    let test = document.createElement("li");
    let test2 = document.createElement("h4");
    let test3 = document.createElement("p");
    test2.innerHTML = state.title[i];
    test3.innerHTML = state.description[i];
    test.appendChild(test2);
    test.appendChild(test3);
    feed.appendChild(test);
  }
};

export const renderPosts = (state) => {
  let myContainer1 = document.querySelector(".posts-container");
  myContainer1.innerHTML = "";
  for (let i = 0; i < state.posts.length; i++) {
    let myListEl = document.createElement("li");
    let myLink = document.createElement("a");
    myLink.innerHTML = state.posts[i].name;
    myLink.setAttribute("href", state.posts[i].link);
    myLink.setAttribute("target", "_blank");
    myLink.className = "link";
    myListEl.appendChild(myLink);
    myContainer1.append(myListEl);
    if (state.posts[i].isReaded === false) {
      myLink.classList.add("fw-bold");
    } else {
      myLink.classList.add("fw-normal");
    }
    myLink.setAttribute("data-id", state.posts[i].id);
  }
  let newlist = document.querySelectorAll("li");
};

export const renderFeed = (state) => {
  const feed = document.querySelector(".feeds");
  feed.innerHTML = "";
  for (let i = state.title.length - 1; i >= 0; i--) {
    let test = document.createElement("li");
    let test2 = document.createElement("h4");
    let test3 = document.createElement("p");
    test2.innerHTML = state.title[i];
    test3.innerHTML = state.description[i];
    test.appendChild(test2);
    test.appendChild(test3);
    feed.appendChild(test);
  }
};
