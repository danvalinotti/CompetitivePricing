import React, { Fragment } from "react";
import { withRouter } from 'react-router-dom';
import TabBar from "./TabBar";
import { authUserHook } from '../services/authService';

function HeaderComponent(props) {
    const [value, setValue] = React.useState(0);
    const [loggedInUser, setLoggedInUser] = React.useState(undefined);
    console.log(window.sessionStorage.getItem('token') === undefined)

    React.useEffect(() => {
        if (window.sessionStorage.getItem('token') !== undefined) {
            authUserHook(props.history).then((response) => {
                setLoggedInUser(response);
            }).catch((error) => {
                console.log(error);
                props.history.push({ pathname: "/signIn" })
            });
        }
    }, [])

    const userUrls = [
        '#/search',
        '#/viewDashboard',
        '#/reports',
        '#/viewDrugs'
    ];
    const adminUrls = [
        '#/admin/manage/users',
        "#/admin/manage/drugs",
        "#/admin/manage/alerts",
        "#/admin/manage/requests",
    ];

    function clickHome() {
        setValue(0);
        props.history.push({ pathname: '/search' });
    }
    function clickDashboard() {
        setValue(1);
        props.history.push({ pathname: '/viewDashboard' });
    }
    function clickReports() {
        setValue(2);
        props.history.push({ pathname: '/reports' });
    }
    function clickAdminAlerts() {
        setValue(1);
        props.history.push({ pathname: "/admin/manage/alerts" });
    }
    function clickAdminRequests() {
        setValue(2);
        props.history.push({ pathname: "/admin/manage/requests" });
    }
    function clickAdminDashboard() {
        setValue(3);
        props.history.push({ pathname: "/admin/manage/users" });
    }
    function clickAdminReports() {
        setValue(4);
        props.history.push({ pathname: "/admin/manage/drugs" });
    }

    // console.log(window.location);

    return (
        <Fragment>
            {loggedInUser !== undefined && (
                <Fragment>
                {console.log(loggedInUser)}
                    {userUrls.includes(window.location.hash) && (
                        <TabBar
                            color={"#0F0034"}
                            profile={loggedInUser}
                            value={value}
                            history={props.history}
                            tab1={"Home"}
                            clickHome={clickHome}
                            tab2={"Dashboard"}
                            clickDashboard={clickDashboard}
                            tab3={"Reports"}
                            clickReports={clickReports}
                        />
                    )}

                    {adminUrls.includes(window.location.hash) && (
                        <TabBar
                            page="admin"
                            profile={loggedInUser}
                            color={"steelblue"}
                            value={value}
                            history={props.history}
                            tab1={"Manage Users"}
                            clickHome={clickAdminDashboard}
                            tab2={"Manage Drugs"}
                            clickDashboard={clickAdminReports}
                            tab3={"Manage Alerts"}
                            clickReports={clickAdminAlerts}
                            tab4={"Manage Requests"}
                            clickTab4={clickAdminRequests}
                        />
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export default withRouter(HeaderComponent)