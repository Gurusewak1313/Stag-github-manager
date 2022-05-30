// get repo by name function
async function generateDisplay() {

    // paste search onto search bar
    document.getElementById("resultContent").textContent = "Searching for: " + localStorage.getItem("searchQuery");

    //set location to generate results:
    var divResult = document.getElementById("resultContent");

    //Auth0 client ID and key (developer version)
    const auth0String = "&client_id=0c3139fac3cfea0aad24&client_secret=629f72d2a4283cabc4443d16205ab0387dc8c4a0"

    // Loading thing
    divResult.innerHTML = "<div style='font-size: 32pt' ><img src='assets/img/importLoading.gif' style = 'height: 64pt'> Loading....</div>";

    // Search by name
    if (localStorage.getItem("searchType") == "name") {
        const repoName = localStorage.getItem("searchQuery");
        var url = "https://api.github.com/search/repositories?q=" +
            repoName; // Sort results with the most stars appearing first
    } else { // Search by URL
        const repoURLEntry = localStorage.getItem("searchQuery");
        var splitURL = repoURLEntry.split("/")
        fullNamePart2 = splitURL.pop()
        fullNamePart1 = splitURL.pop()
        fullName = fullNamePart1 + "/" + fullNamePart2
        var url = "https://api.github.com/search/repositories?q=repo:";
        url += fullName + auth0String;
    }

    // Get the data based on the given parameters
    const response = await fetch(url);
    const result = await response.json();

    // delete loading gif when done loading
    divResult.innerHTML = "";

    // array to store full names in (to open dashboard later)
    var full_names = [];

    var resultCount = 0
    // Print the repo image, name, description to the result space
    if (result.items != undefined){
		result.items.forEach(i => {
			// add full name to list of names.
			full_names.push(i.full_name);

			const img = document.createElement("img");
			img.src = i.owner.avatar_url; // Repo owner's avatar image
			img.style.width = "40pt";
			img.style.height = "40px";
			img.style.marginTop = "10pt";
			img.style.marginLeft = "20pt";

			// Container for each item
			const itemBlock = document.createElement("div");
			itemBlock.className = "itemBlock";

			// Container for image and button
			const thumbnailAndButton = document.createElement("div");
			thumbnailAndButton.className = "thumbnailAndButton";
			itemBlock.appendChild(thumbnailAndButton);

			// insert image into thumbnail container
			thumbnailAndButton.appendChild(img);

			// add button with an id
			const button = document.createElement("div");
			button.className = "openButton";
			button.textContent = "Open";
			button.setAttribute('onclick', 'openDashboard(\"' + i.full_name + '\");');
			thumbnailAndButton.appendChild(button);

			// -- Load Text --
			const textWrapper = document.createElement("div");
			itemBlock.appendChild(textWrapper); // insert text wrapper to main wrapper

			// Title
			const repoTitle = document.createElement("div");
			repoTitle.className = "repoTitle";
			repoTitle.append(i.full_name);
			textWrapper.appendChild(repoTitle);

			// separate title and description with a small gap
			const textGap = document.createElement("div");
			textGap.style.height = "1pt";
			textWrapper.appendChild(textGap);

			// Repo description
			const repoDesc = document.createElement("div");
			repoDesc.className = "repoDesc";
			if (i.description != null) { // character limit = 150
				if (i.description.length > 250) {
					i.description = i.description.substr(0, 250);
					i.description += "     ......";
				}
			} else {
				i.description = "No description found"
			}
			repoDesc.append(i.description);
			textWrapper.appendChild(repoDesc);
			// paste search result onto page
			divResult.appendChild(itemBlock);
			resultCount++;
		})
	}

    // Check for empty seatches
    if (resultCount == 0) {
        divResult.append("Your search for:")
        divResult.appendChild(document.createElement("br"))
        divResult.append(localStorage.getItem("searchQuery"))
        divResult.appendChild(document.createElement("br"))
        divResult.append("has yielded no results")
        divResult.appendChild(document.createElement("br"))
        divResult.appendChild(document.createElement("br"))
        divResult.append("Maybe try:")
        divResult.appendChild(document.createElement("br"))
        divResult.append("- copying and pasting the URL directly from github.")
        divResult.appendChild(document.createElement("br"))
        divResult.append("- using a different search term")
    }

    //Save full names to local storage for later access
}

function checkInput() {
    // Get data from user input form
    var userSearchInput = document.getElementById("searchForm");
    var searchQuery = searchForm[0].value;
    var searchType = searchForm[2].value;
    // save data to local storage
    localStorage.setItem("searchQuery", searchQuery);
    localStorage.setItem("searchType", searchType);
    // redirect to search if input not blank
    if (localStorage.getItem("searchQuery") != "") window.location = "search.html";
}

function openDashboard(full_name) { // Actually opens loading page first, then open dashboard
    localStorage.setItem("repoFullName", full_name);
    window.location = "loading.html";
}
