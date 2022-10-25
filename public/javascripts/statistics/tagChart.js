window.onload = function () {
    pieChartDraw();
}

let pieChartData = {
    labels: ['foo', 'bar', 'baz', 'fie', 'foe', 'fee'],
    datasets: [{
        data: [95, 12, 13, 7, 13, 10],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
    }]
};

function pieChartDraw() {
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
                                ulData.push(`<div><span style="background-color: ${color[idx]}; display: inline-block; width: 10px; height: 10px; border-radius: 70px"></span> ${label}</div>`);
                            })

                            return document.getElementById('legendDiv').innerHTML = ulData.join('');
                        }
                    }
                },
            },

        }
    });
};
