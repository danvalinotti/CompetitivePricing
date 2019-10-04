import drugSearchService from "../services/dashboardservice";
const scope = 'service/';
export  const DRUG_SEARCH = `${scope}DRUG_SEARCH`;
export const DRUG_STRENGTH = `${scope}DRUG_STRENGTH`;


export const actions = {
    dashBoardActions : (name) => ({
        type: DRUG_SEARCH,
        payload: {
            promise: drugSearchService(name)
        }
    }),
    drugStrengthActions : (name) => ({
        type: DRUG_STRENGTH,
        payload: {
            promise: drugSearchService(name)
        }
    })
};
