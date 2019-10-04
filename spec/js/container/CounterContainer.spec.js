import React from 'react';
import { shallow, mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme'
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import CounterContainer from "../../../src/js/container/CounterContainer";
import Counter from "../../../src/js/components/Counter";


describe("A suite", function() {
    let counterContainer;
    const mockStore = configureMockStore();
    const store = mockStore({count : 0 });
    beforeEach(() => {
        jasmineEnzyme();
        counterContainer = shallow(
            <Provider store = { store }>
                <CounterContainer />
            </Provider>);
    });

    it("counterContainer", function(){
        console.log("length of div in Couter Container :" + counterContainer.find('div').length);
        expect(counterContainer.find('Counter').length).toEqual(1);
        console.log("test container passed");
    });
});
