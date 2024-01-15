import React from './core/React.js'
function Counter({num}){
    return <div>count:{num}</div>
}
function CounterContainer(){
    return <Counter></Counter>
}
function App(){
    return (<div>
    <h1>Hello, brandy!</h1>
    <div>This is a paragraph</div>
    <button>Click Me</button>
    <Counter num={10}></Counter>
    <Counter num={20}></Counter>

    {/* <CounterContainer></CounterContainer> */}
</div>)
}



export default App