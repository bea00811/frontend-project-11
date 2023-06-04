// @ts-check

import init from "./init.js";
import "./style.css";
import "./styles.scss";
import "bootstrap";
import * as yup from "yup";
import onChange from "on-change";

const mystate = {
  valuefrominput: "hello",
  smthtype: "smth",
  urlList: [],
  urlList2: [],
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
    console.log(watchedState.urlList);
  };

  const schema = yup.object({
    name: yup.string().required().min(3, "нужно не менее 3 символов"),
  });

  const validDataFromInput = schema.validate(
    { name: watchedState.valuefrominput },
    { strict: true }
  );

  validDataFromInput.then(
    (result) => {
      document.getElementById("url-input").style.border = "none";
      putUrlsToList();
    },
    (error) => {
      document.getElementById("url-input").style.border = "4px solid red";
      console.log("oops!" + error);
    }
  );
});

init();
