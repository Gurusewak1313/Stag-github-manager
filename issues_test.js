// Begin executing when the button is clicked
const btnIssues = document.getElementById("btnIssues")
btnIssues.addEventListener("click", get_issues)


async function get_issues(){
    // Reset output space and results array
    clear();
    var memberIssues = []
    var url_addon
    
    // Construct API request
    const repoFullName = String(document.getElementById("repoFullName").value)
    const url = "https://api.github.com/search/issues?q=repo:" + repoFullName + " type:issue"
        
    
    // Loop until either 900 requests have been made or all issues have been accounted for
    var counter = 1
    var end_loop = false
    while(counter < 8 && !end_loop){
        url_addon = "&page="+counter+"&per_page=100"
        
        // Run the API request
        response = await fetch(url + url_addon)
        result = await response.json()
        console.log(result)
        
        if(result.total_count == 0){
            end_loop = true
        }
        else{
            // Manipulate result data into 2 arrays of plotable data
            result.items.forEach(i=>{
                // Check if user is in memberIssues, and add them if they aren't
                var user_id = i.user.id

                if(checkUserId(memberIssues, user_id) == false){
                    var newMember = {
                        id: i.user.id,
                        name: i.user.login,
                        issues: []
                    }

                    memberIssues.push(newMember)
                }

                // Add the issue creation date to user's issue array
                var index = memberIssues.findIndex(x => x.id == user_id)
                var issueDate = Date.parse(i.created_at)       // Change to timestamp form
                memberIssues[index].issues.push(issueDate)

            })
            counter += 1
        }
    }
    console.log(memberIssues)
    
    // Print each member's data to the result space
    memberIssues.forEach(i=>{
        const anchor = document.createElement("a")
        anchor.textContent = i.name + ": " + i.issues.length;
        divResult.appendChild(anchor)
        divResult.appendChild(document.createElement("br"))
    })
}

function checkUserId(memberArray, user_id){
    /*
    Function checks if a given user_id is already in memberArray.
    
    Returns true if the id is already in memberArray and false otherwise
    */
    for(var i=0; i<memberArray.length; i++){
        if(memberArray[i].id == user_id){return true}
    }
    
    return false
}

// Clears the text field
function clear(){
    while(divResult.firstChild) divResult.removeChild(divResult.firstChild)
}