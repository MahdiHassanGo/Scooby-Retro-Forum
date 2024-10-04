// Load all posts or filter by category
const loadAllPost = async (category) => {
    // Start with the base URL
    let url = "https://openapi.programming-hero.com/api/retro-forum/posts";
  
    // Use if-else to append the category if it exists
    if (category) {
      url += `?category=${category}`;
    }
  
    console.log(url); // To check the URL construction
  
    try {
      // Fetch data from the API
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.posts) {
        displayAllPost(data.posts);
      } else {
        console.error("No posts found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  document.getElementById('post-container').innerHTML = ""; // Clear previous posts
  
  // Display posts in the container
  const displayAllPost = (posts) => {
    const postContainer = document.getElementById("post-container");
  
    // Check if the postContainer element exists
    if (!postContainer) {
      console.error("postContainer element not found!");
      return;
    }
  
    postContainer.innerHTML = ""; // Clear previous posts
  
    // Loop through and display posts
    posts.forEach((post) => {
      const div = document.createElement("div");
      div.classList.add("post-card"); // Adding a class for easier custom styling if needed later
      div.innerHTML = `
        <div class="p-6 lg:p-12 flex gap-6 lg:flex-row flex-col items-center lg:items-start bg-gray-100  border border-white rounded-md shadow-lg">
          <div class="indicator bg-[#F3F3F5] rounded-3xl">
            <span class="indicator-item badge ${post.isActive ? "bg-green-600" : "bg-red-500"}"></span>
            <div class="avatar">
              <div class="w-24 rounded-xl">
                <img src="${post.image}" />
              </div>
            </div>
          </div>
          <div class="space-y-4 w-full">
            <div class="flex gap-4 opacity-60">
              <p># ${post.category}</p>
              <p>Author: ${post.author.name}</p>
            </div>
            <h3 class="text-2xl font-bold opacity-70">${post.title}</h3>
            <p class="opacity-40">${post.description}</p>
            <hr class="border border-dashed border-gray-300" />
            <div class="flex justify-between font-bold [&>*:not(:last-child)]:opacity-45">
              <div class="flex gap-4">
                <div class="space-x-2 flex items-center">
                  <i class="fa-regular fa-comment-dots"></i>
                  <p>${post.comment_count}</p>
                </div>
                <div class="space-x-2 flex items-center">
                  <i class="fa-regular fa-eye"></i>
                  <p>${post.view_count}</p>
                </div>
                <div class="space-x-2 flex items-center">
                  <i class="fa-regular fa-clock"></i>
                  <p>${post.posted_time} Min</p>
                </div>
              </div>
              <div class="opacity-100">
                <button id="addToList" onclick="markAsRead('${post.description}','${post.view_count}')" data-post='${JSON.stringify(post)}' class="addToList btn bg-green-500 btn-sm btn-circle">
                  <i class="fa-solid fa-envelope-open text-white"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      postContainer.appendChild(div);
    });
  };
  
  // Mark post as read
  const markAsRead = (description, view_count) => {
    const markAsReadContainer = document.getElementById("markAsReadContainer");
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="flex justify-between p-2 lg:p-3 bg-white rounded-2xl items-center gap-3">
        <div class="lg:w-4/5 w-11/12">
          <p>${description}</p>
        </div>
        <div class="lg:w-1/5 w-4/12 flex justify-end">
          <p><i class="fa-regular fa-eye"></i> ${view_count}</p>
        </div>
      </div>
    `;
    markAsReadContainer.appendChild(div);
    handleCount();
  };
  
  // Update the mark as read counter
  const handleCount = () => {
    const prevCount = document.getElementById('markAsReadCounter').innerText;
    const convertedCounter = parseInt(prevCount);
    const sum = convertedCounter + 1;
    document.getElementById('markAsReadCounter').innerText = sum;
  };
  
  // Search posts by category
  const handleSearchByCategory = () => {
    const searchText = document.getElementById("searchPosts").value;
    loadAllPost(searchText);
  };
  
  // Initial call to load all posts
  loadAllPost(); // Call without a category to load all posts initially
  


  const loadLatestPosts = async () => {
    const url = "https://openapi.programming-hero.com/api/retro-forum/latest-posts";
    const latestPostContainer = document.getElementById("latest-post-container");
    const loader = document.getElementById("latestPostLoader");
  
    // Show loader while fetching data
    loader.classList.remove("hidden");
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      const data = await response.json();
  
      // Log the response data to inspect
      console.log("Fetched Data:", data);
  
      // Hide loader once data is fetched
      loader.classList.add("hidden");
  
      if (data.posts && data.posts.length > 0) {
        latestPostContainer.innerHTML = ''; // Clear previous posts
        data.posts.forEach(post => {
          const postCard = `
            <div class="card lg:w-96 pb-5 bg-base-100 shadow-2xl">
              <figure class="lg:px-6 px-4 pt-4 lg:pt-8">
                <img src="${post.cover_image}" alt="Post Image" class="rounded-xl" />
              </figure>
              <div class="p-5 lg:p-10 space-y-4 lg:space-y-5">
                <p class="opacity-50 text-start">
                  <i class="fa-solid fa-calendar-days me-2"></i>${post.posted_date || "No Publish Date"}
                </p>
                <h2 class="card-title text-start">${post.title}</h2>
                <p class="text-start">${post.description}</p>
                <div class="card-actions flex gap-5 items-center">
                  <div class="avatar">
                    <div class="lg:w-12 w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src="${post.profile_image}" />
                    </div>
                  </div>
                  <div>
                    <h3 class="text-start font-extrabold">${post.author.name || "Unknown"}</h3>
                    <p class="text-start opacity-60">${post.author.designation || "Unknown"}</p>
                  </div>
                </div>
              </div>
            </div>
          `;
          latestPostContainer.innerHTML += postCard; // Append new post card
        });
      } else {
        latestPostContainer.innerHTML = "<p>No latest posts found.</p>";
      }
    } catch (error) {
      console.error("Error fetching latest posts:", error);
      loader.classList.add("hidden");
      latestPostContainer.innerHTML = "<p>Error loading posts. Please try again later.</p>";
    }
  };
  
  // Call the function to load latest posts
  loadLatestPosts();
  