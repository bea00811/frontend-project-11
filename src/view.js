import i18next from "i18next";
import { pushUrl, parseData } from "./controllers";
import(pushUrl);
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

//если не содержит дублей, то возвращается первое условие, если содержит, то второе
const validUrLInterface = (funcReturnTrue) => {
  if (funcReturnTrue) {
    document.getElementById("url-input").style.border = "4px solid red";
    document.getElementById("output").innerHTML =
      i18next.t("RSS уже существует");
    document.getElementById("url-input").value = "";
    console.log(`you have doubles in inputs`);
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
};

export default validUrLInterface;
