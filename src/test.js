export const getFirstData = (urlAddress) => {
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(urlAddress)}`,
    )
    .then((data) => {
      if (formElement.value === urlAddress) {
        const firstData = getPosts(data);
        watchedState.feed = firstData;
        document.getElementById('output').innerHTML = i18next.t('RSS успешно загружен');
        formElement.value = '';
      }
    })
    .catch(() => {
      console.log('Тут должна появиться ошибка, если с сетью проблемы');
      document.getElementById('output').innerHTML = i18next.t('Ресурс не содержит валидный RSS');
    });
};

export const getNextData = (urlAddress) => {
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(urlAddress)}`,
    )
    .then((data) => {
      const updatedData = getPosts(data);
      const updatedPosts = updatedData.posts;
      const previousPosts = mystate.feed.posts;

      const updatedTitles = updatedData.title;
      const updatedDescriptions = updatedData.description;

      const PrevAndUpdatedPosts = [...updatedPosts, ...previousPosts];

      const resultPosts = _.uniqBy(PrevAndUpdatedPosts, 'name');

      resultTitles.push(updatedTitles);
      console.log(_.uniq(resultTitles.flat()));
      console.log('resultTitles');

      resultDescriptions.push(updatedDescriptions);
      console.log(_.uniq(resultDescriptions.flat()));
      console.log('resultDescriptions');

      watchedState.feed.posts = resultPosts;
      watchedState.feed.title = _.uniq(resultTitles.flat());
      watchedState.feed.description = _.uniq(resultDescriptions.flat());
      console.log('previousData');
      document.getElementById('output').innerHTML = i18next.t('RSS успешно загружен');
      formElement.value = '';
    })
    .catch(() => {
      console.log('Тут должна появиться ошибка, если с сетью проблемы');
      document.getElementById('output').innerHTML = i18next.t('Ошибка сети');
    });
};
