let totalCount = 0;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 통계페이지가 랜덩링 될시 전체적으로 바인딩되어야할 함수를 호출 하는 함수
 */
window.onload = function () {
    chartBinding();
    tagChartData();
    tagAboutSchedule();
}

// 기타 태그를 담을 배열변수
let etcLabels = [];

/**
 * 담당자 : 박신욱, 이승현
 * 함수 설명 : 태그또는 일정이 비었을 경우 화면에서 처리해야할 컴포넌트를 정의
 */
let noneTag = `<div class="emptyData">
                <p>사용된 태그가 없습니다.</p>
                <img src="images/noTag.jpg" alt="">
                <button onclick="location.href='/calendar'">태그 사용하러 가기</button>
              </div>`;

let noneSchedule = `<div class="emptyData">
                      <p>일정이 비어 있습니다.</p>
                      <img src="images/noSchedule.jpg" alt="">
                      <button onclick="location.href='/calendar'">일정 추가하러 가기</button>
                    </div>`;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 유저가 사용한 태그와 전유저가 사용한 태그 데이터를 가져오기위한 API호출과 바인딩될 데이터 정의
 * 주요 기능 : 원형 차트와 막대 차트에 바인딩 되어야할 데이터들을 가공하여 바인딩 함수 호출
 */
function chartBinding() {
    let labels = []
    let count = []
    let totalTagCount = []
    $.ajax({
        type: 'get',
        url: '/statistics/totalTagSort',
        success: function (res) {
            // 차트들이 기본적으로 6가지의 색상을 가질 수 있도록 색상 초기화
            let defaultColor = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgba(0, 0, 0, 0.5)'];
            let color = []
            // 기타 태그의 유저 사용횟수
            let etcCount = 0;
            // 기타 태그의 전체 유저 사용횟수
            let etcTotalCount = 0;
            res.data.map((data, idx) => {
                totalCount += data.count;
                // 태그의 데이터가 6종류가 넘어갈경우 기타로 데이터 추가
                if (idx < 6) {
                    totalTagCount.push(data.tag.click)
                    labels.push(data.tag.name)
                    count.push(data.count)
                    color.push(defaultColor[idx]);
                } else {
                    etcLabels.push(data.tag.name);
                    etcTotalCount += data.tag.click;
                    etcCount += data.count;
                }
                if (idx == 6) {
                    labels.push('기타')
                }
            })

            totalTagCount.push(etcTotalCount)
            count.push(etcCount)
            color.push(defaultColor[6]);

            // 가공된 데이터들을 원형차트와 막대차트에 데이터 적용
            let pieChartData = {
                labels: labels.length ? labels : ["태그가 없습니다."],
                datasets: [{
                    data: count,
                    backgroundColor: color,
                    hoverOffset: 6,
                }]
            };
            let barChartData = {
                labels: labels,
                datasets: [
                    {
                        label: '나의 태그',
                        data: count,
                        backgroundColor: color,
                    },
                    {
                        label: '전체 태그',
                        data: totalTagCount
                    }
                ]
            }
            // 데이터가 존재할 경우 막대차트와 원형차트의 데이터 바인딩 함수 호출
            // 존재하지 않을경우 정의된 컴포넌트로 처리
            if (res.data.length) {
                pieChartDraw(pieChartData)
                barChartDraw(barChartData)
            } else {
                document.getElementById('chartArea').innerHTML = noneTag
            }

        },
        error: function (err) {
            console.log(err)
        }
    })

}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그통계의 원형 차트의 바인딩
 * 주요 기능 : 유저가 사용한 태그들의 사용횟수를 보여줄 수 있는 차트 바인딩
 * 차트의 요소를 클릭시 이벤트 정의
 */
function pieChartDraw(pieChartData) {
    let ctx = document.getElementById('tagChart').getContext('2d');

    window.pieChart = new Chart(ctx, {
        type: 'pie',
        data: pieChartData,
        options: {
            responsive: false,
            // 차트의 요소를 클릭했을경우
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    let tagName = event.chart.data.labels[elements[0].index]
                    // 기타 요소를 클릭할경우 기타 일정 불러오는 함수호출
                    if (tagName != '기타') {
                        scheduleCountReq(tagName)
                        schedulePage = 0;
                        document.getElementById('scheduleDiv').innerHTML = null;
                        clickChartSchedule(tagName, 'tagSchedule')
                    } else {
                        scheduleCountReq(etcLabels)
                        schedulePage = 0;
                        document.getElementById('scheduleDiv').innerHTML = null;
                        clickChartSchedule(etcLabels, 'tagManySchedule')
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        // 차트의 요소들에대해 범례를 커스텀하여 화면에 표출하기위한 콜백 함수
                        generateLabels: function (chart) {
                            let color = chart.data.datasets[0].backgroundColor;
                            let divData = [];
                            chart.data.labels.map((label, idx) => {
                                divData.push(`<div style="margin-bottom: 5px; font-size: 14px">
                                            <span style="background-color: ${color[idx]}; display: inline-block; width: 14px; height: 14px; border-radius: 70px;">
                                            </span> ${label} <span id="percent${idx}"></span>
                                            </div>`);
                            })
                            document.getElementById('legendDiv').innerHTML = divData.join('');
                            chart.data.datasets[0].data.map((data, idx) => {
                                if (data) {
                                    let percent = data / totalCount * 100;
                                    document.getElementById(`percent${idx}`).innerHTML = ` : ${percent.toFixed(1)}%(${data})`
                                }
                            })
                        }
                    }
                },
            },
        }
    });
};

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그통계의 막대차트 데이터 바인딩
 * 주요 기능 : 유저가 사용한 태그횟수들과 전체유저가 사용한 태그횟수들을 보여줄 수 있는 차트 바인딩
 * 차트 요소를 클릭시 이벤트 정의
 */
function barChartDraw(barChartData) {
    let ctx = document.getElementById('barTagChart').getContext('2d');
    window.barChart = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: false,
            // 차트의 요소를 클릭했을경우
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    let tagName = event.chart.data.labels[elements[0].index]
                    if (tagName != '기타') {
                        clickChartSchedule(tagName, 'tagSchedule')
                    } else {
                        clickChartSchedule(etcLabels, 'tagManySchedule')
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                x: {
                    display: true
                },
                y: {
                    display: true
                }
            }
        }
    });
};

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그통계페이지가 랜더링될 시 태그 순위영역에 데이터 바인딩하는 함수
 * 주요 기능 : 태그 순위 API를 호출후 response받은 객체데이터로 데이터들을 바인딩
 */
function tagChartData() {
    const url = `/statistics/totalTagSort`;
    let tagEl = [];
    $.ajax({
        type: 'get',
        url: url,
        contentType: 'application/json',
        success: function (res) {
            let totalCount = 0;
            let color = ['#e0c134', '#c0c0c0', '#8b6331']
            res.data.map((data) => {
                totalCount += data.count;
            })
            res.data.map((data, idx) => {
                let percent = data.count / totalCount * 100;
                // 태그순위가 3위까지는 아이콘추가
                let rankIcon = idx < 3 ? `<i class="fa-solid fa-medal" style="color:${color[idx]}; font-size: 26px;"></i>` : ``;
                tagEl.push(`
                <div class="tagItem">
                <span class="itemContent"><p class="rank">${idx + 1}위</p> <p class="tag">${data.tag.name}</p>
                ${rankIcon}
                </span>
                <div style="height: 35px; width: 250px;">
                    <span style="display:inline-block; height: 66.6%;width: 250px;border-radius: 20px;background-color: #c7c7c7">
                        <span style="text-align:center ; display:inline-block; border-radius: 20px; height: 100%; width: ${percent.toFixed(1)}%; background-color: #0098fe;">
                            <span class="MemberProgressText" style="color: rgb(255, 255, 255); display: inline-block; text-align: center; height: 100%; width: 250px;">${percent.toFixed(1)}%</span>
                        </span>
                    </span>
                </div>
                <span><p class="count">${data.count}</p><p class="percent">${percent.toFixed(1)}%</p></span>
                </div>
                `)
            })
            document.getElementById('myTagHeader').innerHTML = `<p>태그 (${res.data.length})</p> &nbsp; 에 대한 통계입니다.`
            // 태그순위에 관한 데이터가 없을경우 정의된 컴포넌트로 처리
            if (res.data.length) {
                document.getElementById('tagRankGrid').innerHTML = tagEl.join('');
            } else {
                document.getElementById('myTagRank').innerHTML = noneTag;
            }
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그통계 차트에서 차트들에 걸린 이벤트에 의해 실행되어 일정목록으로 데이터를 바인딩 해주는 함수
 * 주요 기능 : 태그이름과 API리소스 값을통해 각태그 및 기타태그 데이터 호출하여 태그들에 매핑되어있는 일정들을 바인딩하는 기능
 */
function clickChartSchedule(name, address) {
    const url = `/statistics/${address}`
    $.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({name: name}),
        success: function (res) {
            let scheduleData = [];
            if (res.data.length > 1) {
                res.data.map((data) => {
                    data.scheduleId.map((schedules) => {
                        // flag변수를 선언하여 중복된 일정은 제외하고 scheduleData변수에 추가
                        let flag = scheduleData.find(value => value._id === schedules._id);
                        if (!flag) {
                            scheduleData.push(schedules);
                        }
                    })
                })
            } else {
                scheduleData = res.data.scheduleId;
            }
            tagAboutScheduleBind(scheduleData)
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그통계 차트에서 클릭한 차트들의 일정 갯수를 요청하는 함수
 * 주요 기능 : 태그이름을 인자로 받아 태그들의 일정 갯수를 요청하고 바인딩 하는기능
 */
function scheduleCountReq(name) {
    const url = `/statistics/tagScheduleCount`
    $.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({name: name}),
        success: function (res) {
            document.getElementById('scheduleCount').innerText = res.data.toString();
        },
        error: function (err) {
            console.log(err);
        }
    })
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 태그 통계 페이지가 렌더링 될시 일정 목록에 바인딩될 데이터를 요청 하는 함수
 * 주요 기능 : 일정 목록에 바인딩될 데이터들을 response객체로 받아와 일정 목록 바인딩 함수에 인자로 넘겨 바인딩 함수를 호출하는 기능
 */
function tagAboutSchedule() {
    $.ajax({
        type: 'get',
        url: `/statistics/tagAboutSchedule/?page=${schedulePage}`,
        success: function (res) {
            document.getElementById('scheduleCount').innerText = res.data.count
            if (res.data.schedules.length) {
                tagAboutScheduleBind(res.data.schedules);
            } else {
                if (!document.querySelectorAll('.scheduleDiv_li').length)
                    document.getElementById('scheduleDiv').innerHTML = noneSchedule;
            }
            if (res.data.length < 5) {
                observer.disconnect();
            } else {
                return lastDocument();
            }
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 태그 통계 페이지에서 일정 목록에 필요한 데이터들을 가공하여 데이터 바인딩하는 함수
 * 주요 기능 : 일정 시작일 및 종료일을 포함하여 인자로 받은 일정 데이터를통해 데이터 바인딩하는 기능
 */
function tagAboutScheduleBind(data) {
    let tagUl = []
    data.map((data) => {
        let startDate = new Date(data.startDate)
        var weekend = new Array('일', '월', '화', '수', '목', '금', '토');
        // 일정 목록 종료일 받아오기
        let startYear = startDate.getFullYear();
        let startMonth = startDate.getMonth() + 1;
        let startDay = startDate.getDate();
        let startDayStr = startDate.getDay();
        let startHours = startDate.getHours() < 12 ? "AM " + startDate.getHours() : "PM " + (startDate.getHours() - 12);
        let startMinutes = startDate.getMinutes();

        // 종료일
        let endDate = new Date(data.endDate ? data.endDate : data.startDate);

        // 일정 목록 종료일 받아오기
        let endYear = endDate.getFullYear()
        let endMonth = endDate.getMonth() + 1
        let endDay = endDate.getDate()
        let endDayStr = endDate.getDay()
        let endHours = endDate.getHours() < 12 ? "AM " + endDate.getHours() : "PM " + (endDate.getHours() - 12)
        let endMinutes = endDate.getMinutes()

        let tagName = []
        data.tagId.map((dataTagId) => {
            tagName.push(
                `#` + dataTagId.name + ' '
            )
        })
        tagUl.push(
            `<div class="scheduleDiv_li">
                    <div class="list_style"></div>
                    <li class='scheduleDiv'>
                        <div class="title_group">
                            <div class="title sortDivList">${data.title.length > 20 ? data.title.substr(0, 20) + '...' : data.title}</div>
                            <div class="about_tag sortDivList">${tagName.join('')}</div>
                        </div>
                        <div class="time_flex">
                            <div class="start sortDivList">
                            ${startYear}.${startMonth}.${startDay}.${weekend[startDayStr]}, ${startHours}:${startMinutes}
                            </div>
                            <div class="sortDivList"> - </div>
                            <div class="end sortDivList">
                            ${endYear}.${endMonth}.${endDay}.${weekend[endDayStr]}, ${endHours}:${endMinutes}
                            </div>
                        </div>
                    </li>
                </div>`
        )
    })
    document.getElementById('scheduleDiv').innerHTML += tagUl.join('')
}
/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그통계에서 일정리스트새로고침 버튼을 클릭했을경우 리로드 시키는 함수
 * 주요 기능 : 일정목록의 페이지와 내용을 초기화한후 전체일정을 다시 불러오는 기능
 */
function tagScheduleReload() {
    document.getElementById('scheduleDiv').innerHTML = null;
    schedulePage = 0;
    tagAboutSchedule();
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그통계에서 일정리스트의 페이징처리를 위한 함수
 * 주요 기능 : 일정리스트를 페이지 처리 하기위한 기능
 */
let schedulePage = 0;

const options = {
    // 부모 요소
    root: document.getElementById('scheduleDiv'),
    // 부모 요소와 스크롤될 마지막 요소가 50퍼센트가 겹칠경우
    threshold: 0.5
}

// 옵저버 선언
let observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        // threshold 조건이 맞을 경우
        if (entry.isIntersecting) {
            schedulePage++;
            tagAboutSchedule()
        }
    })
})

// 마지막 요소 선언
function lastDocument() {
    let lastScheduleDiv_li = document.querySelectorAll('.scheduleDiv_li');
    observer.observe(lastScheduleDiv_li[[lastScheduleDiv_li.length - 1]]);
}


