import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
// {value:1}
// {type: 'INCREMENT'}
function counter1(state={value: 0}, action) {

    let {type, val} = action;
    let {value} = state;
    switch (type) {
        case 'INCREMENT1':

            return {...state, value: ++value};
        case 'DECREMENT1':
            state.value--;
            return {...state, value: --value};

        default:
            return state;
    }
}

// {value: 2}
// {type: 'INCREMENT'}
function counter2(state={value: 5}, action) {
    console.log(action);
    let {type, val} = action;
    let {value} = state;
    switch (type) {
        case 'INCREMENT2':
            return {...state, value: ++value};
        case 'DECREMENT2':
            state.value--;
            return {...state, value: --value};

        default:
            return state;
    }
}

// let initValue = {
//     counter1: {value:1},
//     counter2: {value: 2}
// }
// {type: 'INCREMENT'}

// function rooCounter(state=initValue, action) {
//     return {
//         counter1: counter1(state.counter1, action),
//         // counter1: {value: 2},
//         counter2: counter2(state.counter2, action)
//         // counter2: {value: 3}
//     }
// }

let rootCounter = combineReducers({
    counter1, counter2
});
// 使用combineReducers来合并和上面函数的合并方式等价


const store = createStore(rootCounter, applyMiddleware(thunk));

function increment1(val) {
    return function(dispatch, getState) {
        dispatch({type: "INCREMENT1", val});
    }

}

function decrement1() {
    return {type: "DECREMENT1"};
}

function inIfOdd1(val) {
    return function (dispatch, getState) {
        let state = getState().value;
        if(!(state%2===0)){
            dispatch(increment1(val));
        }


    }
}

function async1() {
    return function(dispatch) {
        setTimeout(()=>{
            dispatch(increment1())
        }, 1500)
    }
}

function increment2(val) {
    return function(dispatch, getState) {
        dispatch({type: "INCREMENT2", val});
    }

}

function decrement2() {
    return {type: "DECREMENT2"};
}

function inIfOdd2(val) {
    return function (dispatch, getState) {
        let state = getState().value;
        if(!(state%2===0)){
            dispatch(increment2(val));
        }


    }
}

function async2() {
    return function(dispatch) {
        setTimeout(()=>{
            dispatch(increment2())
        }, 1500)
    }
}

const boundIncrement1 = (val)=>{
    store.dispatch(increment1(val))
}
const boundDecrement1 = ()=>{
    store.dispatch(decrement1())
}
const boundInIfOdd1 = ()=>{
    store.dispatch(inIfOdd1())
}
const boundAsync1 = ()=>{
    store.dispatch(async1())
}
const boundIncrement2 = (val)=>{
    store.dispatch(increment2(val))
}
const boundDecrement2 = ()=>{
    store.dispatch(decrement2())
}
const boundInIfOdd2 = ()=>{
    store.dispatch(inIfOdd2())
}
const boundAsync2 = ()=>{
    store.dispatch(async2())
}

store.subscribe(render);


function render() {
    ReactDOM.render(
        <App
            counter1 = {{
                value: store.getState().counter1.value,
                actions: { boundIncrement1, boundDecrement1, boundInIfOdd1, boundAsync1 }
            }}
            counter2 = {{
                value: store.getState().counter2.value,
                actions: { boundIncrement2, boundDecrement2, boundInIfOdd2, boundAsync2 }
            }}
        />
        ,
        document.getElementById('root')
    );
}


class App extends Component{
    constructor(props){
        super(props);
    }

    render(){

        let {counter1 , counter2} = this.props;
        // value , action

        let { boundIncrement1, boundDecrement1, boundInIfOdd1, boundAsync1} = counter1.actions;

        let {boundIncrement2, boundDecrement2, boundInIfOdd2, boundAsync2} = counter2.actions;
        return (
            <div>
                <Counter
                    {...{
                        value: counter1.value,
                        actions: {
                            boundIncrement: boundIncrement1,
                            boundDecrement: boundDecrement1,
                            boundInIfOdd: boundInIfOdd1,
                            boundAsync: boundAsync1
                        }
                    }}

                />
                <Counter
                    {...{
                        value: counter2.value,
                        actions: {
                            boundIncrement: boundIncrement2,
                            boundDecrement: boundDecrement2,
                            boundInIfOdd: boundInIfOdd2,
                            boundAsync: boundAsync2
                        }
                    }}
                />
            </div>
        )
    }
}

class Counter extends Component{
    constructor(props){
        super(props);
    }

    render(){

        let {
            value,
            actions: {boundIncrement, boundDecrement, boundInIfOdd, boundAsync}
        } = this.props;

        return (
            <div className="counter">

                <button
                    className="decrement"
                    onClick={ev=>boundDecrement()}
                >-</button>

                <span style={{margin: '0 10px'}} className="val">{value}</span>

                <button
                    className="increment"
                    onClick={ev=>boundIncrement()}
                >+</button>
                <button
                    className="odd"
                    onClick={ev=>boundInIfOdd()}
                >increment if odd</button>
                <button
                    className="async"
                    onClick={ev=>boundAsync()}
                >async increment</button>
            </div>
        )
    }
}
render()
