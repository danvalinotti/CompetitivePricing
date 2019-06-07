import drugSearchService from "../services/dashboardservice";
import getDashBoardDrugsService from "../services/getDashBoardDrugs"
import getDrugPriceService from "../services/getDrugPriceService";

const scope = 'service/';
export  const DRUG_SEARCH = `${scope}DRUG_SEARCH`;
export const DRUG_STRENGTH = `${scope}DRUG_STRENGTH`;
export const DASHBOARD_DRUGS =`${scope}DASHBOARD_DRUGS`;
export const DRUG_PRICE = `${scope}DRUG_PRICE`

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
    }),

    dashBoardDrugs : () => ({
        type:DASHBOARD_DRUGS ,
        payload: {
            promise: getDashBoardDrugsService()
        }
    }),

    drugPrice : (drugNDC,data,drugName) => ({
        type:DRUG_PRICE ,
        payload: {
            promise: getDrugPriceService(drugNDC,data,drugName)
        }
    })
}
