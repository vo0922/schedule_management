window.onload = function () {
    pieChartBinding()
}

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
                legend:{
                    display: false,
                    labels:{
                        generateLabels: function (chart) {
                            console.log(chart);
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
