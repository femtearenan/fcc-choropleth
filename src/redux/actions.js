// Your actions and action constants here

// Action constants can be defined like this:
// export const AN_ACTION = "AN_ACTION";

// Actions should have a basic structure like this, optionally with some payload for "someData":
// export const basicAction = someData => ({
//     type: AN_ACTION,
//     payload: {
//         data: someData
//     }
// });

export const REQUEST_DATA = "REQUEST_DATA";
export const RESOLVED_GET_DATA = "RESOLVED_GET_DATA";
export const FAILED_GET_DATA = "FAILED_GET_DATA";

export const EDUCATION_DATA = "EDUCATION_DATA";
export const COUNTY_DATA = "COUNTY_DATA";


export const getData = (datatype) => {
    const url = datatype === EDUCATION_DATA ? 
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json" :
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
    
    return function (dispatch) {
        dispatch(requestData());

        return fetch(url)
            .then(response => response.json(), error => console.log('An error occured: ', error))
            .then(json => dispatch(resolvedGetData(datatype, json)));
    }

}

export const requestData = () => {
    return {
        type: REQUEST_DATA
    }
}

export const resolvedGetData = (datatype, json) => {
    return {
        type: RESOLVED_GET_DATA,
        datatype: datatype,
        payload: {
            data: json
        }
    }
}


