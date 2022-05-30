// Created by Lucy Pugh
// Since: 11/10/2019

// Pie graph initialiser
function graph_pie(userData, userNames, htmlPieLegendId){
  /*
  Takes an array of each users commits/ issues and creates pie legend with
  ID HTMLPieLegendId.

  @return:    array with format [preferences, chartOptions, percentages, percentageStrings]
              this array can be used by Chartist.Pie to create commit/ issue pie graph

  Note: Pie chart will correlate legend colours for the first 10 userNames only.
  */

  let percentages = [];             // each members percentage of commits
  let percentageStrings = [];       // percent of commits as string with percent symbol
  let totalSum = 0;                 // tally of group total commits

  // Calculate total sum
  for(let i=0; i<userData.length; i++){
    totalSum += userData[i];
  }

  // Calculate percentages and make array of percentages with % symbol
  for(let i=0; i<userData.length; i++){
    percent = Math.round(userData[i]/totalSum*100*100)/100;
    percentages[i] = percent;
    percentageStrings.push(String(percent)+"%")
  }

  // Data for member percentage of commits
  let preferences = {
    series: [
      percentages
    ]};

  // set pie chart settings
  var chartOptions = {
    donut: true,
    donutWidth: 40,
    startAngle: 0,
    total: 100,
    showLabel: false,
    axisX: {
      showGrid: false
    }
  }

  // change commit pie graph legend to reflect each user
  let classNames = ["info", "danger", "warning", "violet", "limeGreen", "royalBlue", "orange", "green", "navy", "salmon"];
  for(let i=0; i<userData.length; i++){
    let legend = document.createElement("i");
    legend.className = "fa fa-circle text-"+classNames[i];

    htmlPieLegendId.appendChild(legend);
    htmlPieLegendId.appendChild(document.createTextNode(" "+userNames[i]+" "));
  }
  //console.log([preferences, chartOptions, percentages, percentageStrings])
  return [preferences, chartOptions, percentages, percentageStrings];
}
//

// Line graph initialiser
function graph_line(userData, userNames, htmlLineLegendId){
    /*
    Takes an array of arrays containing each user's commits/issues and creates settings for a line graph to be initialized. There may only be a maximum of 10 users, i.e. the outer array's length must be less than or equal to 10
    
    Parameters:
                userData:           An array of arrays containing timestamps corresponding to each user's commits/issues
                userNames:          An array of strings corresponding to each user's name, in the same order as in userData
                htmlLineLegendId:   An HTML id corresponding to the div containing the graph's legend
    
    Returns an array containing necessary settings and parameters for creating a line graph
    */
    
    // Convert userData time intervals to days from milliseconds
    const conversion = 86400000
    for(var i = 0; i < userData.length; i++){
        for(var j = 0; j < userData[i].length; j++){
            userData[i][j] = userData[i][j]/conversion
        }
    }
    
    // Get time intervals
    var min_time = userData[0][0]
    var max_time = userData[0][0]
    for(var i = 0; i < userData.length; i++){
        for(var j = 0; j < userData[i].length; j++){
            if(userData[i][j] < min_time){
                min_time = userData[i][j];
            }
            
            else if(userData[i][j] > max_time){
                max_time = userData[i][j]
            }
        }
    }

//    console.log("min: "+min_time)
//    console.log("max: "+max_time)
    
    var n_intervals = 10;
    var interval_time = (max_time - min_time)/n_intervals;
//    console.log("interval: "+interval_time)
    
    var data = {
        series: []      // An array of arrays of objects, where each subarray is for a single user
    };
    
    // Iterate through each user
    for(var i = 0; i<userData.length; i++){
        var y_user = new Array(n_intervals+1)
        y_user[0] = {x: 0, y: 0}
        y_user[n_intervals] = {x: max_time - min_time, y: userData[i].length}
        
        // Work out how much data user has in each time interval. Result should be strictly increasing
        for(var j = n_intervals-1; j > 0; j--){
            var counter = 0
            var point_obj = {x: 0, y: 0}

            var upper_bound = max_time - interval_time*(n_intervals - j)
//            console.log(upper_bound)
            // Iterate through user's data, and increment counter if the timestamp is within the interval
            for(var k = 0; k < userData[i].length; k++){
                if(userData[i][k] < upper_bound){
                    counter += 1
                }
            }
            point_obj.y = counter
            point_obj.x = upper_bound - min_time
            y_user[j] = point_obj
        }
        
        data.series.push(y_user)
    }
//    console.log(data.series)
    
    // Compute y_max
    y_max = 0
    for(var i = 0; i < data.series.length; i++){
        for(var j = 0; j < data.series[i].length; j++){
            if(data.series[i][j].y > y_max){
                y_max = data.series[i][j].y
            }
        }
    }
//    console.log(y_max)
    
    ///////////////////////////////////////////////////////////////////////
    //////// NOTE: This variable may not be necessary, or correct//////////
    ///////////////////////////////////////////////////////////////////////
    var responsive = [
        ["screen and (max-width: 640px)",{
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value[0];
                }
            }
        }]
    ];
    
    // Create options object
    var chart_options = {
        lineSmooth: false,
        low: 0,
        high: y_max,
        showArea: false,
        height: "245px",
        axisX: {
            showGrid: true,
            type: Chartist.AutoScaleAxis,
            onlyInteger: true
        },
        lineSmooth: Chartist.Interpolation.simple({
            divisor: 3,
        }),
        showLine: true,
        showPoint: false
    };
    
    
    var classNames = ["info", "danger", "warning", "violet", "limeGreen", "royalBlue", "orange", "green", "navy", "salmon"];
    for(let i=0; i<userData.length; i++){
        let legend = document.createElement("i");
        legend.className = "fa fa-circle text-"+classNames[i];

        htmlLineLegendId.appendChild(legend);
        htmlLineLegendId.appendChild(document.createTextNode(" "+userNames[i]+" "));
    }
    return [chart_options, data, responsive, min_time, max_time]
}

function graph_no_data(graph_id){
  /*
  when no data for a graph is given, this function creates node for a data not
  found image in place of the graph
  */
  let graphNode = document.getElementById(graph_id);

  let imgNode = document.createElement("img");
  imgNode.src = "assets/img/data_notFound.png";
  imgNode.style = "width: 60%; display: block; margin-left: auto; margin-right: auto;";

  graphNode.appendChild(imgNode);
}
