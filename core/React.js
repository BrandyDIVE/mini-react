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
        const isTextNode =
          typeof child === "string" || typeof child === "number";
      
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };

  wipRoot = nextWorkOfUnit;
}
//当前要执行的任务
let wipRoot = null;
let currentRoot = null;
let nextWorkOfUnit = null;
let deletions = [];
let wipFiber = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = perFormfiberOfUnit(nextWorkOfUnit);
    if(wipRoot?.sibling?.type===nextWorkOfUnit?.type){
      nextWorkOfUnit=undefined
    }
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextWorkOfUnit && wipRoot) {
    //链表处理完了
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);
function commitRoot() {
  deletions.forEach(commitDeletion);
  commitWork(wipRoot.child);
  commitEffectHooks()
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}
function commitEffectHooks(){
function run(fiber){
  if(!fiber) return
  if(!fiber.alternate){
    fiber.effectHooks?.forEach((hook)=>{
      hook.callback()
    })
    //初始化 init
    fiber.effectHook?.callback()
  }else{
    //update
    //deps 有没有发生改变
    fiber.effectHooks?.forEach((newHook,index)=>{
    const oldEffectHook=fiber.alternate?.effectHooks[index]
    //some
   const needUpdate= oldEffectHook?.deps.some((oldDep,i)=>{
      return oldDep!==newHook.deps[i]
    })
    needUpdate &&  newHook?.callback()
  })
}

  run(fiber.child)
  run(fiber.sibling)
}
run(wipRoot)
}
function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    //当删除的是function component的情况
    commitDeletion(fiber.child);
  }
}
function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}
function updateProps(dom, nextProps, prevProps) {
  // Object.keys(props).forEach((key) => {
  //   if (key !== "children") {
  //     if (key.startsWith("on")) {
  //       const eventType = key.slice(2).toLowerCase();
  //       dom.addEventListener(eventType, props[key]);
  //     } else {
  //       dom[key] = props[key];
  //     }
  //   }
  // });

  //1.old 有 new没有 删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  //2.new 有 old 没有 添加
  //3.new 有 old 有 修改
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}
function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newfiber;
    if (isSameType) {
      //update
      newfiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      //create
      if (child) {
        newfiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: "placement",
        };
      }

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index === 0) {
      fiber.child = newfiber;
    } else {
      prevChild.sibling = newfiber;
    }
    if (newfiber) {
      prevChild = newfiber;
    }
  });
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}
function updateFunctionComponent(fiber) {
  stateHooks=[]
  stateHookIndex=0
  effectHooks=[]
  wipFiber = fiber;

  const children = [fiber.type(fiber.props)];

  // 3.将树转换为链表
  reconcileChildren(fiber, children);
}
function updateHostComponent(fiber) {
  // 1.创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    // 2.处理props
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;

  // 3.将树转换为链表
  reconcileChildren(fiber, children);
}
function perFormfiberOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 4.返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return findNextSiblingOfparent(fiber);
}
function findNextSiblingOfparent(fiber) {
  if (fiber.parent && fiber.parent.sibling) {
    return fiber.parent.sibling;
  } else if (fiber.parent) return findNextSiblingOfparent(fiber.parent);
}
function update() {
  let currentFiber = wipFiber;
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    // wiproot = {
    //   dom: currentRoot.dom,
    //   props: currentRoot.props,
    //   alternate: currentRoot,
    // };

     nextWorkOfUnit=wipRoot;
  };
}
let stateHooks;
let stateHookIndex;
function useState(initial){
  let currentFiber=wipFiber
  const oldHook=currentFiber.alternate?.stateHooks[stateHookIndex]
  const stateHook={
    state:oldHook?oldHook.state:initial,
    queue:oldHook?oldHook.queue:[]
  }
  stateHook.queue.forEach((action)=>{
 stateHook.state=action(stateHook.state)
  })
  stateHook.queue=[]
  stateHookIndex++
  stateHooks.push(stateHook)
  currentFiber.stateHooks=stateHooks
  function setState(action){
    //提前看看调用action之后的值和之前的值是否一样
const eagerState=typeof action ==="function"? action(stateHook.state):action
if(eagerState===stateHook.state) return
    stateHook.queue.push(typeof action ==="function"? action:()=>action)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextWorkOfUnit=wipRoot;
  }
  return [stateHook.state,setState]
}
let effectHooks
function useEffect(callback,deps){
  const effectHook={
    callback,
    deps
  }
  effectHooks.push(effectHook)
  wipFiber.effectHooks=effectHooks
}
const React = {
  useState,
  useEffect,
  update,
  render,
  createElement,
};
export default React;
