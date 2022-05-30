type = ['','info','success','warning','danger'];


demo = {
    initChartist: function(){
      const headers = {"Accept": "application/vnd.github.cloak-preview"}
      let url = 'https://api.github.com/search/commits?q=repo:' + '/nana12394527/ProjectLemon/'

      // Fetch commits
      const response = await fetch(url, {
        "method": "GET",
        "headers": headers
      })
      const result = await reponse.json()

      user_data = [];
      result.items.forEach(i=>{
      if !(user_data.includes(i.author.id)){
        user_data.append({
          id: i.author.id,
          name: i.author.name,
          commits: [0]
        })
      }
      })

        var dataSales = {
          labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM', '9:00AM', '12:00AM'],
          series: [
             [287, 385, 490, 492, 554, 586, 698, 695, 752, 788],
            [67, 152, 143, 240, 287, 335, 435, 437, 539, 542],
            [23, 113, 67, 108, 190, 239, 307, 308, 439, 410]
          ]
        };

        var optionsSales = {
          lineSmooth: false,
          low: 0,
          high: 800,
          showArea: false,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false,
        };

        var responsiveSales = [
          ['screen and (max-width: 640px)', {
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        // Chartist creates graph using 'chartHours' as div id for the graph on HTML
        Chartist.Line('#chartHours', dataSales, optionsSales, responsiveSales);

        var dataPreferences = {
            series: [
                [25, 30, 20, 25]
            ]
        };

        var optionsPreferences = {
            donut: true,
            donutWidth: 40,
            startAngle: 0,
            total: 100,
            showLabel: false,
            axisX: {
                showGrid: false
            }
        };

        Chartist.Pie('#chartPreferences', dataPreferences, optionsPreferences);

        Chartist.Pie('#chartPreferences', {
          labels: ['62%','32%','6%'],
          series: [62, 32, 6]
        });
    },

}
