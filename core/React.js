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
  nextfiberOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };

root=nextfiberOfUnit
  
}
//当前要执行的任务
let root=null
let nextfiberOfUnit=null
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextfiberOfUnit) {
    nextfiberOfUnit = perFormfiberOfUnit(nextfiberOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }
 if(!nextfiberOfUnit && root){
  //链表处理完了
commitRoot()

 }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);
function commitRoot(){
  console.log(root,'root')
  commitWork(root.child)
  root=null
}
function commitWork(fiber){
  console.log(fiber)
  if(!fiber) return
  fiber.parent.dom.append(fiber.dom)
  commitWork(fiber.child);
  commitWork(fiber.sibling)
}

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
  // 1.创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom =createDom(fiber.type))
     

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
