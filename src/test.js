form.addEventListener('submit', (e) => {
  e.preventDefault();
  watchedState.valuefrominput = formElement.value;
  const validDataInput = schema.validate({ name: watchedState.valuefrominput }, { strict: true });

  validDataInput.then((result) => {
    pushUrl(watchedState.arrayUrl, watchedState.valuefrominput);
    if (isDoublesinArr(watchedState.arrayUrl)) {
      document.getElementById('url-input').style.border = '4px solid red';
      document.getElementById('output').innerHTML = i18next.t('RSS уже существует');
      formElement.value = '';
      console.log(`you have doubles in inputs ${result}`);
    } else {
      parseData(formElement.value);
      console.log(mystate.feed);
      document.getElementById('url-input').style.border = 'none';
      console.log('All right! Theres no mistakes and doubles in inputs!');
      document.getElementById('output').innerHTML = i18next.t('RSS успешно загружен');

      formElement.value = '';
    }
  }, (error) => {
    document.getElementById('url-input').style.border = '4px solid red';
    document.getElementById('output').innerHTML = i18next.t('Вы ввели неправильный URL');
    formElement.value = '';
    console.log(`oops!${error}`);
  });
});
