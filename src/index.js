// @ts-check

import init from "./init.js";
import "./style.css";
import "./styles.scss";
import "bootstrap";
import * as yup from "yup";
import onChange from "on-change";

const mystate = {
  valuefrominput: " ",
  smthtype: "smth",
  urlList: [],
};

const watchedState = onChange(
  mystate,
  function (path, value, previousValue, applyData) {
    console.log("this:", this);
    console.log("path:", path);
    console.log("value:", value);
    console.log("previousValue:", previousValue);
    console.log("applyData:", applyData);
  }
);

const formElement = document.getElementById("url-input");
const form = document.getElementById("rss-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  watchedState.valuefrominput = formElement.value;

  const putUrlsToList = () => {
    watchedState.urlList.push(watchedState.valuefrominput);
  };

  const showValue = () => {
    console.log(watchedState.urlList);
    console.log("hello!!");
  };

  const schema = yup.object({
    name: yup.string().url().nullable(),
  });

  const validDataFromInput = schema.validate(
    { name: watchedState.valuefrominput },
    { strict: true }
  );

  validDataFromInput.then(
    (result) => {
      document.getElementById("url-input").style.border = "none";
      putUrlsToList();
      showValue();
    },
    (error) => {
      document.getElementById("url-input").style.border = "4px solid red";
      console.log("oops!" + error);
    }
  );
});

init();
