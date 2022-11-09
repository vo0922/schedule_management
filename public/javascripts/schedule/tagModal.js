let tagModal = document.getElementById('tagModal');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그를 추가 및 삭제하기 위한 엔터 및 백스페이스 처리 함수
 * 주요 기능 : # 과 스페이스 부분을 제거
 * 엔터 또는 스페이스바를 입력시 trim으로 공백을 제거한 태그 이름이 비어있거나 #만 남아있을경우 this의 값을 재설정후 리턴
 * 엔터 또는 스페이스바를 입력시 태그를 추가하는 함수 호출
 * 백스페이스바 입력시 가장 마지막에 추가된 태그를 삭제
 */
function tagKeyUp(e) {
    let tagListDiv = document.getElementsByClassName('tagListDiv')
    let tagHash = e.value.replace('#', '');
    let trimValue = e.value.trim();
    // 태그 추가
    if (window.event.keyCode == 13 || window.event.keyCode == 32) {
        if (!trimValue || trimValue == '#')
            return e.value = trimValue
        addTagList(tagHash);
    }
    // 태그삭제
    if (!e.value && window.event.keyCode == 8 && tagListDiv.length)
        return tagListDiv[tagListDiv.length - 1].remove();
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그를 검색할경우 검색된 태그리스트 모달창을 보여주고 바인딩하는 함수
 * 주요 기능 : 태그의 글자수를 제한의 알림창 호출
 * 정규식을 이용한 #을 제외한 특수문자가 검색되었을경우 알림창과 특수문자를 제거한 문자열로 검색어 재설정
 * 검색어에 #이들어올경우 #을 제거하고 검색하는 함수 호출
 */
function tagInput(e, line) {
    handleLine(e, line)
    // 특수문자 제거 정규식
    let specialRule = /[\{\}\[\]\/?.,;:|\)*~`!^\+<>@\$%&\\\=\(\'\"]/gi
    if(specialRule.test(e.value)) {
        handleAlert("태그작성에 특수문자를 작성할 수 없습니다.")
        return e.value = e.value.slice(0, -1);
    }
    let tagHash = e.value.replace('#', '');
    // 검색어가 없을경우 태그 모달창 닫기
    if (!e.value)
        return tagModal.style.display = "none";
    selectTag(tagHash)
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 검색어를 인자로 받아 태그 검색 API호출 후 태그리스트모달 표출 과 바인딩
 * 주요 기능 : text르리 body에 실어 post요청을 보낸 후 데이터 유무를 통해 태그리스트 모달 표출
 * 태그리스트 들의 데이터 바인딩
 */
function selectTag(text) {
    let tagList = document.getElementById('tagModalList');
    const url = '/tag/change'
    $.ajax({
        type: 'post',
        url: url,
        data: {
            text: text
        },
        success: function (res) {
            let tagDiv = '';
            // 반환값이 있을경우 모달창 오픈후 바인딩 로직 실행 없을경우 모달창 닫기 리턴
            if (!res.data)
                return tagModal.style.display = "none";
            else {
                tagModal.style.display = "block";
            }

            res.data.map((data) => {
                tagDiv += `<div class='tagDiv' onclick="addTagList('${data.name}')"><p>#</p><p>${data.name}</p></div>`
            })
            tagList.innerHTML = tagDiv
        },
        error: function (err) {
            console.log(err);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그를 추가했을때 발생하는 함수
 * 주요 기능 : 추가한 태그를 Element화 하여 일정 생성 및 편집의 태그 영역에 바인딩
 */
function addTagList(text) {
    let tagDiv = document.getElementById('tagList');
    let tagInput = document.getElementById('tagInput')
    // 태그 데이터를 담을 Element를 생성하는 함수 호출
    let newTag = createElements(text);
    let leftTag = document.getElementsByClassName(text)[0];
    // 태그가 이미 바인딩 되어있을경우 알림 리턴
    if (leftTag) {
        tagModal.style.display = "none";
        tagInput.value = text.trim();
        return alert("이미 태그가 존재합니다.");
    }
    tagDiv.appendChild(newTag);
    tagInput.value = '';
    tagModal.style.display = "none";
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그 이름을통해 태그영역에 바인딩될 태그를 생성하여 생성된 태그 반환
 * 주요 기능 : 태그 Element를 정의하고 클릭이벤트 정의
 */
function createElements(text) {
    let newTag = document.createElement('div');
    let tagName = document.createElement('p');
    let tagHash = document.createElement('p');
    newTag.className = 'tagListDiv';
    tagHash.innerText = '#';
    tagName.className = `tagList ${text}`;
    tagName.innerText = text;
    let newDelete = document.createElement('i');
    newDelete.className = 'fa-regular fa-circle-xmark';
    // 삭제 아이콘 클릭시 태그 삭제
    newDelete.onclick = function () {
        newTag.remove();
    }
    newTag.appendChild(tagHash);
    newTag.appendChild(tagName);
    newTag.appendChild(newDelete);
    return newTag;
}