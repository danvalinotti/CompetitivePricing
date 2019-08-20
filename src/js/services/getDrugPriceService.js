import {executeFetch} from "./drugdeatilsservice";

function getDrugPriceService(drugNDC,data,drugName) {
    const parseJSON = (response) => response.json();
    const url ="http://localhost:8081/getPharmacyPrice";
    const urlMethod = "POST";
    let  requestObject = {
        "drugNDC": drugNDC,
        "drugName": drugName,
        "dosageStrength": data.drugStrength,
        "drugType": data.drugType,
        "quantity": data.drugQuantity,
        "zipcode": data.myZipCode,
        "longitude": "longitude",
        "latitude": "latitude"

    }
    executeFetch(url,urlMethod,requestObject)

}
export default getDrugPriceService;