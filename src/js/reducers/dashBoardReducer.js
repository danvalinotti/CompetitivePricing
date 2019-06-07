import {DASHBOARD_DRUGS, DRUG_SEARCH, DRUG_STRENGTH, DRUG_PRICE} from "../actions/dashBoardActions"

const  initialState={
    drugSearchResult: [],
    drugStrengthArray: [],
    dashBoardDrugsData:[],
    drugPriceData:[]
};

let dashBoardReducer = function(state = initialState, action) {

    switch (action.type) {

        case `${DRUG_SEARCH}_FULFILLED`:
            return {...state,
                drugSearchResult:action.payload,
            };
        case `${DRUG_SEARCH}_PENDING`:
            return {...state};

        case `${DRUG_STRENGTH}_FULFILLED`:
            return {...state,
                drugStrengthArray:action.payload
            };

        case `${DRUG_STRENGTH}_PENDING`:
            return {...state};

        case `${DASHBOARD_DRUGS}_FULFILLED`:
            return {...state,
                dashBoardDrugsData:action.payload
            };

        case `${DASHBOARD_DRUGS}_PENDING`:
            return {...state};

        case `${DRUG_PRICE}_FULFILLED`:
            return {...state,
                drugPriceData :action.payload
            };
        case `${DRUG_PRICE}_PENDING`:
            return {...state};

        default:
            return {
                ...state
            };

    }
};

export default dashBoardReducer;
