import React from './core/React.js'
let count=10

function Counter({num}){
    function handleClick(){
        console.log("click")
        count++
        React.update()
    }
    return <div>count:{count}
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