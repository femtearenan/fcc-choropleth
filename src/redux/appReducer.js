// Your basic state management logic here
import { REQUEST_DATA, RESOLVED_GET_DATA, EDUCATION_DATA } from './actions';

const initialState = {
    requests: 0,
    educationData: [],
    countyData: [],
    isOK: false,
    isFetching: false,
};

function appReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_DATA:
            return Object.assign({}, state, {
                requests: state.requests + 1,
                fetching: true
            });
        case RESOLVED_GET_DATA:
            const typeOfData = action.datatype === EDUCATION_DATA ? "educationData" : "countyData";
            const numRequests = state.requests - 1 ;
            const isOK = numRequests === 0;
            const isFetching = numRequests !== 0;
            return Object.assign({}, state, {
                requests: numRequests,
                [typeOfData]: action.payload.data,
                isOK: isOK,
                isFetching: isFetching
            })
        default:
            return state;
    }
}

export default appReducer;