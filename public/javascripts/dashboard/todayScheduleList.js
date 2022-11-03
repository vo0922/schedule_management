
// 드롭할 요소 - drag 아이템
function startDrag(event, target) {
  // 드래그가 시작될 때 dragging class를 추가
  // dragstart => 1. 사용자가 객체(object)를 드래그하려고 시작할 때 발생함.
  const draggable =  target
  draggable.classList.add("dragging");
  event.dataTransfer.setData('_id', event.target.id)
}

function endDrag(event, target) {
  const draggable =  target
  draggable.classList.remove("dragging");
  const done = 'scheduleContainer_elements_done'
  const ing = 'scheduleContainer_elements_ing'
  let scheduleId = target.id
  let targetEl = document.getElementById(`${target.id}check`);
  if (target.parentNode.id === done) {
    scheduleProgressReq(scheduleId, true)
    targetEl.checked = true
  }else if (target.parentNode.id === ing){
    scheduleProgressReq(scheduleId, false)
    targetEl.checked = false
  }
}

// 드롭될 요소 - drag할 box
function overDrag(event, container) { // container = this
  // console.log(container)
  // dragover => 4. 드래그하면서 마우스가 대상 객체의 영역 위에 자리 잡고 있을 때 발생함.
  event.preventDefault(); // 드롭될 요소에는 정상 작동을 위해 넣어주기
  const afterElement = getDragAfterElement(container, event.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterElement === undefined) {
    container.appendChild(draggable); // scheduleContainer에 dragging class 추가    
  } else {
    // 부모노드.insertBefor(삽입할 노드, 기준점 노드)
    container.insertBefore(draggable, afterElement); // scheduleContainer안에서 자유자재로 순서 바꾸기
    // container.parentNode.insertBefore(draggable, afterElement);
  }
}

function getDragAfterElement(container, y) {
  // 드래그 리스트
  const draggableElements = [
    // .draggable:not(.dragging) = .draggable에서 .dragging이 아닌 모든 요소
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];
  
  // 배열.reduce((누적값, 현잿값, 인덱스, 요소) => {return 결과}, 초깃값)
  return draggableElements.reduce(
    // closet = 누적값 = accumulator
    // child = 현재값 = currentValue
    (closest, child) => {
      const box = child.getBoundingClientRect();  // 현재값의 위치값 얻기
      const offset = y - box.top - box.height / 2;
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

/*function dropDrag(event, target) {
  // element를 옮긴 container의 id값 scheduleContainer_elements_done(완료) = true일 때 실행할 것
  const done = 'scheduleContainer_elements_done'
  const ing = 'scheduleContainer_elements_ing'
  let scheduleId = event.dataTransfer.getData('_id')
  let targetEl = document.getElementById(`${scheduleId}check`);
  if (target.id === done) {
    scheduleProgressReq(scheduleId, true)
    targetEl.checked = true
  }else if (target.id === ing){
    scheduleProgressReq(scheduleId, false)
    targetEl.checked = false
  }
}*/

// 진행도를 수정하는 함수
function scheduleProgressReq(scheduleId, progress) {
  let ingCountDiv = document.getElementById('ingCount')
  let doneCountDiv = document.getElementById('doneCount')
  let ingContainer = document.getElementById('scheduleContainer_elements_ing')
  let doneContainer = document.getElementById('scheduleContainer_elements_done')
  
  $.ajax({
    type: 'patch',
    url: '/todayScheduleProgress',
    contentType: 'application/json',
    data: JSON.stringify({scheduleId: scheduleId, progress: progress}),
    success: function (res) {
      let ingCount = ingContainer.querySelectorAll('.draggable').length
      let doneCount = doneContainer.querySelectorAll('.draggable').length
      let doneRatePoint = doneCount / (ingCount + doneCount) * 100
      document.getElementById('radial-progress').setAttribute('data-percentage', doneRatePoint.toFixed(1));
      document.getElementById('percentageText').innerHTML = doneRatePoint.toFixed(1) + '%'
      ingCountDiv.innerText = ingCount
      doneCountDiv.innerText = doneCount
      $.radialChart()
    },
    error: function (err) {
        console.log(err)
    }
  })
}

// 바인딩 함수
function scheduleBinding(scheduleData) {
  let ingContainer = document.getElementById('scheduleContainer_elements_ing')
  let doneContainer = document.getElementById('scheduleContainer_elements_done')
  let ingCountDiv = document.getElementById('ingCount')
  let doneCountDiv = document.getElementById('doneCount')

  let ingData = []
  let doneData = []
  let ingCount = 0
  let doneCount = 0
  scheduleData.map((data) => {
   let scheduleDataDiv = `
   <div class="draggable" draggable="true" id="${data._id}" ondragstart="startDrag(event, this)" ondragend="endDrag(event, this)">
      <div class="scheduleBox">
        <div class="scheduleCheckBox" onclick="scheduleViewModalOpen('${data._id}', true)">
          <p class="scheduleCheckBox_title">${data.title}</p>
          <p class="scheduleDate">
          ${new Date(data.startDate).getFullYear()}.
          ${new Date(data.startDate).getMonth() + 1}.
          ${new Date(data.startDate).getDate()} ~
          ${new Date(data.endDate).getFullYear()}.
          ${new Date(data.endDate).getMonth() + 1}.
          ${new Date(data.endDate).getDate()}
          </p>
        </div>
        <label class="scheduleCheckBox">
          <input id="${data._id}check" onchange="changeProgress('${data._id}', this)" type="checkbox" ${data.completion ? "checked" : null }>
          <div class="scheduleCheckBox_checkmark"></div>
        </label>
      </div>  
    </div>`
    if(data.completion) {
      doneData.push(scheduleDataDiv)
      doneCount++
    }else {
      ingData.push(scheduleDataDiv)
      ingCount++
    }
  })
  ingContainer.innerHTML = ingData.join('')
  doneContainer.innerHTML = doneData.join('')
  ingCountDiv.innerText = ingCount.toString()
  doneCountDiv.innerText = doneCount.toString()
}

// 체크 눌렀을 때 양옆으로 이동하는 함수
function changeProgress(scheduleId, e) {
  event.stopPropagation();
  scheduleProgressReq(scheduleId, e.checked)
  let ingContainer = document.getElementById('scheduleContainer_elements_ing')
  let doneContainer = document.getElementById('scheduleContainer_elements_done')
  let scheduleEl = document.getElementById(scheduleId)
  if(e.checked){
    scheduleEl.remove()
    doneContainer.appendChild(scheduleEl)

  }else{
    scheduleEl.remove()
    ingContainer.appendChild(scheduleEl)
  }
}