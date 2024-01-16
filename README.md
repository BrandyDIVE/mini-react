# mini-react 构建过程 
## 一、目标：在页面中呈现app
### 1、思考如何重构    `react api`
观察下面的代码片段：
```
ReactDom.createRoot(document.getElementById("#root")).render(<App/>)
```
分析ReactDom为一个对象，其中的createRoot方法创建一个根容器，然后接收一个真实dom作为参数（此处为root根节点），然后将这个真实dom作为容器。之后就调用render函数追加内部元素（此处追加一个App组件）
### 2、实现步骤
#### 2.1 vdom写死 dom渲染写死
我们就先来实现上述react api的简单过程，先假设App组件的内容为<div>app</div>,我们把它追加到root的跟容器里，那么过程为：
```
// 创建一个新的 div 元素
const dom = document.createElement("div");

// 设置 div 元素的 id 为 "app"
dom.id = "app";

// 获取具有 id 为 "root" 的元素，并将 div 元素添加为其子元素
document.querySelector('#root').appendChild(dom);

// 创建一个空的文本节点
const textNode = document.createTextNode("");

// 将文本节点的值设置为 "app"
textNode.nodeValue = "app";

// 将文本节点添加为 div 元素的子节点
dom.appendChild(textNode);
```
#### 2.2 vdom动态生成 dom渲染写死
  思考：react用的是vdom，而vdom本质是一个js object，一个真实dom的抽象，构建vdom结构，用来描述网页上的元素结构  

  vdom包括元素类型type，元素属性props, 子元素children
  ```
// 创建一个虚拟 DOM 元素对象
const el = {
  type: "div", // 元素类型为 div
  props: {
    id: "app", // 元素的 id 属性为 "app"
    children: [
      {
        type: "TEXT_ELEMENT", // 子元素类型为文本节点
        props: {
          nodeValue: "app", // 文本节点的内容为 "app"
          children: [] // 文本节点没有子元素
        }
      }
    ]
  }
};
  ```

把文本节点抽离出来，让结构更加清晰
```
// 创建一个文本节点的虚拟 DOM 元素对象
const textEl = {
  type: "TEXT_ELEMENT", // 元素类型为文本节点
  props: {
    nodeValue: "app", // 文本节点的内容为 "app"
    children: [] // 文本节点没有子元素
  }
};

// 创建一个包含 div 元素和文本节点的虚拟 DOM 元素对象
const el = {
  type: "div", // 元素类型为 div
  props: {
    id: "app", // 元素的 id 属性为 "app"
    children: [textEl] // 元素的子元素包含之前创建的文本节点
  }
};
```

有了vdom以后,开始改写创建真实dom元素的代码

改写前：
```
// 创建一个新的 div 元素
const dom = document.createElement("div");

// 设置 div 元素的 id 为 "app"
dom.id = "app";

// 获取具有 id 为 "root" 的元素，并将 div 元素添加为其子元素
document.querySelector('#root').appendChild(dom);

// 创建一个空的文本节点
const textNode = document.createTextNode("");

// 将文本节点的值设置为 "app"
textNode.nodeValue = "app";

// 将文本节点添加为 div 元素的子节点
dom.appendChild(textNode);
```
改写后：
```
// 创建一个真实 DOM 元素，并设置其类型
const dom = document.createElement(el.type);

// 设置真实 DOM 元素的 id 属性
dom.id = el.props.id;

// 将真实 DOM 元素添加到 id 为 "root" 的元素中
document.querySelector("#root").appendChild(dom);

// 创建一个空的文本节点
const textNode = document.createTextNode("");

// 设置文本节点的内容为 textEl 的 nodeValue
textNode.nodeValue = textEl.props.nodeValue;

// 将文本节点添加到真实 DOM 元素中
dom.appendChild(textNode);

```
这时候vdom已经有了，但是还是写死的，接下来实现vdom的动态创建

观察一下下面的代码：
（创建一个文本节点的虚拟 DOM 元素对象）
```
// 创建一个文本节点的虚拟 DOM 元素对象
const textEl = {
  type: "TEXT_ELEMENT", // 元素类型为文本节点
  props: {
    nodeValue: "app", // 文本节点的内容为 "app"    这里需要动态的只有nodeValue的值
    children: [] // 文本节点没有子元素
  }
};

```
改写为一个函数，接收nodeValue的值，此处参数名为text
```
function createTextNode(text) {
  // 创建一个文本节点的虚拟 DOM 元素对象
  return {
    type: "TEXT_ELEMENT", // 元素类型为文本节点
    props: {
      nodeValue: text, // 文本节点的内容为传入的文本参数
      children: [] // 文本节点没有子元素
    }
  };
}
```
同上，观察下面的代码
（创建一个包含 div 元素和文本节点的虚拟 DOM 元素对象）

```
// 创建一个包含 div 元素和文本节点的虚拟 DOM 元素对象
const el = {
  type: "div", // 元素类型为 div  
  props: {
    id: "app", // 元素的 id 属性为 "app"
    children: [textEl] // 元素的子元素包含之前创建的文本节点
  }
};
//思考：元素类型(type)是动态的，元素属性(props)是动态的，子元素(children)也是动态的
```
改写为一个函数，接收三个值，分别为type,props,children
```
function createElement(type, props, ...children) {
  // 创建一个虚拟 DOM 元素对象
  return {
    type, // 元素类型
    props: {
      ...props, // 属性对象
      children // 子元素数组
    }
  };
}
//函数 createElement 接受三个参数：type 表示元素类型，props 表示属性对象，...children 表示可变数量的子元素。
//函数使用对象展开运算符 ... 将 props 和 children 合并到虚拟 DOM 元素的 props 属性中，以保持一致的对象结构
```
使用上面改写的两个函数（createTextNode，createElement） 生成app根组件
```
// 创建文本节点虚拟 DOM 元素
const textEl = createTextNode("app");

// 创建父元素虚拟 DOM 元素
const App = createElement("div", { id: "app" }, textEl);

// 创建真实 DOM 元素，并设置其类型
const dom = document.createElement(App.type);

// 设置真实 DOM 元素的 id 属性
dom.id = App.props.id;

// 将真实 DOM 元素添加到 id 为 "root" 的元素中
document.querySelector("#root").appendChild(dom);

// 创建一个空的文本节点
const textNode = document.createTextNode("");

// 设置文本节点的内容为 textEl 的 nodeValue
textNode.nodeValue = textEl.props.nodeValue;

// 将文本节点添加到真实 DOM 元素中
dom.appendChild(textNode);
```

#### 2.3 vdom动态生成 dom动态生成
思考:dom生成要经历哪些过程？
1. 创建节点-> 2.设置属性-> 3.追加到父元素上
在2.2中我们是这样生成dom的
```
// 创建文本节点虚拟 DOM 元素
const textEl = createTextNode("app");

// 创建父元素虚拟 DOM 元素
const App = createElement("div", { id: "app" }, textEl);

// 创建真实 DOM 元素，并设置其类型
const dom = document.createElement(App.type);

// 设置真实 DOM 元素的 id 属性
dom.id = App.props.id;

// 将真实 DOM 元素添加到 id 为 "root" 的元素中
document.querySelector("#root").appendChild(dom);

// 创建一个空的文本节点
const textNode = document.createTextNode("");

// 设置文本节点的内容为 textEl 的 nodeValue
textNode.nodeValue = textEl.props.nodeValue;

// 将文本节点添加到真实 DOM 元素中
dom.appendChild(textNode);
```
这时候是写死的，我们需要创建一个函数让其动态生成
```
function render(el, container) {
  // 创建真实 DOM 元素
  const dom = document.createElement(el.type);

  // 设置除了 children 之外的属性
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });
  
  // 处理子元素
  const children = el.props.children;
  
  if (children) {
    // 递归渲染子元素
    children.forEach((child) => {
      render(child, dom);
    });
  }
  
  // 将真实 DOM 元素添加到容器中
  container.append(dom);
}

// 创建文本节点虚拟 DOM 元素
const textEl = createTextNode("app");

// 创建父元素虚拟 DOM 元素
const App = createElement("div", { id: "app" }, textEl);

// 渲染父元素并将其附加到根容器中
render(App, document.querySelector("#root"));
```
代码的主要流程是创建一个真实的 DOM 元素，并通过遍历虚拟 DOM 元素的属性列表，将非 "children" 的属性赋值给真实 DOM 元素。然后，对子元素进行递归渲染，并将渲染后的子元素附加到当前元素中。最后，将根元素添加到指定的容器中，完成渲染过程。

接下来优化一下，如果不想在这里再调用createTextNode,想直接在createElement里传"app"
```
// 创建文本节点虚拟 DOM 元素
const textEl = createTextNode("app");

// 创建父元素虚拟 DOM 元素
const App = createElement("div", { id: "app" }, textEl);
```
改成
```
// 创建父元素虚拟 DOM 元素
const App = createElement("div", { id: "app" }, "app");
```
这时候，我们就需要修改createElement函数里的逻辑,需要检查传进来的children是否为文本
```
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        // 检查子元素是否为文本节点，如果是则创建文本节点的虚拟 DOM 元素
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}
```
#### 2.4对齐react中的api，如createRoot函数等
```
import ReactDom from "react-dom/client";
import App from "./App.jsx";
ReactDom.createRoot(document.getElementById("#root")).render(<App/>)
```
```
const ReactDOM = {
  createRoot(container) {
    return {
      
      render(App) {
          //这里调用了上面编写的render函数生成App根组件
        render(App, container);
      },
    };
  },
};
const App = createElement( "div", { id: "app"}，"hi- "，"mini-react");
ReactDOM.createRoot(document.querySelector( ' #root')).render(App)
};
} 
```
#### 2.5把业务代码拆分为框架代码
拆分前：
mini-react
├── index.html
└── main.js

拆分后：
mini-react
├── index.html
├── main.js
└── core
    ├── React.js
    └── ReactDom.js
## 二、目标使用jsx
使用jsx替代js语法
借助vite使用jsx
### 1.1 vite 通过 esbuild 识别并处理 jsx 语法
Vite 使用 esbuild 作为其默认的构建工具，可以识别和处理 JSX 语法。当你在 Vite 项目中使用 JSX 语法时，esbuild 会自动处理它们并将其转换为可在浏览器中运行的 JavaScript 代码。
将文件扩展名更改成 jsx 并且引入我们实现的 react 之后，vite 会自动调用本地 react 中的 createElement 函数，将 jsx 元素直接转换成 createElement 语法，但是由于我们实现的 react 还不支持 function component 语法，所以 App 目前只能是一个 object

