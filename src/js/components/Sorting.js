
export function sortByName(list, sort) {

    return list.sort(function (a, b) {
        if (sort !== "down") {
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
}

export function sortByProgramPrice(list, program, sort) {
    return list.sort(function (a, b) {
        if (sort !== "down") {
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

export function sortByLowestPrice(list, sort) {
    return list.sort((a, b) => {
        if(sort !== "down"){
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

