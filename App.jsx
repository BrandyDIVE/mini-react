import React from "./core/React.js";

function Foo() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");
  function handleclick() {
    // setCount((c)=>c+1)
    setBar("barbar")

  }
  return (
    <div>
      <h1>foo</h1>
      {count}
      <div> {bar}</div>
     
      <button onClick={handleclick}>click</button>
    </div>
  );
}

function App() {
  return (
    <div>
      hello-brandy 
      <Foo></Foo>
    </div>
  );
}

export default App;
