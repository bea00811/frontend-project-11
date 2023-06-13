// @ts-check

import init from "./init.js";
import "./style.css";
import "./styles.scss";
import "bootstrap";
import * as yup from "yup";
import onChange from "on-change";
import i18next from "i18next";
import axios from "axios";

const delayFunc = () => {
  setTimeout(() => {
    console.log("this is the first message");
  }, 5000);
};
delayFunc();

i18next.init({
  lng: "ru", // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    ru: {
      translation: {
        doubleurl: "RSS уже существует",
        invalidUrl: "Invalid Url",
      },
    },
  },
});

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

const isDoublesinArr = (arrayOfUrl) => {
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

const formElement = document.getElementById("url-input");
const form = document.getElementById("rss-form");

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
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  watchedState.valuefrominput = formElement.value;

  const schema = yup.object({
    name: yup.string().url().nullable(),
  });

  const validDataFromInput = schema.validate(
    { name: watchedState.valuefrominput },
    { strict: true }
  );

  validDataFromInput.then(
    (result) => {
      pushUrl();
      if (isDoublesinArr(watchedState.arrayUrl)) {
        document.getElementById("url-input").style.border = "4px solid red";
        document.getElementById("output").innerHTML =
          i18next.t("RSS уже существует");
        formElement.value = "";
        console.log(`you have doubles in inputs ${result}`);
        return;
      } else {
        parseData(watchedState.valuefrominput);
        document.getElementById("url-input").style.border = "none";
        console.log("All right! Theres no mistakes and doubles in inputs!");
        document.getElementById("output").innerHTML = i18next.t(
          "RSS успешно загружен"
        );

        formElement.value = "";
        return;
      }
    },
    (error) => {
      document.getElementById("url-input").style.border = "4px solid red";
      document.getElementById("output").innerHTML = i18next.t("invalidUrl");
      formElement.value = "";
      console.log("oops!" + error);
    }
  );
});
