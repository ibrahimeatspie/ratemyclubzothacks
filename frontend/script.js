// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function submitForm() {
  console.log("hello");
  
  let clubs = document.getElementById("clubs");
  let stars = document.getElementById("starsrating");
  let comment = document.getElementById("fname");
  let exclusivity = document.getElementById("exclusive");
  let social = document.getElementById("socialrating");
  
 

  const data = {
    title: clubs.value,
    rating: parseInt(stars.value), 
    comment: comment.value,
    exclusivity: parseInt(exclusivity.value), 
    social: parseInt(social.value)
  };


  // Make the fetch request
  fetch("http://localhost:3000/insertRating", {
    method: "POST", // Set the method to POST
    headers: {
      "Content-Type": "application/json", // Specify the content type
    },
    body: JSON.stringify(data), // Convert the data to JSON
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // Parse the JSON response
    })
    .then((responseData) => {
      console.log("Success:", responseData);
      // You can add additional logic here, like closing the modal or displaying a success message
      modal.style.display = "none"; // Close the modal after successful submission
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    document.getElementById("fname").value = '';





 
  location.reload();
}


async function showPosts() {
  console.log("Fetching posts...");

  try {
    let response = await fetch("http://localhost:3000/getClubs", {
      method: "GET", // Set the method to GET
      headers: {
        "Content-Type": "application/json", // Specify the content type
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    let responseData = await response.json(); // Parse the JSON response
    //document.innerHTML+=responseData[i]


    const postsContainer = document.getElementById("postsContainer"); // Replace with your actual container's ID

    for(let i = 0; i<responseData.length; i++){
      const postElement = document.createElement("div"); // Create a new div for each post
     
      postElement.className= "posts";
      //iterate through the ratings, ratings is an array
      let ratings = responseData[i].ratings;
      let avgRatings = 0;
      let avgSocial = 0;
      let avgExclusivity = 0;
      for (let j = 0; j < ratings.length; j++){
        console.log(ratings[j].social)
        avgRatings += ratings[j].rating;
        avgSocial += ratings[j].social;
        avgExclusivity += ratings[j].exclusivity;
      }
      //the averages calculated
      avgExclusivity = avgExclusivity/ratings.length;
      avgRatings = avgRatings/ratings.length;
      avgSocial = avgSocial/ratings.length;

 

      //rounding the averages
      roundedExclusivity = avgExclusivity.toFixed(1);
      roundedRating = avgRatings.toFixed(1);
      roundedSocial = avgSocial.toFixed(1);



      postElement.innerHTML = `
              <a href="club.html?id=${responseData[i].id}" class="post-link">

          <div class = "clubtitle" >
            <p class = "clubtitle">${responseData[i].title}</p>
          </div>
          <hr>
          <br>
          
          <div>
          <div class = "clubinfo">
            <p class = "genrating">Rating:<br>${roundedRating}</p>
            
           <br>
            <p class = "clubinfo">Social: ${roundedSocial}</p>
            <p class = "cluvinfo">Exclusivity: ${roundedExclusivity}</p>
          </div>
          </div>
          </a>
        `; // Customize how you want to display the post data
        postsContainer.appendChild(postElement); // Append the post to the container
    }

    // Handle the response data here (e.g., display it on the page)

  } catch (error) {
    console.error("Error:", error);
  }
}


async function getID() {
let reviewContainer = document.getElementById("reviewsContainer");

 
const url = window.location.href;

const urlObj = new URL(url);

const id = urlObj.searchParams.get('id');

console.log(id); // This will log '12'



try {
  let response = await fetch("http://localhost:3000/getClub/" + id, {
    method: "GET", // Set the method to GET
    headers: {
      "Content-Type": "application/json", // Specify the content type
    }
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  let responseData = await response.json(); // Parse the JSON response
  //here you have the response data

console.log(responseData);

let ratings = responseData.ratings;
let avgRatings = 0;
let avgSocial = 0;
let avgExclusivity = 0;

const commentContainer = document.getElementById("commentsContainer")

for(let i = 0; i<responseData.ratings.length; i++){
  const postElement = document.createElement("div"); // Create a new div for each post

postElement.innerHTML = `
 <div class="comments">
            <div class="leftComment">
                <div class = "row">
                    <p> Rating: ${responseData.ratings[i].rating}</p>
                </div>
                <div class = "row">
                    <p> Social: ${responseData.ratings[i].social}</p>
                </div>
                <div class = "row">
                    <p> Exclusivity: ${responseData.ratings[i].exclusivity}</p>
                </div>
            </div>
            <div class="rightComment">
                <p> ${responseData.ratings[i].comment}</p>
            </div>
        </div>
`
commentContainer.appendChild(postElement)  

  
    avgRatings += responseData.ratings[i].rating;
    avgSocial += responseData.ratings[i].social;
    avgExclusivity += responseData.ratings[i].exclusivity;

}
  

avgExclusivity = avgExclusivity/ratings.length;
avgRatings = avgRatings/ratings.length;
avgSocial = avgSocial/ratings.length;

roundedExclusivity = avgExclusivity.toFixed(1);
roundedRating = avgRatings.toFixed(1);
roundedSocial = avgSocial.toFixed(1);



const postElement = document.createElement("div");

postElement.innerHTML = `
 <div class="reviewEntry">
            <div class="leftSection">
                <div class="ratingSection">
                    <div class="numerator">
                        <p>${roundedRating}</p>
                    </div>
                    <div class="denominator">
                        <p>/5</p>
                    </div>
                </div>

                <div class="qualitySection">
                    <p>Overall quality based off ${responseData.ratings.length} ratings</p>
                </div>
                
                <div class="nameSection">
                    <p>${responseData.title}</p>
                </div>
                <div class = "bottom">
                    <div class="botLeft">
                        <p>${roundedSocial} Social Rating</p>
                    </div>
                    <div class="botMid">
                        <p> ${roundedExclusivity} Exclusivity Rating</p>
                    </div>
                </div>
                
            </div>
            <div class="rightSection">
              <img src="${responseData.picture}" class= "clubImage">
            </div>
        </div>
        <br>
        <br>
`

reviewContainer.appendChild(postElement);


  }catch(err){
  console.log(err);
  }


}
