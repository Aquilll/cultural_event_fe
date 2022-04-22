const URL = "http://127.0.0.1:3000/"

export const getEvents =  () => {
  const url = URL + 'events';
  return fetch(url, {
    method: 'GET',
    header: {
      "Access-Control-Allow-Origin": "*"
    }
  })
}

export const createGorkiEvent =  () => {
  const url = URL + 'events/create_gorki_events';
  return fetch(url, {
    method: 'POST'
  })
}

export const createCoBerlinEvent =  () => {
  const url = URL + 'events/create_co_berlin_events';
  return fetch(url, {
    method: 'POST'
  })
}

export const searchEvent =  (startDate, endDate, text, websource) => {
  let dateParam;
  if(!endDate && endDate == '') {
    dateParam = `date=${startDate}`
  } else {
    dateParam = `start_date=${startDate}&end_date=${endDate}`
  }
  const url = URL + `search?text=${text}&${dateParam}&web_source=${websource}`;
  return fetch(url, {
    method: 'GET',
    header: {
      "Access-Control-Allow-Origin": "*"
    }
  })
}
 