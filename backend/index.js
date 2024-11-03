const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const { PrismaClient } = require("@prisma/client");


app.use(cors()); // Enable CORS for all routes

// Middleware to parse JSON
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

const prisma = new PrismaClient(); // Instantiate Prisma Client

// Example route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/createClub", async (req, res) => {
  const { title, description } = req.body;

  // Validate input
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }

  try {
    // Create a new Post in the database
    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        ratings: { // Initialize ratings as an empty array
          create: [] // This ensures no ratings are created initially
        },
      },
    });

    // Send the created post as the response
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating club:", error);
    return res.status(500).json({ error: "An error occurred while creating the club." });
  }
});

// Route to insert a rating
app.post("/insertRating", async (req, res) => {
  const { title, comment, rating, exclusivity, social } = req.body;
  console.log("Inserted rating for",title)

  // Validate input
  if (!title || !comment || rating === undefined || exclusivity === undefined || social === undefined) {
    return res.status(400).json({ error: "Title, comment, rating, exclusivity, and social are required." });
  }

  try {
    // Check if the post exists
    const postExists = await prisma.post.findFirst({
      where: { title: title }, // Find the post by its title
    });

    if (!postExists) {
      return res.status(404).json({ error: "Club does not exist" });
    }

    // If the post exists, create a new rating
    const newRating = await prisma.rating.create({
      data: {
        comment,
        rating,
        exclusivity,
        social,
        postId: postExists.id, // Set the postId to link the rating to the post
      },
    });

    return res.status(201).json({ message: "Rating added successfully", rating: newRating });
  } catch (error) {
    console.error("Error adding rating:", error);
    return res.status(500).json({ error: "Failed to add rating" });
  }
});


// Route to get all clubs (posts)
app.get("/getClubs", async (req, res) => {
  try {
    const clubs = await prisma.post.findMany({
      include: {
        ratings: true, // Optionally include ratings if you want to return them with each club
      },
    });

    return res.status(200).json(clubs); // Return the clubs in the response
  } catch (error) {
    console.error("Error retrieving clubs:", error);
    return res.status(500).json({ error: "Failed to retrieve clubs" });
  }
});

// Route to get a specific club by ID
app.get("/getClub/:id", async (req, res) => {
  // console.log("bruh")
  const { id } = req.params;
  // console.log(id)

  try {
    // Find the club (post) by its ID
    const club = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        ratings: true, // Optionally include ratings associated with the club
      },
    });

    // Check if the club was found
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }

    // Return the club data
    return res.status(200).json(club);
  } catch (error) {
    console.error("Error retrieving club:", error);
    return res.status(500).json({ error: "Failed to retrieve club" });
  }
});



// // Route to insert a rating
// app.post("/insertRating", async (req, res) => {
//   console.log(req.body);
//   const postTitle = req.body.title; // Use the title from the request body
//   const newRating = req.body.rating; // Use the rating from the request body

//   try {
//     // Check if the post exists
//     const postExists = await prisma.post.findFirst({
//       where: { title: postTitle },
//     });

//     if (!postExists) {

      
//       return res.status(500).json({ error: "Club does not exist" });
//     } else {
//       // If the post exists, update the post by appending the new rating
//       const updatedPost = await prisma.post.update({
//         where: { id: postExists.id }, // Use the existing post's id
//         data: {
//           rating: {
//             push: newRating, // Append the new rating to the existing ratings array
//           },
//           exclusivity:{
//             push: newExclusivity,
//           },
//           comment


//         },
//       });
      
//       return res.json({ message: "Rating added successfully", post: updatedPost });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to process request" });
//   }
// });

// app.get("/getPosts", async (req, res)=>{
//     try {
//         const posts = await prisma.post.findMany(); // Retrieve all posts
//         return res.json(posts); // Return the posts in the response
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Failed to retrieve posts" });
//       }
// })

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
