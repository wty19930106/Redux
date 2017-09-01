import {
    createStore,
    combineReducers,
    applyMiddleware,
    bindActionCreators
} from 'redux';
import thunk from 'redux-thunk';
import {Provider, connect} from 'react-redux';


let initState = [
    {id: Math.random(), value: 0},
    {id: Math.random(), value: 8},
    {id: Math.random(), value: 0},
    {id: Math.random(), value: 9},
    {id: Math.random(), value: 0},
    {id: Math.random(), value: 10},
];



// reducer
// {value: 0}
function counter(state=initState, action) {

    let {type, id} = action;
    switch (type) {
        case 'INCREMENT':

            // 必须返回一个新的state

            return state.map((elt)=>{
                if(elt.id === id){
                    elt.value++;
                }
                return elt;
            });

            // state.push({id: Math.random(), value: 900})
            // return state;

        case 'DECREMENT':
            return state.map((elt)=>{

                if(elt.id === id){
                    elt.value--;
                }

                return elt;
            })
        default:
            return state;

    }
}

const store = createStore(counter, applyMiddleware(thunk));

store.subscribe(()=>{
    console.log(initState === store.getState());
    console.log(store.getState());
})

function increment(id) {
    return function(dispatch, getState) {
        dispatch({type: "INCREMENT", id});
    }

}

function decrement(id) {
    return {type: "DECREMENT", id};
}

function inIfOdd(id, value) {
    return function (dispatch, getState) {
        let state = getState();

        // let value = state[0].value;

        // let counter = state.reduce( (accu, curtElt)=>{
        //     return id===accu.id ? accu : curtElt ;
        // } );

        // let counter = null;
        //
        // state.forEach( elt=>{
        //     if(elt.id===id){
        //         counter = elt;
        //     }
        // } );

        if( !(value%2===0)){
            dispatch(increment(id));
        }
    }
}

function async(id) {
    return function(dispatch) {
        setTimeout(()=>{
            dispatch(increment(id))
        }, 1500)
    }
}

function async() {
    return function(dispatch) {
        setTimeout(()=>{
            dispatch(increment())
        }, 1500)
    }
}


class Counter extends Component{
    constructor(props){
        super(props);
    }

    render(){

        let { id, value, actions } = this.props;

        let {
            increment, inIfOdd, decrement, async
        } = actions;

        return (
            <div className="counter">

                <button
                    className="decrement"
                    onClick={ev=>{decrement(id)}}
                >-</button>

                <span style={{margin: '0 10px'}} className="val">{value}</span>

                <button
                    className="increment"
                    onClick={ev=>{increment(id)}}
                >+</button>
                <button
                    className="odd"
                    onClick={ev=>{inIfOdd(id, value)}}
                >increment if odd</button>
                <button
                    className="async"
                    onClick={ev=>{async(id)}}
                >async increment</button>
            </div>
        )
    }
}
// store.getState
// 你的组件可以在任何一个地方去拿到整个应用的state
// connect 只要这个组件想去拿应用的state的一些数据， 就用connect

class App extends Component{
    constructor(props){
        super(props);
    }

    render(){

        let {
            counters,
            actions,

        } = this.props;


        console.log(this.props);

        return (
            <div>
                {
                    counters.map(counter=>{

                        let {id,value} = counter;

                        return (
                            <Counter
                                {...{
                                    value,
                                    id,
                                    key: id,
                                    actions
                                }}
                            />
                        );
                    })
                }
            </div>
        )
    }
}
// 让App能够从state里面去拿到一些数据
// mapSatateToProps
// mapDispatchToProps
// 函数，接收整个应用的state 返回一个对象， 拿到某些数据，当成要增强的组件的props
// 函数， 接收一个dispatch， 返回一个对象， 就是把对象里面的属性合并到props
App =  connect(
    (state)=>({counters: state}),
    (dispatch)=>{
        return {actions: bindActionCreators({
            increment, decrement, inIfOdd, async
        }, dispatch) }
    }
)(App);

// function connect(fun) {
//     let state = fun();
//
//     return function (Component) {
//         return <Component {...{
//             state
//         }}/>
//     }
// }

export default class Ap extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div><App/></div>
        )
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Ap/>
    </Provider>
    ,
    document.getElementById('root')
);
