import fetch from 'fetch-retry';

const parseJSON = (response) => response.json();
const executeFetch = (url,
                      urlMethod,
                      requestObject,
                      queryParamObject,
                      postProcessResponse) => {
    let okStatus = false;
    let queryParam = '';
    const fetchRequest = {
        retries: 2,
        retryDelay: 500,
        method: urlMethod,
        mode: 'cors',
        headers: {
            // Authorization: `Bearer ${token}`,
            Accept: 'application/json;charset=utf-8',
            // referrerPolicy: 'unsafe-url',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    };
    if (requestObject) {
        fetchRequest.body = JSON.stringify(requestObject);
}
if (queryParamObject) {
    queryParam = queryParamObject;
}
return fetch(`${url}${queryParam}`, fetchRequest)
    .then((response) => {
        okStatus = response.ok;
        return response;
    })
    .then(parseJSON)  // may throw exception if response is not in JSON format
    .then((json) => {
        if (!okStatus) {
            return Promise.reject(json);
        }
        return json;
    })
    .then((json) => (
        postProcessResponse ? postProcessResponse(json) : json)
    )
    .catch((error) => {
        if (!error.code) {
            // syntax error e.g. if payload is not in JSON format
            // pass it on to redux-promise-middleware for _REJECTED action
            return Promise.reject({ code: '', error });
        }
        return Promise.reject(error);
    });
};
function drugSearchService(name) {
    const url = `https://drug-pricing-app.cfapps.io/getDrugInfo/${name}`;
    // executeFetch(url,'GET')
    return fetch(
        url,
        {
            method: 'GET',
            headers: {
                // 'Authorization': 'Basic ' + btoa(username + ':' + password),
                // 'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    ).then((response) => {
        if (response.status !== 200) {
            return Promise.reject({
                message: 'rejected'
            });
        }
        return response.json();
    });
}


export default drugSearchService;