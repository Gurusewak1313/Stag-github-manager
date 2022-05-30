// Function file for extracting repo commits and issues

////////////////////////////////////////////////////
///////////////////// Commits //////////////////////
////////////////////////////////////////////////////

// function for extracting repo Commits
async function get_commits(repoFullName){
  /*
  Creates array of objects containing each user's id, name, and array of
  timestamps of commits they have made

  parameters:
                  repoFullName: A string containing the full_name of a given public github
                  repository. Format is <owner login>/<repo name
  precondition:   none
  post condition: array of user objects saved to local storage
  */
  const auth0String = "&client_id=0c3139fac3cfea0aad24&client_secret=629f72d2a4283cabc4443d16205ab0387dc8c4a0"
  let memberCommits = [];
  let end_loop = false;
  let counter = 1;
  // Loop pages of results
  while(counter < 11 && !end_loop){
    // Build url for request to API
    url = "https://api.github.com/search/commits?q=repo:" + repoFullName + "+author-date:>2000-01-01";
    url += "&page="+counter+"&per_page=100"+ auth0String;

    const headers = {
        "Accept": "application/vnd.github.cloak-preview"
    }

    // Get the commits
    response = await fetch(url, {
        "method": "GET",
        "headers": headers
    })
    result = await response.json();

    let user_id;
    let newMember;
    // Create object into the array for each user and their commits
    if(result.items.length == 0){end_loop = true}
    result.items.forEach(i=>{
      if (i.author != null){
        user_id = i.author.id;
      }
      else{
        user_id = "0";
      }
      // add new member to array if they haven't been added yet
      if(checkUserId_issues(memberCommits, user_id) == false){
        if (user_id == "0"){
          newMember = {
            id: user_id,
            name: "committer not found",
            commits: [],
            titles: []
          }
        }
        else{
          newMember = {
            id: user_id,
            name: i.commit.author.name,
            commits: [],
            titles: []
          }
        }
        memberCommits.push(newMember);
      }
      // add date of commit to user's commit array
      let index = memberCommits.findIndex(x => x.id === user_id)
      let commitDate = Date.parse(i.commit.author.date); //change to timestamp form
      memberCommits[index].commits.push(commitDate);
      memberCommits[index].titles.push(i.commit.message)


    })
    counter += 1;
  }

  // Get the 10 users with the most commits
  let best_memberCommits_full = await best_9_commits(memberCommits)
  let best_memberCommits_top = best_memberCommits_full.slice(0,best_memberCommits_full.length - 1)

  // Save memberCommits and best_memberCommits to local storage
  let memberCommitsJSON = JSON.stringify(memberCommits)
  localStorage.setItem("memberCommits", memberCommitsJSON);

  let best_memberCommits_full_JSON = JSON.stringify(best_memberCommits_full)
  localStorage.setItem("best_memberCommits_full", best_memberCommits_full_JSON)

  let best_memberCommits_top_JSON = JSON.stringify(best_memberCommits_top)
  localStorage.setItem("best_memberCommits_top", best_memberCommits_top_JSON)
}

// function for checking a particular user id against the current ids contained
// in an array of user objects
function checkUserId_commits(memberArray, user_id){
  /* used by the find method to search for member object by their id
  parameters: memberArray
  precondition: memberArray is an array of objects containing the attribute id,
                global variable user_id is also required to have a value of the
                id being searched for
  post condition: true returned is user_id found in memberArray, false if not
  */
  let id = user_id; // change to something usable
  return memberArray.id == id

  for(var i=0; i<memberArray.length; i++){
      if(memberArray[i].id == user_id){return true}
  }
  return false
}

function best_9_commits(memberCommits){
    /*
    Extracts the 9 users with the most issues raised, and combines everything
    else into another object called "Others" with id = "-" at the last index.
    Returns a new array containing them
    */

    let best_memberCommits = [];
    let temp_memberCommits = memberCommits.slice()    // Copy memberCommits for manipulation

    // find top 9 contributors
    while(best_memberCommits.length < 9 && temp_memberCommits.length != 0){
        var best_index = 0
        var best_value = 0
        for(var i = 0; i < temp_memberCommits.length; i++){
            if(temp_memberCommits[i].commits.length > best_value){
                best_index = i;
                best_value = temp_memberCommits[i].commits.length;
            }
        }

        best_memberCommits.push(temp_memberCommits.splice(best_index, 1)[0])
    }

    // combine remaining users into a new object with name = "Others", and id = "-"
    let other_members = {
      id: "-",
      name: "Others",
      commits: []
    };

    for(var i = 0; i < temp_memberCommits.length; i++){
        for(var j = 0; j < temp_memberCommits[i].commits.length; j++){
            other_members.commits.push(temp_memberCommits[i][j])
        }
    }
    best_memberCommits.push(other_members)

    return best_memberCommits
}

////////////////////////////////////////////////////
///////////////////// Issues ///////////////////////
////////////////////////////////////////////////////

async function get_issues(repoFullName){
    /*
    Creates an object containing the issues raised by each member of the team

    Parameters:
                repoFullName:   A string containing the full_name of a given public github repository. Format is <owner login>/<repo name>

    Returns an array of objects in the form [member_object{member id, member name, list of issues}, ...]
    */
    const auth0String = "&client_id=0c3139fac3cfea0aad24&client_secret=629f72d2a4283cabc4443d16205ab0387dc8c4a0";

    var memberIssues = [];
    var url_addon;

    // Construct API request
    const url = "https://api.github.com/search/issues?q=repo:" + repoFullName + " type:issue";

    // Loop until either 200 requests have been made or all issues have been accounted for
    var counter = 1;
    var end_loop = false;

    while(counter < 11 && !end_loop){
        url_addon = "&page="+counter+"&per_page=100"+auth0String;

        // Run the API request
        response = await fetch(url + url_addon);
        result = await response.json();


        if(result.items.length == 0){end_loop = true}
        else{
            // Manipulate result data into 2 arrays of plotable data
            result.items.forEach(i => {
                // Check if user is in memberIssues, and add them if they aren't
                var user_id = i.user.id

                if(checkUserId_issues(memberIssues, user_id) == false){
                    var newMember = {
                        id: i.user.id,
                        name: i.user.login,
                        issues: [],
                        titles: []
                    }

                    memberIssues.push(newMember)
                }

                // Add the issue creation date to the user's issue array and the title to the titles array
                var index = memberIssues.findIndex(x => x.id == user_id)
                var issueDate = Date.parse(i.created_at)        // Change to timestamp form
                memberIssues[index].issues.push(issueDate)
                memberIssues[index].titles.push(i.title)
            })
            counter += 1
        }
    }

    // Get the 10 users with the most issues raised
    var best_memberIssues_full = await best_9_issues(memberIssues)
    var best_memberIssues_top = best_memberIssues_full.slice(0,best_memberIssues_full.length - 1)

    // Save memberIssues and best_memberIssues to local storage
    var memberIssues_JSON = JSON.stringify(memberIssues)
    localStorage.setItem("memberIssues", memberIssues_JSON)

    var best_memberIssues_full_JSON = JSON.stringify(best_memberIssues_full)
    localStorage.setItem("best_memberIssues_full",best_memberIssues_full_JSON)

    var best_memberIssues_top_JSON = JSON.stringify(best_memberIssues_top)
    localStorage.setItem("best_memberIssues_top",best_memberIssues_top_JSON)
}

function checkUserId_issues(memberArray, user_id){
    /*
    Function checks if a given user_id is already in memberArray.

    Parameters:
                memberArray:    A list of objects for members of a repository. Each object has a property for the member's numerical id.

                user_id:        A numerical id corresponding to a specific github user

    Returns true if the id is already in memberArray and false otherwise
    */
    for(var i=0; i<memberArray.length; i++){
        if(memberArray[i].id == user_id){return true}
    }

    return false
}

function best_9_issues(memberIssues){
    /*
    Extracts the 9 users with the most issues raised, and combines everything else into another object called "Others" with id = "-" at the last index. Returns a new array containing them
    */
    var best_memberIssues = [];
    var temp_memberIssues = memberIssues.slice()    // Copy memberIssues for manipulation

    // Get the 9 best members
    while(best_memberIssues.length < 9 && temp_memberIssues.length != 0){
      var best_index = 0
      var best_value = 0
      for(var i = 0; i < temp_memberIssues.length; i++){
        if(temp_memberIssues[i].issues.length > best_value){
          best_index = i;
          best_value = temp_memberIssues[i].issues.length;
        }
      }

      best_memberIssues.push(temp_memberIssues.splice(best_index, 1)[0])
    }

    // Combine everything else into a new object with name = "Others", and id = "-"
    var other_members = {
      id: "-",
      name: "Others",
      issues: []
    };

    for(var i = 0; i < temp_memberIssues.length; i++){
      for(var j = 0; j < temp_memberIssues[i].issues.length; j++){
        other_members.issues.push(temp_memberIssues[i][j])
      }
    }

    best_memberIssues.push(other_members)

    return best_memberIssues
  }
