'use strict';

const apiKey = 'I4Qv9YfF6bPnl9C0LBEFeTy6xEt6ZE4eSjamleQ4'; 
const URL = 'https://api.nps.gov/api/v1/parks';


function makeQuery(params) {
  console.log(params);
  const queryItems = Object.keys(params);
  console.log(queryItems);
  const newItems = queryItems.map(key => {
    if (key === 'stateCode') {
      let scPart = [];
      for (let i = 0; i < params['stateCode'].length; i++){
        scPart.push(`${encodeURIComponent(key)}=${encodeURIComponent(params['stateCode'][i])}`);
      }
      return scPart.join('&');
    } else {

      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }
  }

  );

 console.log(newItems);

  return newItems.join('&');
}

// generator/render function

const generateResultsHTML = function (json) {
  console.log(json.data);
  let generate = [];
  json.data.forEach(el => {
    const name = el.fullName;
    const desc = el.description;
    const url = el.url;
    // can add a more complex thing to find the address later?

    const htmlSnip = `
    <div class="park">
      <h2>${name}</h2>
      <h3>Description</h3>
      <p>${desc}</p>
      <a href="${url}">${url}</a>
    </div>
    `;

    generate.push(htmlSnip);
  });
  
  generate = generate.join('');

  $('main').html(generate);
};

// api stuff

function getParks(query, limit=10) { // unlike normal stuff, theres an array of states sent in by the user
  let qArr = query.split(',');
  
  qArr = qArr.map(el => el.trim());

  const params = {
    stateCode: qArr,
    limit, 
    key: apiKey,
  };
  console.log(params);
  const queryString = makeQuery(params);
  const url = URL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => generateResultsHTML(responseJson))
    .catch(err => console.log(err));
}

// event listener

function listenerForm() {
  $('#search-form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#states').val();
    const limit = $('#limit').val();
    console.log(searchTerm);
    console.log(limit);
    getParks(searchTerm, limit);
  });
}

$(listenerForm);