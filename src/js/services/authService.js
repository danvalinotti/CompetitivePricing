import Axios from 'axios'

export function authenticateUser(self) {
    const userToken = {};
    userToken.name = window.sessionStorage.getItem('token');

    Axios.post(process.env.API_URL + '/authenticate/token', userToken).then(
      r => {
        if (r.data.password !== 'false') {
          self.setState({
            openSignIn: false,
            loggedIn: true,
            loggedInProfile: r.data
          });

          window.sessionStorage.setItem('token', r.data.password);
          window.sessionStorage.setItem('loggedIn', 'true')
          //   this.props.history.push({ pathname: '/search' });
        } else {
          self.props.history.push({ pathname: '/signIn' })
        }
      }
    )
  }