import React from './core/React.js'

let countFoo=false
function Foo(){
console.log("foo rerun")
const update= React.update()
    function handleclick(){
        countFoo++
       update()
    }
    return (<div><h1>foo</h1>
         {countFoo}
    <button onClick={handleclick}>click</button>

    </div>)
}
let countBar=false
function Bar(){
console.log("bar rerun")
const update= React.update()
    function handleclick(){
        countBar++
        update()
    }
    return (<div><h1>bar </h1>
         {countBar}
    <button onClick={handleclick}>click</button>
    </div>
    )
}
let countRoot=1
function App(){
    console.log("app rerun")
    const update= React.update()
    function handleClick(){
        countRoot++
       update()
    }
    return (<div>
hello-brandy count:{countRoot}
<button onClick={handleClick}>click</button>
  <Foo></Foo>
  <Bar></Bar>
    {/* <Counter num={20}></Counter> */}

    {/* <CounterContainer></CounterContainer> */}
</div>)
}



export default App