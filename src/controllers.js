import onChange from "on-change";

const mystate = {
  valuefrominput: " ",
  arrayUrl: [],
  titles: [],
  links: [],
  descriptions: [],
  feedsDescriptions: [],
  feedsTitles: [],
};

const watchedState = onChange(mystate, (path, value, previousValue) => {
  console.log("this:", this);
  console.log("path:", path);
  console.log("value:", value);
  console.log("previousValue:", previousValue);
});

const pushUrl = () => {
  watchedState.arrayUrl.push(watchedState.valuefrominput);
};

// Hexlet All origins
const parseData = (urlAddress) => {
  let titlesArr = [];
  let linksArr = [];
  let feedsTitlesArr = [];
  let feedsDescriptionsArr = [];
  fetch(
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
      urlAddress
    )}`
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      const parser = new DOMParser();
      const doc1 = parser.parseFromString(data.contents, "application/xml");
      console.log(doc1);
      const titlesNode = doc1.querySelectorAll("item title");
      const linksNode = doc1.querySelectorAll("item link");
      const FeedtitlesNode = doc1.querySelectorAll("channel title");
      const FeeddescriptionsNode = doc1.querySelectorAll("channel description");
      const titles = Array.from(titlesNode);
      const links = Array.from(linksNode);
      const Feedtitles = Array.from(FeedtitlesNode);
      const FeedDescriptions = Array.from(FeeddescriptionsNode);

      for (let i = 0; i < titles.length; i++) {
        titlesArr.push(titles[i].innerHTML);
        linksArr.push(links[i].innerHTML);
        feedsTitlesArr.push(Feedtitles[i].innerHTML);
      }

      for (let i = 0; i < FeedDescriptions.length; i++) {
        feedsDescriptionsArr.push(FeedDescriptions[i].innerHTML);
      }

      watchedState.titles = titlesArr;
      watchedState.links = linksArr;
      watchedState.feedsDescriptions = feedsDescriptionsArr;
      watchedState.feedsTitles = feedsTitlesArr;

      let myTitle = document.createElement("div");
      myTitle.innerHTML = watchedState.feedsTitles[0];
      myTitle.className = "title";
      document.body.append(myTitle);

      let myDescription = document.createElement("div");
      myDescription.innerHTML = watchedState.feedsDescriptions[0];
      myDescription.className = "description";
      document.body.append(myDescription);

      for (let l = 0; l < mystate.titles.length; l++) {
        let myLink = document.createElement("a");
        myLink.innerHTML = mystate.titles[l];
        myLink.setAttribute("href", mystate.links[l]);
        myLink.className = "link";
        document.body.append(myLink);
      }
    });

  setTimeout(() => {
    console.log("this is the first message");
    parseData();
  }, 5000);
};

export { pushUrl, parseData };
