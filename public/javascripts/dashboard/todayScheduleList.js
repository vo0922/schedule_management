
/**
 * 담당자 : 이승현
 * 함수 설명 : 사용자가 객체를 드래그하려고 시작할 때 발생하는 함수
 * 주요 기능 : drag가 시작됨을 알리는 effect인 dragging class를 추가하고, 드래그 요소의 데이터를 설정합니다.
 */
function startDrag(event, target) {
  const draggable =  target
  // 드래그가 시작을 알리는 요소인 dragging class를 추가
  draggable.classList.add("dragging");
  // 데이터를 설정. 데이터로 이벤트 대상의 ID를 사용
  event.dataTransfer.setData('_id', event.target.id)
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 사용자가 대상 객체를 드래그하다가 마우스 버튼을 놓는 순간 발생하는 함수
 * 주요 기능 : drag가 끝남을 알리는 effect인 dragging class를 제거하고, 
 *            완료 컨테이너의 영역 안에서 드래그가 끝났는지, 진행 컨테이너 영역 안에서 드래그가 끝났는지 판별하여 
 *            진행도를 동적으로 변경시켜 줍니다.
 */
function endDrag(event, target) {
  const draggable =  target
  // 드래그 effect 알리는 요소인 dragging class를 제거
  draggable.classList.remove("dragging");
  const done = 'scheduleContainer_elements_done'
  const ing = 'scheduleContainer_elements_ing'
  let scheduleId = target.id
  let targetEl = document.getElementById(`${target.id}check`);
  // 완료 container에서 끝났을 때
  if (target.parentNode.id === done) {
    scheduleProgressReq(scheduleId, true)
    targetEl.checked = true
  // 진행 container에서 끝났을 때
  }else if (target.parentNode.id === ing){
    scheduleProgressReq(scheduleId, false)
    targetEl.checked = false
  }
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 드래그하면서 마우스가 대상 객체의 영역 위에 자리 잡고 있을 때 발생하는 함수
 * 주요 기능 : 변수 afterElement가 undefined 값이 나올 때 진행, 완료 컨테이너 간 이동이 가능합니다.
 */
function overDrag(event, container) { 
   // 드롭될 요소에는 정상 작동을 위해 넣어주기
  event.preventDefault();
  const afterElement = getDragAfterElement(container, event.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterElement === undefined) {
    container.appendChild(draggable);  
  } else {
    // 부모노드.insertBefor(삽입할 노드, 기준점 노드)
    container.insertBefore(draggable, afterElement);
  }
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 이동한 드래그의 위치값을 계산하는 함수
 * 주요 기능 : 변수 offset의 값이 기존에 있던 컨테이너에서 요소가 다른 컨테이너로 이동했을 때 음수가 나오도록 계산하고 리턴해 줍니다.
 */
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

/**
 * 담당자 : 이승현
 * 함수 설명 : 진행도를 수정하고 그에 따른 진행, 완료 각 컨테이너의 요소 갯수와 일정 완료율 계산하는 함수
 * 주요 기능 : ajax 통신으로 드래그로 수정된 요소가 어느 컨테이너에 있느냐에 따라 진행, 완료의 갯수를 세고 그에 따른 일정 완료율 계산과 차트에 정보를 바인딩합니다.
 */
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
      // 진행 컨테이너 갯수
      let ingCount = ingContainer.querySelectorAll('.draggable').length
      // 완료 컨테이너 갯수
      let doneCount = doneContainer.querySelectorAll('.draggable').length
      // 일정 완료율 계산
      let doneRatePoint = doneCount / (ingCount + doneCount) * 100
      // 일정 완료율 chart 바인딩
      document.getElementById('radial-progress').setAttribute('data-percentage', doneRatePoint.toFixed(1));
      // 일정 완료율 수치 바인딩
      document.getElementById('percentageText').innerHTML = doneRatePoint.toFixed(1) + '%'
      ingCountDiv.innerText = ingCount
      doneCountDiv.innerText = doneCount
      $.radialChart()
    },
    error: function (err) {
        console.log(err);
      return alert(err.responseJSON.message);
    }
  })
}

/**
 * 담당자 : 이승현
 * 함수 설명 :  3항 연산자를 이용하여 진행, 완료를 구분하여 오늘 일정을 바인딩하는 함수
 * 주요 기능 : 일정 중에 오늘에 해당되는 일정들만 dashboard 오늘 일정 목록 content에 진행, 완료를 구분하여 바인딩해 줍니다.
 */
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
    // 완료일 때
    if(data.completion) {
      doneData.push(scheduleDataDiv)
      // 완료 일정 갯수 증가
      doneCount++
    // 진행일 때
    }else {
      ingData.push(scheduleDataDiv)
      // 진행 일정 갯수 증가
      ingCount++
    }
  })
  ingContainer.innerHTML = ingData.join('')
  doneContainer.innerHTML = doneData.join('')
  ingCountDiv.innerText = ingCount.toString()
  doneCountDiv.innerText = doneCount.toString()
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 요소에서 체크를 click했을 때 상태가 바뀌면서 해당 컨테이너로 이동하는 함수
 * 주요 기능 : 진행 일정을 체크하면 완료 컨테이너로 이동하고, 일정의 진행도 또한 변경됩니다.
 *             반대로 완료 일정의 체크를 해제하면 진행 컨테이너로 이동하고, 일정의 진행도가 변경됩니다.
 */
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