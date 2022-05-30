// Get necessary data from local storage
var memberIssues_JSON = localStorage.getItem("memberIssues")
var best_memberIssues_full_JSON = localStorage.getItem("best_memberIssues_full")
var best_memberIssues_top_JSON = localStorage.getItem("best_memberIssues_top")

var memberIssues = JSON.parse(memberIssues_JSON)
var best_memberIssues_full = JSON.parse(best_memberIssues_full_JSON)
var best_memberIssues_top = JSON.parse(best_memberIssues_top_JSON)

function issues_pie_plot(memberIssues, chart_id, legend_id){
    /*
    Creates a pie chart for the issues raised by repo members

    Parameters:
                memberIssues:   A list of objects for each repo member's issues raised. Object is returned by the get_issues function

                chart_id:       A string containing the html id for the div that will contain the pie chart

                legend_id:      A string containing the html id for the div that will contain the pie chart's legend

    Returns an object containing the necessary data to graph a pie chart
    */

    // pop Others member if issues array is empty
    if(memberIssues[memberIssues.length-1].issues.length == 0){
      memberIssues.pop()
    }

    // Object used to run graphing function
    issues_pie_chart = {
        initChartist: function(){
            issues = [];
            names = [];

            // Stop graphing if memberIssues is empty
            if(memberIssues.length == 0){
              graph_no_data(chart_id.substring(1));
              return
            }

            // Create array of each member's total issues and another array containing their names
            for(var i=0; i<memberIssues.length; i++){
                issues.push(memberIssues[i].issues.length);
                names.push(memberIssues[i].name);
            }

            // Create pie chart based on input data
            issues_pie_settings = graph_pie(issues, names, legend_id);
            Chartist.Pie(chart_id, issues_pie_settings[0], issues_pie_settings[1]);
            Chartist.Pie(chart_id, {
                labels: issues_pie_settings[3],
                series: issues_pie_settings[2]
            })
        }
    };
    return issues_pie_chart
}

function issues_line_graph(memberIssues, chart_id, legend_id, subtitle_id){
    /*
    Creates a line graph for the issues raised by repo members

    Parameters:
                memberIssues:   A list of objects for each repo member's issues raised. Object is returned by the get_issues function

                chart_id:       A string containing the html id for the div that will contain the pie chart

                legend_id:      A string containing the html id for the div that will contain the pie chart's legend

    Returns an object containing the necessary data to graph a pie chart
    */

    // Object used to run graphing function
    issues_line_chart = {
        initChartist: function(){
            issues = [];
            names = [];

            // Stop graphing if memberIssues is empty
            if(memberIssues.length == 0){
              graph_no_data(chart_id.substring(1));
              return
            }

            // Create an array of arrays containing each member's issues and another array containing their names
            for(var i = 0; i < memberIssues.length; i++){
                issues.push(memberIssues[i].issues);
                names.push(memberIssues[i].name);
            }

            // Create line graph based on input data\
            issues_line_settings = graph_line(issues, names, legend_id)
            Chartist.Line(chart_id, issues_line_settings[1], issues_line_settings[0], issues_line_settings[2])
            
            const conversion = 86400000
            
            var temp = String(new Date(issues_line_settings[3] * conversion))
            temp = temp.split(" ").splice(1,3)
            var min_date = ""
            for(var k = 0; k < temp.length; k++){
                min_date += temp[k] + " "
            }
            
            var temp = String(new Date(issues_line_settings[4] * conversion))
            temp = temp.split(" ").splice(1,3)
            var max_date = ""
            for(var k = 0; k < temp.length; k++){
                max_date += temp[k] + " "
            }
            subtitle_id.innerHTML = "Graphs the issues raised over time of the 9 users who raised the most issues. Time is measured in days from the oldest issue shown. The date of the oldest issue shown is: " + min_date + ", and the date of the most recent issue raised is: " + max_date
        }
    }
    return issues_line_chart
}

function issues_table(memberIssues, table_id, recent_list_id){
    /*
    Fills the table in issues.html with the correct values

    Parameters:
                memberIssues:   A list of objects for each repo member's issues raised. Object is returned by the get_issues function

                table_id:       A string containing the html id for the div that will contain the body of the table of users

                recent_list_id: A string containing the html id for the div that will contain the body of the table of recent issues
    */

    // Table of users

    // Sort necessary data into arrays to make future steps easier
    var names = []
    var issues = []
    var recent_issues = []

    for(var i = 0; i < memberIssues.length; i++){
        issues.push(memberIssues[i].issues.length)
        names.push(memberIssues[i].name)

        // Get the date of the most recent issue a user has raised
        var temp = String(new Date(memberIssues[i].issues[0]))
        temp = temp.split(" ").splice(1,3)

        var issue_date = ""
        for(var k = 0; k < temp.length; k++){
            issue_date += temp[k] + " "
        }
        recent_issues.push(issue_date)
    }

    // Begin constructing the table of users

    // Column headings
    table_id.innerHTML = "<thead> <th>Name</th> <th>Total issues raised</th> <th>Date of most recent issue raised</th> </thead>"

    // Table body
    table_id.innerHTML += "<tbody>"
    for(var i = 0; i < issues.length; i++){
        table_id.innerHTML += "<tr> <td>"+names[i]+"</td> <td>"+issues[i]+"</td> <td>"+recent_issues[i]+"</td> </tr>"
    }
    table_id.innerHTML += "</tbody>"



    // Table of most recent issues

    // Sort necessary data into arrays to make future steps easier
    var names = []
    var issue_titles = []
    var issue_dates = []
    var temp_memberIssues = memberIssues.slice()    // Copy memberIssues for manipulation

    // Loop 50 times
    while(issue_dates.length < 50 && temp_memberIssues.length != 0){
        // Get the most recent issue
        var max_index = 0
        var max_val = 0
        for(var i = 0; i < temp_memberIssues.length; i++){
            if(temp_memberIssues[i].issues[0] > max_val){
                max_index = i
                max_val = temp_memberIssues[i].issues[0]
            }
        }
        names.push(temp_memberIssues[max_index].name)
        issue_dates.push(temp_memberIssues[max_index].issues.splice(0,1)[0])
        issue_titles.push(temp_memberIssues[max_index].titles.splice(0,1)[0])

        if(temp_memberIssues[max_index].issues.length == 0){
            temp_memberIssues.splice(max_index, 1)
        }
    }

    for(var i = 0; i < issue_dates.length; i++){
        var temp = String(new Date(issue_dates[i]))
        temp = temp.split(" ").splice(1,3)

        var issue_date = ""
        for(var k = 0; k < temp.length; k++){
            issue_date += temp[k] + " "
        }
        issue_dates[i] = issue_date
    }



    // Begin constructing the table of issues

    // Column headings
    recent_list_id.innerHTML = "<thead> <th>Issue title</th> <th>Issue raiser name</th> <th>Date</th> </thead>"

    //Table body
    recent_list_id.innerHTML += "<tbody>"
    for(var i = 0; i < issue_dates.length; i++){
        recent_list_id.innerHTML += "<tr> <td>"+issue_titles[i]+"</td> <td>"+names[i]+"</td> <td>"+issue_dates[i]+"</td> </tr>"
    }
    recent_list_id.innerHTML += "</tbody>"
}

var url = window.location.href
var filename = url.substring(url.lastIndexOf("/") + 1)

// Run graphing functions
const dash_issues_pie_id = "#issuesPieGraph"
const dash_issues_pie_legend_id = document.getElementById("issuesPieGraphLegend")

const dash_issues_line_id = "#issuesLineGraph"
const dash_issues_line_legend_id = document.getElementById("issuesLineGraphLegend")
const issues_line_subtitle_id = document.getElementById("issues_line_subtitle")

issues_pie_dashboard = issues_pie_plot(best_memberIssues_full, dash_issues_pie_id, dash_issues_pie_legend_id);

issues_line_dashboard = issues_line_graph(best_memberIssues_top, dash_issues_line_id, dash_issues_line_legend_id, issues_line_subtitle_id)

// graphs in dashboard and issues page are identical
let issues_pie_issuesPage = issues_pie_dashboard;
let issues_lines_issuesPage = issues_line_dashboard;

if(filename == "issues.html"){
    // Run table function
    const issues_table_id = document.getElementById("issues_table")
    const recent_list_id = document.getElementById("recent_issues_table")
    issues_table(memberIssues, issues_table_id, recent_list_id)
}
