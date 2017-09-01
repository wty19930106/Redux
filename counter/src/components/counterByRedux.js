
import {createStore, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';

// state immutably
// reducer 纯函数 redux是一个可预测的状态管理的库

// reduce

function f(f, h) {

    if(f%2===0){
        return 0;
    }else{
        return 1;
    }

    return f;
}

f(8);

// let rduArr = [1,2,3,4];
// // state = 11
//
// let accu = rduArr.reduce( (state, curt, indx, array)=>{
//     // 11
//     // 11+1
//     // 11+1+1
//     return ++state ;
// }, 10 );
// state1 => state2 => state3
// console.log(accu);
//
// // reducer === reduce
// side
function counter(state={value: 0}, action) {

    let {type, val} = action;
    let {value} = state;
    switch (type) {
        case 'INCREMENT':

            return {...state, value: ++value};
        case 'DECREMENT':
            state.value--;
            return {...state, value: --value};

        default:
            return state;
    }
}

// applyMiddleware(thunk)
const store = createStore(counter, applyMiddleware(thunk));

let preVal = store.getState();
// 0

store.subscribe(()=>{
    let curtVal = store.getState();
    // 1
    $val.val(curtVal.value);

    console.log( preVal === curtVal, preVal, curtVal);

    preVal = curtVal;
    // preVal {value: 1}
});

function increment(val) {
    return function(dispatch, getState) {
        dispatch({type: "INCREMENT", val});
    }

}
function decrement() {
    return {type: "DECREMENT"};
}

// function inIfOdd(val) {
//     let state = store.getState();
//     if(!(state%2===0)){
//         return {type: "INCREMENT", val};
//     }else{
//         return {type: null};
//     }
//
// }
function inIfOdd(val) {
    return function (dispatch, getState) {
        let state = getState();
        if(!(state%2===0)){
            dispatch(increment(val));
        }

        // dispatch(async());

    }
}

function async() {
    return function(dispatch) {
        setTimeout(()=>{
            dispatch(increment())
        }, 1500)
    }
}

// action {}

let $in = $('.increment'),
    $de = $('.decrement'),
    $val = $('.val'),
    $odd = $('.odd'),
    $async = $('.async');


$in.click(ev=>{
    store.dispatch(
        function(dispatch) {
            dispatch({type: "INCREMENT"});
        }
    )
});

$de.click(ev=>{
    store.dispatch({type: "DECREMENT"})
});

$odd.click(ev=>{
    store.dispatch(inIfOdd(8));
});
$async.click(ev=>{

    store.dispatch(async());


});
