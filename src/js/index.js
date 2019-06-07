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

render(
    <Provider store={store}>
        <HashRouter>
            <div>
                <Route exact path="/" component={DashBoardContainer} />
                <Route path="/search" component={DashBoardContainer} />
                <Route path="/viewdrugs" component={ViewDrugDetailsContainer} />
                <Route path="/viewDashBoard" component={DashBoardViewContainer} />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById("app")
);