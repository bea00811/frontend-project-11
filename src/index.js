// @ts-check

import init from "./init.js";
import "./style.css";
import "./styles.scss";
import "bootstrap";
import * as yup from "yup";
import onChange from "on-change";

const formElement = document.getElementById("url-input");

formElement.addEventListener("input", function () {
  const mystate = {
    valuefrominput: this.value,
    value: "smth",
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

  const showValueFromState = () => {
    console.log("watched state worked down");

    console.log(watchedState.valuefrominput);
    console.log(watchedState.value);
    console.log(watchedState.urlList);
  };

  const putUrlsToList = () => {
    watchedState.urlList.push(watchedState.valuefrominput);
    console.log(watchedState.urlList);
  };

  const schema = yup.object({
    name: yup.string().required(),
  });

  const validDataFromInput = schema.validate(
    { name: this.value },
    { strict: true }
  );

  // @ts-ignore
  validDataFromInput.then(
    (result) => {
      document.getElementById("url-input").style.border = "none";
      putUrlsToList();
      showValueFromState();
      //   putUrlsToList();
    }, // all is right in input!
    (error) => {
      document.getElementById("url-input").style.border = "4px solid red";
      console.log("oops!" + error);
    }
  ); // there is errors in input!
});

init();
