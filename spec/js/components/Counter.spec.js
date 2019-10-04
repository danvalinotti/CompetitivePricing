import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme'
import { shallow, mount } from 'enzyme';
import Counter from "../../../src/js/components/Counter";




describe("A suite", function() {
    let counterComponent;
    let props;
    beforeEach(() => {
        jasmineEnzyme();
        props = {
            count:0
        };
        counterComponent = shallow(<Counter {...props}/>)
    });


    it("counterComponent", function() {
        expect(counterComponent.find('div').length).toEqual(1);
        console.log("length of div in Couter Component :" + counterComponent.find('div').length)
        // counterComponent.find('<h1>').simulate('click');
         // expect(1).toEqual(1);
        // console.log("test container passed");
    });

});
