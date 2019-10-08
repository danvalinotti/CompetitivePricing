import fetch from "fetch-retry";


function getDashBoardDrugsService() {
    const url = process.env.API_URL + '/dashboard/get';
    // executeFetch(url,'GET')
    return fetch(
        url,
        {
            method: 'GET',
            headers: {
                // 'Authorization': 'Basic ' + btoa(username + ':' + password),
                 'Content-Type': 'application/json'
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
export default getDashBoardDrugsService;