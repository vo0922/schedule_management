window.onload = function () {
    tagChartData()
    pieChartBinding()
}

let totalCount = 0;

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
                        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
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
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        generateLabels: function (chart) {
                            let color = chart.data.datasets[0].backgroundColor;
                            let ulData = [];
                            chart.data.labels.map((label, idx) => {
                                ulData.push(`<div style="margin-bottom: 6px;"><span style="background-color: ${color[idx]}; display: inline-block; width: 15px; height: 15px; border-radius: 70px"></span> ${label}</div>`);
                            })

                            return document.getElementById('legendDiv').innerHTML = ulData.join('');
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
