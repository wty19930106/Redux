

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

let initState = {
    a: {
        b:{c:[]},
        c:89,
        d: []
    },
    aac: {}
}

function counter(state=initState, action) {

    let {type, val} = action;
    let {value} = state;
    switch (type) {
        case 'INCREMENT':

            return {...state, a:{}};
            // return {...state, value: ++value};
        case 'DECREMENT':
            state.value--;
            return {...state, value: --value};

        default:
            return state;
    }
}

const store = createStore(counter, applyMiddleware(thunk));

// action creator => action的创建函数
function increment(val) {
    return function(dispatch, getState) {
        dispatch({type: "INCREMENT", val});
    }

}

function decrement() {
    return {type: "DECREMENT"};
}

function inIfOdd(val) {
    return function (dispatch, getState) {
        let state = getState().value;
        if(!(state%2===0)){
            dispatch(increment(val));
        }


    }
}

function async() {
    return function(dispatch) {
        setTimeout(()=>{
            dispatch(increment())
        }, 1500)
    }
}



export default class Counter extends Component{
    constructor(props){
        super(props);
    }

    render(){

        let {
            value,
            store,
            actions: {increment, decrement, inIfOdd, async}
        } = this.props;


        return (
            <div className="counter">

                <button
                    className="decrement"
                    onClick={ev=>{

                        store.dispatch(decrement());
                    }}
                >-</button>

                <span style={{margin: '0 10px'}} className="val">{value}</span>

                <button
                    className="increment"
                    onClick={ev=>{
                        store.dispatch(increment())
                    }}
                >+</button>
                <button
                    className="odd"
                    onClick={ev=>{
                        store.dispatch(inIfOdd())
                    }}
                >increment if odd</button>
                <button
                    className="async"
                    onClick={ev=>{
                        store.dispatch(async())
                    }}
                >async increment</button>
            </div>
        )
    }
}

// 绑定好store的action创建函数
// 手动链接

function render() {
    let {value} = store.getState();

    ReactDOM.render(
        <Counter
            value={value}
            store={store}
            actions={{
                increment, decrement, inIfOdd, async
            }}
        />,
        document.getElementById('root')
    );
}

render();

store.subscribe(render)
