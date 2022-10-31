const draggables = document.querySelectorAll(".draggable"); // drag 아이템
const scheduleContainers = document.querySelectorAll(".scheduleContainer"); // drag할 box

// 드롭할 요소 - drag 아이템
draggables.forEach(draggable => {
  // 드래그가 시작될 때 dragging class를 추가
  // dragstart => 1. 사용자가 객체(object)를 드래그하려고 시작할 때 발생함.
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  // 드래그가 끝날 때 dragging class를 제거
  // dragend => 7. 대상 객체를 드래그하다가 마우스 버튼을 놓는 순간 발생함.
  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

// 드롭될 요소 - drag할 box
scheduleContainers.forEach(scheduleContainer => {
  // dragover => 4. 드래그하면서 마우스가 대상 객체의 영역 위에 자리 잡고 있을 때 발생함.
  scheduleContainer.addEventListener("dragover", e => {
    e.preventDefault(); // 드롭될 요소에는 정상 작동을 위해 넣어주기
    const afterElement = getDragAfterElement(scheduleContainer, e.clientX);
    const draggable = document.querySelector(".dragging");
    if (afterElement === undefined) {
      scheduleContainer.appendChild(draggable); // scheduleContainer에 dragging class 추가
    } else {
      // 부모노드.insertBefor(삽입할 노드, 기준점 노드)
      scheduleContainer.insertBefore(draggable, afterElement); // scheduleContainer안에서 자유자재로 순서 바꾸기
    }
  });
});

function getDragAfterElement(scheduleContainer, x) {
  // 드래그 리스트
  const draggableElements = [
    // .draggable:not(.dragging) = .draggable에서 .dragging이 아닌 모든 요소
    ...scheduleContainer.querySelectorAll(".draggable:not(.dragging)"),
  ];
  
  // 배열.reduce((누적값, 현잿값, 인덱스, 요소) => {return 결과}, 초깃값)
  return draggableElements.reduce(
    // closet = 누적값 = accumulator
    // child = 현재값 = currentValue
    (closest, child) => {
      const box = child.getBoundingClientRect();  // 현재값의 위치값 얻기
      const offset = x - box.left - box.width / 2;
      // console.log(offset);
      // 기존에 있던 컨테이너에서 아이템이 다른 쪽으로 가면 offset값이 음수가 나옴. 
      if (offset < 0 && offset > closest.offset) {  
        return { offset: offset, element: child }; // return 값
      } else {
        // 아니면 기존 컨테이너에 그대로 둬라
        return closest;
      }
    },
    // 초깃값 : -infinity(음의 무한대. 어떤 수를 -0으로 나누어도 나오는 값)
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}

