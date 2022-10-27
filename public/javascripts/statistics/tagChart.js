let totalCount = 0;

window.onload = function () {
    pieChartBinding()
    tagChartData()
    tagAboutSchedule()
}

// 태그 통계 원형 차트
function pieChartBinding() {
    let labels = []
    let count = []
    $.ajax({
        type: 'get',
        url: '/statistics/totalTag',
        success: function (res) {
            res.data.map((data) => {
                labels.push(data.tag.name)
                count.push(data.count)
                totalCount += data.count;
            })
            let pieChartData = {
                labels: labels,
                datasets: [{
                    data: count,
                    backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    hoverOffset: 6,
                }]
            };
            pieChartDraw(pieChartData)
        },
        error: function (err) {
            console.log(err)
        }
    })

}

function pieChartDraw(pieChartData) {
    let ctx = document.getElementById('tagChart').getContext('2d');

    window.pieChart = new Chart(ctx, {
        type: 'pie',
        data: pieChartData,
        options: {
            responsive: false,
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    console.log(event.chart.data.labels[elements[0].index])
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        generateLabels: function (chart) {
                            let color = chart.data.datasets[0].backgroundColor;
                            let divData = [];
                            chart.data.labels.map((label, idx) => {
                                divData.push(`<div style="margin-bottom: 6px; font-size: 14px">
                                            <span style="background-color: ${color[idx]}; display: inline-block; width: 15px; height: 15px; border-radius: 70px;">
                                            </span> ${label}: <span id="percent${idx}"></span>
                                            </div>`);
                            })
                            document.getElementById('legendDiv').innerHTML = divData.join('');
                            chart.data.datasets[0].data.map((data, idx) => {
                                let percent = data / totalCount * 100;
                                document.getElementById(`percent${idx}`).innerHTML = `${percent.toFixed(1)}%(${data})`;
                            })
                        }
                    }
                },
            },
        }
    });
};

function tagChartData() {
    const url = '/statistics/totalTagSort';
    let tagEl = [];
    $.ajax({
        type: 'get',
        url: url,
        contentType: 'application/json',
        success: function (res) {
            let totalCount = 0;
            res.data.map((data) => {
                totalCount += data.count;
            })
            res.data.map((data, idx) => {
                let percent = data.count / totalCount * 100;
                tagEl.push(`
                <div class="tagItem">
                <span class="itemContent"><p class="rank">${idx + 1}위</p> <p class="tag">${data.tag.name}</p></span>
                <div style="width: 30%; height: 120%; margin: 0 auto;overflow: hidden">
                    <span style="display:inline-block;line-height: 19px; height: 66.6%;width: 98%;border-radius: 20px;background-color: #c7c7c7">
                        <span style="text-align: center ; display:inline-block; border-radius: 20px;height: 100%;width: ${percent.toFixed(1)}%;background-color: #0098fe;">
                            <span class="MemberProgressText" style="color: rgb(255, 255, 255); display: inline-block; text-align: center; height: 100%; width: 210px;">${percent.toFixed(1)}%</span>
                        </span>
                    </span>
                </div>
                <span><p class="count">${data.count}</p><p class="percent">${percent.toFixed(1)}%</p></span>
                </div>
                `)
            })
            document.getElementById('myTagHeader').innerHTML = `<p>태그 (${res.data.length})</p> &nbsp; 에 대한 통계입니다.`
            document.getElementById('tagRankGrid').innerHTML = tagEl.join('');
        },
        error: function (err) {
            console.log(err);
        }
    })
}
// 태그 차트 클릭 시 관련된 일정 목록
function tagAboutSchedule() {
    let tagUl = []
    let tagListAboutSchedule = []
    $.ajax({
        type: 'get',
        url: '/statistics/tagAboutSchedule',
        success: function (res) {
            console.log(res.data)

            res.data.map((data) => {
                let startDate = new Date(data.startDate)
                var weekend = new Array('일', '월', '화', '수', '목', '금', '토')
                // 일정 목록 종료일 받아오기
                let startYear = startDate.getFullYear()
                let startMonth = startDate.getMonth() + 1
                let startDay = startDate.getDate()
                let startDayStr = startDate.getDay()
                let startHours = startDate.getHours() < 12 ? "AM " + startDate.getHours() : "PM " + (startDate.getHours() - 12)
                let startMinutes = startDate.getMinutes()

                // 종료일
                let endDate = new Date(data.endDate ? data.endDate : data.startDate)

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
                        `#` + dataTagId.name
                    )
                })
                tagUl.push(
                `<div class="scheduleDiv_li">
                    <div class="list_style"></div>
                    <li class='scheduleDiv' onclick="">
                        <div class="title_group">
                            <div class="title sortDivList">${data.title}</div>
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
            document.getElementById('scheduleDiv').innerHTML = tagUl.join('')
        },
        error: function (err) {
            console.log(err)
        }
    })

}