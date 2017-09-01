import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

let initState = [
    {id: Math.random(), value: 0},
    {id: Math.random(), value: 0},
    {id: Math.random(), value: 0},
    {id: Math.random(), value: 0},
    {id: Math.random(), value: 0},
    {id: Math.random(), value: 0},
];

function counter(state=initState, action) {

    let {type, id} = action;
    switch (type) {
        case 'INCREMENT':
            return state.map((elt)=>{
                if(elt.id === id){
                    elt.value++;
                }
                return elt;
            });
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


function increment(id) {
    return function(dispatch, getState) {
        dispatch({type: "INCREMENT", id});
    }

}

function decrement(id) {
    return {type: "DECREMENT", id};
}

function inIfOdd(id) {
    return function (dispatch, getState) {
        let state = getState();

        // let counter = state.reduce( (accu, curtElt)=>{
        //     return id===accu.id ? accu : curtElt ;
        // } );

        let counter = null;

        state.forEach( elt=>{
            if(elt.id===id){
                counter = elt;
            }
        } );

        if( counter && !(counter.value%2===0)){
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

// 绑定action创建函数， 当发起action的时候不用再写dispatch
const boundIncrement = (id)=> store.dispatch(increment(id));
const boundDecrement = (id)=> store.dispatch(decrement(id));
const boundInIfOdd = (id)=> store.dispatch(inIfOdd(id));
const boundAsync = (id)=> store.dispatch(async(id));

class App extends Component{
    constructor(props){
        super(props);
    }

    render(){

        let {counters, actions} = this.props;

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

class Counter extends Component{
    constructor(props){
        super(props);
    }

    render(){

        let { id, value, actions } = this.props;

        let {
            boundIncrement,
            boundDecrement,
            boundInIfOdd,
            boundAsync
        } = actions;

        return (
            <div className="counter">

                <button
                    className="decrement"
                    onClick={ev=>{boundDecrement(id)}}
                >-</button>

                <span style={{margin: '0 10px'}} className="val">{value}</span>

                <button
                    className="increment"
                    onClick={ev=>{boundIncrement(id)}}
                >+</button>
                <button
                    className="odd"
                    onClick={ev=>{boundInIfOdd(id)}}
                >increment if odd</button>
                <button
                    className="async"
                    onClick={ev=>{boundAsync(id)}}
                >async increment</button>
            </div>
        )
    }
}


function render() {

    ReactDOM.render(
        <App
            {...{
                counters: store.getState(), 
                actions: {
                    boundIncrement,
                    boundDecrement,
                    boundInIfOdd,
                    boundAsync
                }
            }}

        />,
        document.getElementById('root')
    );
}

render();

store.subscribe(render)
