
export function sortByName(list, sort) {
    var newlist = list.sort(function (a, b) {
        if (sort != "down") {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            } else {
                return 0;
            }
        } else {
            if (a.name < b.name) {
                return 1;
            }
            if (a.name > b.name) {
                return -1;
            } else {
                return 0;
            }
        }
    });
    return newlist;
}
export function sortByBrand(list, sort) {
    var newlist = list.sort(function (a, b) {
        if (sort != "down") {
            if (a.drugType > b.drugType) {
                return 1;
            }
            if (a.drugType < b.drugType) {
                return -1;
            } else {
                return 0;
            }
        }else{
            if (a.drugType < b.drugType) {
                return 1;
            }
            if (a.drugType > b.drugType) {
                return -1;
            } else {
                return 0;
            }
        }
    });
    return newlist;
}
export function sortByProgramPrice(list, program, sort) {
    return list.sort(function (a, b) {
        if (sort != "down") {
            if (Number(a.programs[program].price) > Number(b.programs[program].price)) {
                return 1;
            }
            if (Number(a.programs[program].price) < Number(b.programs[program].price)) {
                return -1;
            } else {
                return 0;
            }
        }else{
            if (Number(a.programs[program].price) < Number(b.programs[program].price)) {
                return 1;
            }
            if (Number(a.programs[program].price) > Number(b.programs[program].price)) {
                return -1;
            } else {
                return 0;
            }
        }

    });
}
export function sortByQuantity(list, sort) {
    return list.sort((a, b) => {
        if (sort != "down") {
            if (Number(a.quantity) > Number(b.quantity)) {
                return 1;
            }
            if (Number(a.quantity) < Number(b.quantity)) {
                return -1;
            } else {
                return 0;
            }
        }else{
            if (Number(a.quantity) < Number(b.quantity)) {
                return 1;
            }
            if (Number(a.quantity) > Number(b.quantity)) {
                return -1;
            } else {
                return 0;
            }
        }
    });
}
export function sortByPrice(list, sort) {
    sortByProgramPrice(list, 0,sort);
}
export function sortByDiff(list, sort) {
    return list.sort((a, b) => {
        if(sort != "down"){
        if (Number(a.recommendedDiff) > Number(b.recommendedDiff)) {
            return 1;
        }
        if (Number(a.recommendedDiff) < Number(b.recommendedDiff)) {
            return -1;
        } else {
            return 0;
        }
    }else{
        if (Number(a.recommendedDiff) < Number(b.recommendedDiff)) {
            return 1;
        }
        if (Number(a.recommendedDiff) > Number(b.recommendedDiff)) {
            return -1;
        } else {
            return 0;
        }
    }
    });
}
export function sortByLowestPrice(list, sort) {
    return list.sort((a, b) => {
        if(sort != "down"){
        if (Number(a.recommendedPrice) > Number(b.recommendedPrice)) {
            return 1;
        }
        if (Number(a.recommendedPrice) < Number(b.recommendedPrice)) {
            return -1;
        } else {
            return 0;
        }
    }else{
        if (Number(a.recommendedPrice) < Number(b.recommendedPrice)) {
            return 1;
        }
        if (Number(a.recommendedPrice) > Number(b.recommendedPrice)) {
            return -1;
        } else {
            return 0;
        }
    }
    });
}

