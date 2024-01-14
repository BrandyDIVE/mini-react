//v2

function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
 let netfiberOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  function workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && netfiberOfUnit) {
      netfiberOfUnit = perFormfiberOfUnit(netfiberOfUnit);
      shouldYield = deadline.timeRemaining() < 1;
    }
   
    requestIdleCallback(workLoop);
  }
  requestIdleCallback(workLoop);
  
}
//当前要执行的任务


function createDom(type){
  return  type === "TEXT_ELEMENT"
  ? document.createTextNode("")
  : document.createElement(type);
}
function updateProps(dom,props){
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}
function initChildren(fiber){
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newfiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newfiber;
    } else {
      prevChild.sibling = newfiber;
    }
    prevChild = newfiber;
  });
}
function perFormfiberOfUnit(fiber) {
  console.log(fiber.dom,'jjj')
  // 1.创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom =createDom(fiber.type))
     
    fiber.parent.dom.append(dom);

    // 2.处理props
updateProps(dom,fiber.props)
  }

  // 3.将树转换为链表
initChildren(fiber)
  // 4.返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return findNextSiblingOfparent(fiber)
}
function findNextSiblingOfparent(fiber){
  if(fiber.parent && fiber.parent.sibling){
    return fiber.parent.sibling;
  }else if(fiber.parent) return findNextSiblingOfparent(fiber.parent)
}
const React = {
  render,
  createElement,
};
export default React;
