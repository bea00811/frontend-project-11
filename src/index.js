// @ts-check

import init from "./init.js";
import "./style.css";
import "./styles.scss";
import "bootstrap";
import * as yup from "yup";
import onChange from "on-change";
import i18next from "i18next";
import axios from "axios";

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
  let arr = [];
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
      console.log(typeof data.contents);
      const parser = new DOMParser();
      const doc1 = parser.parseFromString(data.contents, "application/xml");
      const titlesNode = doc1.querySelectorAll("item title");
      const titles = Array.from(titlesNode);

      for (let i = 0; i < titles.length; i++) {
        arr.push(titles[i].innerHTML);
      }
      console.log(typeof arr);
      watchedState.titles = arr;
      console.log(mystate.titles);
      console.log(mystate.titles.length);
      console.log("length");

      for (let l = 0; l < mystate.titles.length; l++) {
        let myDiv = document.createElement("div");
        myDiv.className = "title";
        myDiv.innerHTML = mystate.titles[l];
        document.body.append(myDiv);
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

      // let promise = new Promise(function (resolve, reject) {
      //   // задача, не требующая времени
      //   if (!isDoublesinArr(mystate.arrayUrl)) {
      //     resolve("I have no doubles!!!");
      //     return;
      //   }
      //   reject("I have doubles :(((");
      //   return;
      // });

      // promise
      //   .then((result) => console.log(result))
      //   .catch((error) => console.log(error));

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

// Simple axios
// axios
//   .get("https://ru.hexlet.io/lessons.rss")
//   .then(function (response) {
//     // handle success
//     console.log(response);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   });

// Domparser

// const parser = new DOMParser();

// const xmlString = "https://ru.hexlet.io/lessons.rss";
// const doc1 = parser.parseFromString(xmlString, "text/html");
// console.log(doc1.documentElement);

init();
