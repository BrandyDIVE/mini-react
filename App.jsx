import React from './core/React.js'
function handleClick(){
    console.log("click")
}
function Counter({num}){
    return <div>count:{num}
    <button onClick={handleClick}>click</button>
    </div>
}
function CounterContainer(){
    return <Counter></Counter>
}
function App(){
    return (<div>
    <h1>Hello, brandy!</h1>
    <div>This is a paragraph</div>
    <Counter num={10}></Counter>
    {/* <Counter num={20}></Counter> */}

    {/* <CounterContainer></CounterContainer> */}
</div>)
}



export default App