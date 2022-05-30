// Created by: Lucy Pugh
// Since: 19/09/2019

// extract user arrays from local storage
let memberCommits_JSON = localStorage.getItem("memberCommits");
let best_memberCommits_full_JSON = localStorage.getItem("best_memberCommits_full");
let best_memberCommits_top_JSON = localStorage.getItem("best_memberCommits_top");

let memberCommits = JSON.parse(memberCommits_JSON)
let best_memberCommits_full = JSON.parse(best_memberCommits_full_JSON);
let best_memberCommits_top= JSON.parse(best_memberCommits_top_JSON);

// dashboard html ids
const commitPieLegendId = document.getElementById("commitPieGraphLegend");
const commitPieId = '#commitPieGraph';
const commitLineLegendId = document.getElementById("commitLineGraphLegend");
const commitLineId = '#commitLineGraph';
const commit_line_subtitle_id = document.getElementById("commits_line_subtitle")

// object used to run pie graphing for user commits
commits_pie_dashboard = {
  // create pie graph on main page
  initChartist: function(){
    commits = [];
    names = [];

    // pop Others member if commits array is empty
    if(best_memberCommits_full[best_memberCommits_full.length-1].commits.length == 0){
      best_memberCommits_full.pop()
    }

    // Stop graphing if memberCommits is empty
    if(best_memberCommits_full.length == 0){
      graph_no_data(commitPieId.substring(1));
      return
    }

    // create array of each member's total commits and another array of names
    for(let i=0; i<best_memberCommits_full.length; i++){
      commits.push(best_memberCommits_full[i].commits.length);
      names.push(best_memberCommits_full[i].name);
    }

    // initialise pie graph settings
    commitPieSettings = graph_pie(commits, names, commitPieLegendId);

    // create pie graph based on input data and settings
    Chartist.Pie(commitPieId, commitPieSettings[0], commitPieSettings[1]);
    // chart data with labels
    Chartist.Pie(commitPieId, {
      labels: commitPieSettings[3],
      series: commitPieSettings[2]
    })
  }
};

// object used to create line graph for user commmits
commits_line_dashboard = {
  // create line graph on main page
  initChartist: function(){
    commits = [];
    names = [];

    // Stop graphing if memberCommits is empty
    if(best_memberCommits_top.length == 0){
      graph_no_data(commitLineId.substring(1));
      return
    }

    // create array of each member's total commits and another array of names
    for(let i=0; i<best_memberCommits_top.length; i++){
      commits.push(best_memberCommits_top[i].commits);
      names.push(best_memberCommits_top[i].name);
    }

    // create line graph based on input data and settings
    commitLineSettings = graph_line(commits, names, commitLineLegendId);

    // create line graph based on input data and settings
    Chartist.Line(commitLineId, commitLineSettings[1], commitLineSettings[0], commitLineSettings[2]);
      
    const conversion = 86400000
    
    var temp = String(new Date(commitLineSettings[3] * conversion))
    temp = temp.split(" ").splice(1,3)
    var min_date = ""
    for(var k = 0; k < temp.length; k++){
        min_date += temp[k] + " "
    }
      
    var temp = String(new Date(commitLineSettings[4] * conversion))
    temp = temp.split(" ").splice(1,3)
    var max_date = ""
    for(var k = 0; k < temp.length; k++){
        max_date += temp[k] + " "
    }
      
    commit_line_subtitle_id.innerHTML = "Graphs the commits pushed over time of the 9 users who pushed the most commits. Time is measured in days from the oldest commit shown. The date of the oldest commit shown is: " + min_date + ", and the date of the most recent commit pushed is: " + max_date
  }
}

// graphs used in commits.html are identical to ones used in dashboard.html
let commits_pie_commitsPage = commits_pie_dashboard;
let commits_line_commitsPage = commits_line_dashboard;


function commits_table(memberCommits, table_id, recent_list_id){
    /*
    Fills the table in issues.html with the correct values

    Parameters:
                memberIssues:   A list of objects for each repo member's issues raised. Object is returned by the get_issues function

                table_id:       A string containing the html id for the div that will contain the body of the table of users

                recent_list_id: A string containing the html id for the div that will contain the body of the table of recent commits
    */

    // Table of users

    // Sort necessary data into arrays to make future steps easier
    var names = []
    var commits = []
    var recent_commits = []

    for(var i = 0; i < memberCommits.length; i++){
        commits.push(memberCommits[i].commits.length)
        names.push(memberCommits[i].name)

        // Get the date of the most recent commit a user has pushed
        var temp = String(new Date(memberCommits[i].commits[0]))
        temp = temp.split(" ").splice(1,3)

        var commit_date = ""
        for(var k = 0; k < temp.length; k++){
            commit_date += temp[k] + " "
        }
        recent_commits.push(commit_date)
    }

    // Begin construction the table of users

    // Column headings
    table_id.innerHTML = "<thead> <th>Name</th> <th>Total commits pushed</th> <th>Date of most recent commit pushed</th> </thead>"

    // Table body
    table_id.innerHTML += "<tbody>"
    for(var i = 0; i < commits.length; i++){
        table_id.innerHTML += "<tr> <td>"+names[i]+"</td> <td>"+commits[i]+"</td> <td>"+recent_commits[i]+"</td> </tr>"
    }
    table_id.innerHTML += "</tbody>"



    // Table of most recent commits

    // Sort necessary data into arrays to make future steps easier
    var names = []
    var commit_titles = []
    var commit_dates = []
    var temp_memberCommits = memberCommits.slice()      // Copy memberCommits for manipulation

    // Loop 50 times
    while(commit_dates.length < 50 && temp_memberCommits.length != 0){
        // Get the most recent commit
        var max_index = 0
        var max_val = 0
        for(var i = 0; i < temp_memberCommits.length; i++){
            if(temp_memberCommits[i].commits[0] > max_val){
                max_index = i
                max_val = temp_memberCommits[i].commits[0]
            }
        }
        names.push(temp_memberCommits[max_index].name)
        commit_dates.push(temp_memberCommits[max_index].commits.splice(0,1)[0])
        commit_titles.push(temp_memberCommits[max_index].titles.splice(0,1)[0])

        if(temp_memberCommits[max_index].commits.length == 0){
            temp_memberCommits.splice(max_index, 1)
        }
    }

    for(var i = 0; i < commit_dates.length; i++){
        var temp = String(new Date(commit_dates[i]))
        temp = temp.split(" ").splice(1,3)

        var commit_date = ""
        for(var k = 0; k < temp.length; k++){
            commit_date += temp[k] + " "
        }
        commit_dates[i] = commit_date
    }



    // Begin constructing table of commits

    // Column headings
    recent_list_id.innerHTML = "<thead> <th>Commit message</th> <th>Committer name</th> <th>Date</th> </thead>"

    //Table body
    recent_list_id.innerHTML += "<tbody>"
    for(var i = 0; i < commit_dates.length; i++){
        recent_list_id.innerHTML += "<tr> <td>"+commit_titles[i]+"</td> <td>"+names[i]+"</td> <td>"+commit_dates[i]+"</td> </tr>"
    }
    recent_list_id.innerHTML += "</tbody>"
}

var url = window.location.href
var filename = url.substring(url.lastIndexOf("/") + 1)

if(filename == "commits.html"){
    // Run table function
    const commits_table_id = document.getElementById("commits_table")
    const recent_list_id = document.getElementById("recent_commits_table")
    commits_table(memberCommits, commits_table_id, recent_list_id)
}
