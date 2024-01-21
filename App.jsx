import React from './core/React.js'

let showBar=false
function Counter(){
  function Foo(){
    return <div>foo
        <div>child</div>
        <div>child2</div>
    </div>
  }
    const bar=<div>bar</div>
    function handleShowBar(){
        showBar=!showBar
        React.update()
    }
    return <div>Counter
        <div>{showBar?bar:<Foo></Foo>}</div>
    <button onClick={handleShowBar}>showBar</button>
    </div>
}

function App(){
    return (<div>
    <h1>Hello, brandy!</h1>
    <div>This is a paragraph</div>
    <Counter ></Counter>
    {/* <Counter num={20}></Counter> */}

    {/* <CounterContainer></CounterContainer> */}
</div>)
}



export default App