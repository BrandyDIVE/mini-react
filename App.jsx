import React from "./core/React.js";
//useEffect
//调用时机是在React完成对DOM渲染之后,并且浏览器完成绘制之前
function Foo() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");
  function handleclick() {
    setCount((c)=>c+1)
    setBar("barbar")

  }
  React.useEffect(()=>{
console.log("init")
  },[])
  React.useEffect(()=>{
console.log("update",count)
  },[count])
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
