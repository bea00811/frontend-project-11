// @ts-check

import init from "./init.js";
import {
  renderFeedFyrstly,
  renderPostsFirstly,
  renderPosts,
  renderFeed,
} from "./view.js";
import {
  pushUrl,
  getPosts,
  getUpdatedPost,
  isDoublesinArr,
} from "./controllers.js";
import * as _ from "lodash";
import onChange from "on-change";
import "./style.css";
import "./styles.scss";
import "bootstrap";
import * as yup from "yup";
import i18next from "i18next";
import axios from "axios";

i18next.init({
  lng: "ru", // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    ru: {
      translation: {
        doubleurl: "RSS уже существует",
        invalidUrl: "Вы ввели неправильный URL",
      },
    },
  },
});

const mystate = {
  valuefrominput: " ",
  arrayUrl: [],
  feed: null,
};
const resultTitles = [];
const resultDescriptions = [];
const getData = (urlAddress) => {
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
        urlAddress
      )}`
    )
    .then((data) => {
      if (mystate.feed === null) {
        const firstData = getPosts(data);
        watchedState.feed = firstData;
      }

      const updatedData = getUpdatedPost(data);
      const updatedPosts = updatedData.updatedPosts;
      const previousPosts = mystate.feed.posts;

      const updatedTitles = updatedData.title;
      const previousTitles = mystate.feed.title;

      const updatedDescriptions = updatedData.description;
      const previousDescriptions = mystate.feed.description;

      const PrevAndUpdatedPosts = [...updatedPosts, ...previousPosts];
      const res = [...updatedPosts, ...previousPosts];
      const resultPosts = _.uniqBy(PrevAndUpdatedPosts, "name");

      resultTitles.push(updatedTitles);
      console.log(_.uniq(resultTitles.flat()));
      console.log("resultTitles");

      resultDescriptions.push(updatedDescriptions);
      console.log(_.uniq(resultDescriptions.flat()));
      console.log("resultDescriptions");

      watchedState.feed.posts = resultPosts;
      watchedState.feed.title = _.uniq(resultTitles.flat());
      watchedState.feed.description = _.uniq(resultDescriptions.flat());
      console.log("previousData");
    })
    .catch((error) => {
      console.log("error");
    });
};

const schema = yup.object({
  name: yup.string().url().nullable(),
});

const watchedState = onChange(mystate, (path, value, previousValue) => {
  // console.log("path:", path);
  // console.log("value:", value);

  switch (path) {
    case "feed":
      renderFeedFyrstly(mystate.feed);
      renderPostsFirstly(mystate.feed);
      break;
    case "feed.posts":
      renderPosts(mystate.feed);
    case "feed.titles":
      renderFeed(mystate.feed);

      break;

    default:
      console.log("nothing changed");
  }
});

const formElement = document.getElementById("url-input");
const form = document.getElementById("rss-form");

// Hexlet All origins
const parseData = (urlAddress) => {
  getData(urlAddress);

  const checkRss = (urlAddress) => {
    getData(urlAddress);
    setTimeout(() => {
      checkRss(urlAddress);
    }, 12000);
  };

  checkRss(urlAddress);
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  watchedState.valuefrominput = formElement.value;
  const validDataFromInput = schema.validate(
    { name: watchedState.valuefrominput },
    { strict: true }
  );

  validDataFromInput.then(
    (result) => {
      pushUrl(watchedState.arrayUrl, watchedState.valuefrominput);
      if (isDoublesinArr(watchedState.arrayUrl)) {
        document.getElementById("url-input").style.border = "4px solid red";
        document.getElementById("output").innerHTML =
          i18next.t("RSS уже существует");
        formElement.value = "";
        console.log(`you have doubles in inputs ${result}`);
        return;
      } else {
        parseData(formElement.value);
        console.log(mystate.feed);
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
      document.getElementById("output").innerHTML = i18next.t(
        "Вы ввели неправильный URL"
      );
      formElement.value = "";
      console.log("oops!" + error);
    }
  );
});
