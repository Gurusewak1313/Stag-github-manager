// Created by: Gurusewak Singh
// Last updated: 26/09/2019

// Code functions for commit data manipulation
const btnCommits = document.getElementById("btnCommits")
btnCommits.addEventListener("click", get_commits)
let memberCommits = [];
let result = 2;
let user_id;
let counter = 0;

// main page display
async function get_commits(){
  /* displays repo commits per user
  parameters: none
  precondition: none
  post condition: list of user commits displayed
  */

  // clear previous divResults
  clear();
  memberCommits = [];
  let repoFullName = String(document.getElementById("repoFullName").value)

/*
  /* Date functionalities\
  currentTimeStamp = Date.now()
  currentDateGitForm = new Date().toJSON().substring(0,10) "eg. 2019-03-01"
  convert Git date to timestamp --> timestamp = Date.parse(GitDate)
  */

  // Loop pages of results
  for(let j=1; 11>j; j++){
    // Build url for request to API
    url = "https://api.github.com/search/commits?q=repo:" + repoFullName + "+committer-date:>2000-01-01";
    url += "&page="+j+"&per_page=100"; //add time stamp later?

    const headers = {
        "Accept": "application/vnd.github.cloak-preview"
    }

    // Get the commits
    response = await fetch(url, {
        "method": "GET",
        "headers": headers
    })
    result = await response.json();
    console.log(result)


    // Manipulate response into two arrays for x and y variables
    result.items.forEach(i=>{
      // add new member to array if they haven't been added yet
      if (i.committer != null){
        user_id = i.committer.id;
      }
      //user_id = i.committer.id
      if (memberCommits.find(checkUserId) == undefined){
        let newMember = {id: i.committer.id, name: i.commit.committer.name, commits: []};
        memberCommits.push(newMember);
      }
      // add date of commit to user's commit array
      let index = memberCommits.findIndex(x => x.id === user_id)
      let commitDate = Date.parse(i.commit.committer.date); //change to timestamp form
      memberCommits[index].commits.push(commitDate);
      counter += 1;
    })
  }

  // output each member and their data to HTML
  memberCommits.forEach(i=>{
      const anchor = document.createElement("a");
      anchor.textContent = i.name + ": " + i.commits.length;

      divResult.appendChild(anchor);
      divResult.appendChild(document.createElement("br"));
  })
}

function checkUserId(memberArray){
  /* used by the find method to search for member object by their id
  parameters: memberArray
  precondition: memberArray is an array of objects containing the attribute id,
                global variable user_id is also required to have a value of the
                id being searched for
  post condition: true returned is user_id found in memberArray, false if not
  */
  let id = user_id; // change to something usable
  return memberArray.id == id
}

// extract data?
// line graph function
function commit_line_graph(){
  /* creates a graph of accumulating data
  parameters: two arrays where x is the independent variable and y the dependent
  return: none
  precondition:
  post condition:
  */

  // manipulation of member commit data into graphical form

  // chart data from memberCommits
  let commitsOverTime = {
    labels: [],
    series: []
  };

  // chart settings
  var chartOptions = {
    lineSmooth: false,
    low: 0,
    high: 800,
    showArea: true,
    height: "245px",
    axisX: {
      showGrid: false,
    },
    lineSmooth: Chartist.Interpolation.simple({
      divisor: 3
    }),
    showLine: false,
    showPoint: false,
  };

  // screen settings
  var screenOptions = [
    ['screen and (max-width: 640px)', {
      axisX: {
        labelInterpolationFnc: function (value) {
          return value[0];
        }
      }
    }]
  ];

  // create line graph based on data and settings
  //Chartist.Line('#chartCommits', commitsOverTime, chartOptions, screenOptions);
}

function commit_pie_graph(){
  /* creates a graph of accumulating data
  parameters: two arrays where x is the independent variable and y the dependent
  return:
  precondition:
  post condition:
  */

  // manipulation of member commit data into graphical form
  let commitPercentages = [];             // each members percentage of commits
  let totalCommits = 0;                   // tally of group total commits
  let commitPercentageStrings = [];       // percent of commits as string with percent symbol
  // create array of each member's total commits
  for(let i=0; i<memberCommits.length; i++){
    commitPercentages.push(memberCommits[i].commits.length);
    totalCommits += memberCommits[i].commits.length;
  }
  // convert total commits into percentages
  for(let i=0; i<commitPercentages.length; i++){
    commitPercent = Math.round(commitPercentages[i]/totalCommits*100*100)/100;
    commitPercentages[i] = commitPercent;
    commitPercentageStrings.push(String(commitPercent)+"%")
  }

  // Data for member percentage of commits
  let commitPreferences = {
    series: [
      commitPercentages
    ]};

  // chart settings
  var chartOptions  = {
      donut: true,
      donutWidth: 40,
      startAngle: 0,
      total: 100,
      showLabel: false,
      axisX: {
          showGrid: false
      }
  };

  // create pie graph based on input data and settings
  /*Chartist.Pie('#chartPreferences', commitPreferences, chartOptions);

  // chart data with labels
  Chartist.Pie('#chartPreferences', {
    labels: commitPercentageStrings,
    series: commitPercentages
  })
  };
  */

}

// commit data page
function commit_page(){
  /* displays repo commits onto the commit page
  parameters: repoName is a string of the full name of the repo in the format
              <owner login>/<repo name>
  return:
  precondition:
  post condition:
  */
}
// extract data?
// raw data table
// pie graph

// Clears the text field
function clear(){
  /* clears existing divResults */
    while(divResult.firstChild) divResult.removeChild(divResult.firstChild)
}
