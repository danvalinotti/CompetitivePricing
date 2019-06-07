import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from "./App";

import DashBoardContainer from "./container/DashBoardContainer";
import DashBoardViewContainer from "./container/DashBoardViewContainer";
import ViewDrugDetailsContainer from "./container/ViewDrugDetailsContainer";

export default (
        <Route path="/" component={App}>

            <IndexRoute component={DashBoardContainer} />
            <Route path="search" component={DashBoardContainer} />
            <Route path="viewdrugs" component={ViewDrugDetailsContainer}/>
            <Route path="viewDashBoard" component={DashBoardViewContainer}/>

        </Route>
);