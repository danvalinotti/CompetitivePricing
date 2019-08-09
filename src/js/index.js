import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import store from "../js/store/index";
import App from "./App";
import routes from "./routes";
import { HashRouter, Route } from "react-router-dom";

import DashBoardContainer from "./container/DashBoardContainer";
import DashBoardViewContainer from "./container/DashBoardViewContainer";
import ViewDrugDetailsContainer from "./container/ViewDrugDetailsContainer";
import ReportsContainer from "./container/ReportsContainer";
import SignInContainer from "./container/SignInContainer";
import SignUpContainer from "./container/SignUpContainer";
import ManageUsersContainer from "./container/ManageUsersContainer";
import ManageDrugsContainer from "./container/ManageDrugsContainer";
import ManageAlertsContainer from "./container/ManageAlertsContainer";
import ManageRequestsContainer from "./container/ManageRequestsContainer";
render(
    <Provider store={store}>
        <HashRouter>
            <div>
                <Route exact path="/" component={SignInContainer} />
                <Route path="/search" component={DashBoardContainer} />
                <Route path="/viewdrugs" component={ViewDrugDetailsContainer} />
                <Route path="/viewDashBoard" component={DashBoardViewContainer} />
                <Route path="/reports" component={ReportsContainer} />
                <Route path="/signin" component={SignInContainer} />
                <Route path="/signup" component={SignUpContainer} />
                <Route path="/admin/manage/users" component={ManageUsersContainer}/>
                <Route path="/admin/manage/drugs" component={ManageDrugsContainer} />
                <Route path="/admin/manage/alerts" component={ManageAlertsContainer} />
                <Route path="/admin/manage/requests" component={ManageRequestsContainer} />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById("app")
);