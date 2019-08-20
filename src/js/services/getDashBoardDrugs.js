import fetch from "fetch-retry";


function getDashBoardDrugsService() {
    const url = 'http://localhost:8081/dashboard/get';
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