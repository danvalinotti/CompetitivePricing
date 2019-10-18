import Axios from 'axios'

export function authenticateUser(self) {
    var userToken = {}
    userToken.name = window.sessionStorage.getItem('token')

    Axios.post(process.env.API_URL + '/authenticate/token', userToken).then(
      r => {
        if (r.data.password != 'false') {
          self.setState({
            openSignIn: false,
            loggedIn: true,
            loggedInProfile: r.data
          })

          window.sessionStorage.setItem('token', r.data.password)
          window.sessionStorage.setItem('loggedIn', 'true')
          //   this.props.history.push({ pathname: '/search' });
        } else {
          self.props.history.push({ pathname: '/signIn' })
        }
      }
    )
  }

export const authUserHook = (history) => {
    var userToken = {}
    userToken.name = window.sessionStorage.getItem('token')
    console.log(userToken)

    return new Promise((resolve, reject) => {
      Axios.post(process.env.API_URL + '/authenticate/token', userToken).then(
        r => {
            if (r.data.password != 'false') {

                window.sessionStorage.setItem('token', r.data.password)
                window.sessionStorage.setItem('loggedIn', 'true')
                // console.log(r.data);
                resolve(r.data);
            } else {
                window.sessionStorage.setItem('token', null);
                window.sessionStorage.setItem('loggedIn', 'false')
                history.push({ pathname: '/signIn' })
                reject();
            }
        }
      );
    });
    // return data;
}