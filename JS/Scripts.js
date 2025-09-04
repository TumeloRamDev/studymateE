// ================ Global Variables ================
let tasks = []; // Stores all tasks
let studyHours = 0; // Tracks total study time
let quizzesTaken = 0; // Tracks quiz attempts

// ================ DOM Elements ================
const scheduleForm = document.querySelector(".schedule-form form");
const taskList = document.querySelector(".task-list ul");
const progressSummary = document.querySelector(".progress-summary ul");
const progressChart = document.querySelector(".progress-chart");

// ================ Schedule Page Functions ================
function addTask(taskName, date, time) {
  const task = {
    id: Date.now(),
    name: taskName,
    date: date,
    time: time,
    completed: false
  };
  
  tasks.push(task);
  renderTaskList();
  saveToLocalStorage();
}

function renderTaskList() {
  if (!taskList) return;
  
  taskList.innerHTML = '';
  
  tasks.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
      <span class="task-name">${task.name}</span>
      <span class="task-date">${formatDate(task.date)}, ${task.time}</span>
      <button class="complete-btn" data-id="${task.id}">✓</button>
    `;
    taskList.appendChild(taskItem);
  });
  
  // Add event listeners to complete buttons
  document.querySelectorAll(".complete-btn").forEach(btn => {
    btn.addEventListener("click", completeTask);
  });
}

function completeTask(e) {
  const taskId = parseInt(e.target.dataset.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex !== -1) {
    // Update study hours when task is completed
    studyHours += 1; // Assuming 1 hour per task
    quizzesTaken += 1; // Increment quiz counter
    
    tasks.splice(taskIndex, 1);
    renderTaskList();
    updateProgress();
    saveToLocalStorage();
  }
}

// ================ Progress Page Functions ================
function updateProgress() {
  if (!progressSummary) return;
  
  progressSummary.innerHTML = `
    <li>🕒 Total Study Hours: <strong>${studyHours} hrs</strong></li>
    <li>✅ Completed Tasks: <strong>${tasks.length}</strong></li>
    <li>🧠 AI Quizzes Taken: <strong>${quizzesTaken}</strong></li>
  `;
  
  // This would be replaced with a real chart library like Chart.js
  if (progressChart) {
    progressChart.innerHTML = `
      <h3>Study Hours Over the Week</h3>
      <div class="chart-placeholder" style="height: 200px; background: #f0f0f0; display: flex; align-items: flex-end; justify-content: space-around; padding: 20px;">
        ${generateChartBars()}
      </div>
    `;
  }
}

function generateChartBars() {
  // Simulated data for the chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let bars = '';
  
  days.forEach(day => {
    const height = Math.floor(Math.random() * 100) + 10;
    bars += `
      <div style="width: 12%; height: ${height}%; background: #004d99; display: flex; flex-direction: column; justify-content: flex-end; align-items: center;">
        <span style="color: white; font-size: 12px;">${day}</span>
      </div>
    `;
  });
  
  return bars;
}

// ================ Utility Functions ================
function formatDate(dateString) 
{
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function saveToLocalStorage() 
{
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
  localStorage.setItem('studyHours', studyHours);
  localStorage.setItem('quizzesTaken', quizzesTaken);
}

function loadFromLocalStorage() 
{
  const savedTasks = localStorage.getItem('studyTasks');
  const savedHours = localStorage.getItem('studyHours');
  const savedQuizzes = localStorage.getItem('quizzesTaken');
  
  if (savedTasks) tasks = JSON.parse(savedTasks);
  if (savedHours) studyHours = parseInt(savedHours);
  if (savedQuizzes) quizzesTaken = parseInt(savedQuizzes);
}

// ================ Event Listeners ================
if (scheduleForm) {
  scheduleForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskName = this.querySelector("input[type='text']").value;
    const date = this.querySelector("input[type='date']").value;
    const time = this.querySelector("input[type='time']").value;

    if (!taskName || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }

    addTask(taskName, date, time);
    this.reset();
  });
}

// ================ Initialize App ================
function initApp() {
  loadFromLocalStorage();
  renderTaskList();
  updateProgress();
}

// Run when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
// Quiz questions array
const questions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Paris", correct: true },
      { text: "Berlin", correct: false },
      { text: "Madrid", correct: false }
    ]
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false }
    ]
  },
  {
    question: "What is 2 + 2?",
    answers: [
      { text: "3", correct: false },
      { text: "4", correct: true },
      { text: "5", correct: false },
      { text: "6", correct: false }
    ]
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      { text: "Vincent van Gogh", correct: false },
      { text: "Pablo Picasso", correct: false },
      { text: "Leonardo da Vinci", correct: true },
      { text: "Michelangelo", correct: false }
    ]
  },
  {
    question: "What is the largest mammal?",
    answers: [
      { text: "Elephant", correct: false },
      { text: "Blue Whale", correct: true },
      { text: "Giraffe", correct: false },
      { text: "Polar Bear", correct: false }
    ]
  }
];

// DOM elements
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const resultsContainer = document.getElementById('results');
const resultText = document.getElementById('result-text');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score');

// Quiz state variables
let shuffledQuestions, currentQuestionIndex, score;

// Event listeners
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});
restartButton.addEventListener('click', startQuiz);

// Start quiz function
function startQuiz() {
  startButton.classList.add('hide');
  resultsContainer.classList.add('hide');
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  questionContainer.classList.remove('hide');
  setNextQuestion();
}

// Set next question
function setNextQuestion() {
  resetState();
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;
  } else {
    endQuiz();
  }
}

// Display question
function showQuestion(question) {
  questionElement.textContent = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.classList.add('answer-btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtons.appendChild(button);
  });
}

// Reset quiz state
function resetState() {
  nextButton.classList.add('hide');
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

// Handle answer selection
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === 'true';
  
  if (correct) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  }
  
  Array.from(answerButtons.children).forEach(button => {
    setStatusClass(button, button.dataset.correct === 'true');
  });
  
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.remove('hide');
  }
}

// Set answer status (correct/wrong)
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

// Clear answer status
function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}

// End quiz function
function endQuiz() {
  questionContainer.classList.add('hide');
  resultsContainer.classList.remove('hide');
  resultText.textContent = `You scored ${score} out of ${shuffledQuestions.length}!`;
  
  // Save quiz results to localStorage
  const quizResults = {
    date: new Date().toLocaleDateString(),
    score: score,
    totalQuestions: shuffledQuestions.length,
    percentage: Math.round((score / shuffledQuestions.length) * 100)
  };
  
  // Save to progress tracking
  saveQuizResults(quizResults);
}

// Save quiz results to localStorage
function saveQuizResults(results) {
  let quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
  quizHistory.push(results);
  localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
  
  // Update total quizzes taken in main tracker
  let quizzesTaken = parseInt(localStorage.getItem('quizzesTaken')) || 0;
  quizzesTaken++;
  localStorage.setItem('quizzesTaken', quizzesTaken);
}
// ========== Portal Functionality ==========
document.addEventListener('DOMContentLoaded', function() {
  // Initialize any portal-specific functionality
  initPortals();
});

function initPortals() {
  // Shared portal functionality
  console.log('Portal initialized');
  
  // Check if on lecturer portal
  if (document.querySelector('.lecturer-portal')) {
    initLecturerPortal();
  }
  
  // Check if on tutor portal
  if (document.querySelector('.tutor-portal')) {
    initTutorPortal();
  }
}

function initLecturerPortal() {
  // Lecturer-specific functionality
  console.log('Lecturer portal initialized');
  
  // Example: Track material uploads
  const uploadLinks = document.querySelectorAll('a[href="upload-lecture.html"]');
  uploadLinks.forEach(link => {
    link.addEventListener('click', function() {
      console.log('Navigating to upload page');
      // Could add analytics tracking here
    });
  });
}

function initTutorPortal() {
  // Tutor-specific functionality
  console.log('Tutor portal initialized');
  
  // Example: Handle session scheduling
  const scheduleLinks = document.querySelectorAll('a[href="tutor-schedule.html"]');
  scheduleLinks.forEach(link => {
    link.addEventListener('click', function() {
      console.log('Navigating to schedule page');
      // Could add analytics tracking here
    });
  });
}

// ========== Shared Portal Functions ==========
function trackPortalActivity(activityType) {
  // Send activity data to server
  console.log(`Tracking activity: ${activityType}`);
  // In a real app, this would be an API call
}
// ===== Profile Data =====
const profileData = {
  username: "Gift Rametsi",
  title: "Computer Science Student",
  school: "University of South Africa",
  bio: "Passionate student and lifelong learner. Currently focused on web development and AI technologies.",
  stats: {
    studyHours: 142,
    quizzesTaken: 38,
    streakDays: 15
  },
  skills: [
    { name: "JavaScript", level: 85 },
    { name: "Python", level: 75 },
    { name: "Data Structures", level: 80 },
    { name: "HTML/CSS", level: 90 }
  ],
  friends: [
    { id: 1, name: "Sarah", avatar: "friend1.jpg" },
    { id: 2, name: "John", avatar: "friend2.jpg" },
    { id: 3, name: "Emma", avatar: "friend3.jpg" },
    { id: 4, name: "Michael", avatar: "friend4.jpg" },
    { id: 5, name: "Lisa", avatar: "friend5.jpg" },
    { id: 6, name: "David", avatar: "friend6.jpg" }
  ],
  activities: [
    { date: "2023-06-15", type: "quiz", duration: "25 mins", details: "Advanced JavaScript (Score: 92%)" },
    { date: "2023-06-14", type: "study", duration: "2 hrs", details: "Data Structures algorithms" },
    { date: "2023-06-12", type: "note", duration: "-", details: "Chemistry 101 Chapter 4" },
    { date: "2023-06-10", type: "quiz", duration: "18 mins", details: "Web Development Basics (Score: 88%)" },
    { date: "2023-06-08", type: "study", duration: "1.5 hrs", details: "Database Design" },
    { date: "2023-06-05", type: "note", duration: "-", details: "Physics Equations Summary" },
    { date: "2023-06-03", type: "quiz", duration: "30 mins", details: "Python Fundamentals (Score: 95%)" }
  ],
  followers: 127,
  following: 84
};

// ===== DOM Elements =====
const darkModeToggle = document.getElementById('dark-mode-toggle');
const profileImage = document.getElementById('profile-image');
const changePhotoBtn = document.getElementById('change-photo-btn');
const photoUpload = document.getElementById('photo-upload');
const avatarModal = document.getElementById('avatar-modal');
const closeModal = document.querySelector('.close-modal');
const saveCropBtn = document.getElementById('save-crop');
const editBioBtn = document.getElementById('edit-bio-btn');
const userBio = document.getElementById('user-bio');
const bioEdit = document.getElementById('bio-edit');
const addSkillBtn = document.getElementById('add-skill-btn');
const skillsList = document.getElementById('skills-list');
const testSkillsBtn = document.getElementById('test-skills-btn');
const friendsList = document.getElementById('friends-list');
const viewAllFriendsBtn = document.getElementById('view-all-friends');
const findFriendsBtn = document.getElementById('find-friends');
const activityFilter = document.getElementById('activity-filter');
const activityTable = document.getElementById('activity-history');
const exportActivityBtn = document.getElementById('export-activity');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// ===== Dark Mode Functionality =====
function initDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
  }
  
  darkModeToggle.addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
}

// ===== Profile Picture Upload =====
function initProfilePicture() {
  changePhotoBtn.addEventListener('click', () => photoUpload.click());
  
  photoUpload.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = document.getElementById('image-to-crop');
        img.src = event.target.result;
        avatarModal.classList.add('show');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  
  closeModal.addEventListener('click', () => avatarModal.classList.remove('show'));
  
  saveCropBtn.addEventListener('click', function() {
    // In a real app, we would crop and save the image here
    // For now, we'll just use the uploaded image directly
    profileImage.src = document.getElementById('image-to-crop').src;
    avatarModal.classList.remove('show');
    
    // Save to localStorage for demo purposes
    localStorage.setItem('profileImage', profileImage.src);
  });
  
  // Load saved profile image if exists
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    profileImage.src = savedImage;
  }
}

// ===== Bio Editing =====
function initBioEditing() {
  editBioBtn.addEventListener('click', function() {
    if (bioEdit.classList.contains('hide')) {
      // Switch to edit mode
      bioEdit.value = userBio.textContent;
      userBio.classList.add('hide');
      bioEdit.classList.remove('hide');
      editBioBtn.textContent = 'Save Bio';
      bioEdit.focus();
    } else {
      // Save changes
      const newBio = bioEdit.value.trim();
      userBio.textContent = newBio || "No bio yet";
      userBio.classList.remove('hide');
      bioEdit.classList.add('hide');
      editBioBtn.textContent = 'Edit Bio';
      
      // Save to localStorage for demo purposes
      localStorage.setItem('userBio', userBio.textContent);
    }
  });
  
  // Load saved bio if exists
  const savedBio = localStorage.getItem('userBio');
  if (savedBio) {
    userBio.textContent = savedBio;
  }
}

// ===== Skills Management =====
function initSkills() {
  renderSkills();
  
  addSkillBtn.addEventListener('click', addNewSkill);
  testSkillsBtn.addEventListener('click', testSkills);
}

function renderSkills() {
  skillsList.innerHTML = '';
  
  profileData.skills.forEach(skill => {
    const skillElement = document.createElement('div');
    skillElement.className = 'skill';
    skillElement.innerHTML = `
      <div class="skill-name">
        <span>${skill.name}</span>
        <span>${skill.level}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-level" style="width: ${skill.level}%"></div>
      </div>
    `;
    skillsList.appendChild(skillElement);
  });
}

function addNewSkill() {
  const skillName = prompt('Enter skill name:');
  if (!skillName) return;
  
  const skillLevel = parseInt(prompt('Enter skill level (1-100):'));
  if (isNaN(skillLevel)) return;
  
  const validatedLevel = Math.min(100, Math.max(0, skillLevel));
  
  profileData.skills.push({
    name: skillName,
    level: validatedLevel
  });
  
  renderSkills();
  saveSkills();
}

function testSkills() {
  alert('This would launch a skill assessment quiz in a real app');
}

function saveSkills() {
  localStorage.setItem('userSkills', JSON.stringify(profileData.skills));
}

// ===== Friends System =====
function initFriendsSystem() {
  renderFriends();
  
  viewAllFriendsBtn.addEventListener('click', viewAllFriends);
  findFriendsBtn.addEventListener('click', findFriends);
}

function renderFriends() {
  friendsList.innerHTML = '';
  
  // Display first 6 friends
  const friendsToShow = profileData.friends.slice(0, 6);
  
  friendsToShow.forEach(friend => {
    const friendElement = document.createElement('div');
    friendElement.className = 'friend';
    friendElement.innerHTML = `
      <img src="Images/${friend.avatar}" alt="${friend.name}">
      <span>${friend.name}</span>
    `;
    friendsList.appendChild(friendElement);
  });
}

function viewAllFriends() {
  alert('This would show all friends in a modal or separate page');
}

function findFriends() {
  alert('This would open a friend search interface');
}

// ===== Activity History =====
let currentPage = 1;
const itemsPerPage = 5;

function initActivityHistory() {
  renderActivities();
  setupPagination();
  
  activityFilter.addEventListener('change', filterActivities);
  exportActivityBtn.addEventListener('click', exportActivities);
  prevPageBtn.addEventListener('click', goToPrevPage);
  nextPageBtn.addEventListener('click', goToNextPage);
}

function renderActivities(filter = 'all', page = 1) {
  const tbody = activityTable.querySelector('tbody');
  tbody.innerHTML = '';
  
  // Filter activities
  let filteredActivities = profileData.activities;
  if (filter !== 'all') {
    filteredActivities = profileData.activities.filter(
      activity => activity.type === filter
    );
  }
  
  // Paginate
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(
    startIndex, 
    startIndex + itemsPerPage
  );
  
  // Render
  paginatedActivities.forEach(activity => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${activity.date}</td>
      <td>${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</td>
      <td>${activity.duration}</td>
      <td>${activity.details}</td>
    `;
    tbody.appendChild(row);
  });
  
  // Update pagination info
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  pageInfo.textContent = `Page ${page} of ${totalPages}`;
  
  // Update button states
  prevPageBtn.disabled = page === 1;
  nextPageBtn.disabled = page === totalPages;
}

function filterActivities() {
  currentPage = 1;
  renderActivities(activityFilter.value, currentPage);
}

function goToPrevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderActivities(activityFilter.value, currentPage);
  }
}

function goToNextPage() {
  const filteredActivities = activityFilter.value === 'all' 
    ? profileData.activities 
    : profileData.activities.filter(a => a.type === activityFilter.value);
  
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  
  if (currentPage < totalPages) {
    currentPage++;
    renderActivities(activityFilter.value, currentPage);
  }
}

function exportActivities() {
  alert('This would export your activity history as a CSV file');
}

function setupPagination() {
  const totalPages = Math.ceil(profileData.activities.length / itemsPerPage);
  pageInfo.textContent = `Page 1 of ${totalPages}`;
  prevPageBtn.disabled = true;
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();
  initProfilePicture();
  initBioEditing();
  initSkills();
  initFriendsSystem();
  initActivityHistory();
  
  // Load profile data
  document.getElementById('username').textContent = profileData.username;
  document.querySelector('.user-title').textContent = profileData.title;
  document.querySelector('.user-school').textContent = profileData.school;
  document.getElementById('study-hours').textContent = profileData.stats.studyHours;
  document.getElementById('quizzes-taken').textContent = profileData.stats.quizzesTaken;
  document.getElementById('streak-days').textContent = profileData.stats.streakDays;
  document.getElementById('follower-count').textContent = profileData.followers;
  document.getElementById('following-count').textContent = profileData.following;
  
  // Load saved skills if exists
  const savedSkills = localStorage.getItem('userSkills');
  if (savedSkills) {
    profileData.skills = JSON.parse(savedSkills);
    renderSkills();
  }
});
// ===== Feed Data =====
const feedData = {
  posts: [
    {
      id: 1,
      userId: 101,
      userName: "Sarah Johnson",
      userTitle: "Computer Science Major",
      userAvatar: "leader1.jpg",
      type: "achievement",
      time: "2 hours ago",
      content: "Just reached 100 study hours on StudyMate! 🎉",
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: 2,
      userId: 102,
      userName: "Michael Chen",
      userTitle: "Engineering Student",
      userAvatar: "leader2.jpg",
      type: "notes",
      time: "5 hours ago",
      content: "Shared my notes on Data Structures and Algorithms. Hope this helps everyone preparing for exams!",
      file: {
        name: "DSA_Notes.pdf",
        type: "pdf"
      },
      likes: 18,
      comments: 5,
      isLiked: true
    },
    {
      id: 3,
      userId: 103,
      userName: "Emma Williams",
      userTitle: "Mathematics Tutor",
      userAvatar: "leader3.jpg",
      type: "question",
      time: "1 day ago",
      content: "Can someone explain how to solve this calculus problem? I'm stuck on the integration part.",
      image: "math-problem.jpg",
      likes: 12,
      comments: 14,
      isLiked: false
    }
  ],
  currentUser: {
    id: 100,
    name: "Gift Rametsi",
    avatar: "default-avatar.jpg"
  }
};

// ===== Feed Functions =====
function initFeedPage() {
  renderPosts();
  setupEventListeners();
}

function renderPosts(filter = "all", sort = "recent") {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  // Filter posts
  let filteredPosts = feedData.posts;
  if (filter !== "all") {
    filteredPosts = feedData.posts.filter(post => post.type === filter);
  }

  // Sort posts
  if (sort === "popular") {
    filteredPosts.sort((a, b) => b.likes - a.likes);
  } else if (sort === "commented") {
    filteredPosts.sort((a, b) => b.comments - a.comments);
  } else {
    // Default: most recent (already sorted in data)
  }

  // Render posts
  filteredPosts.forEach(post => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);
  });
}

function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "post-card";
  postElement.dataset.postId = post.id;

  // Post header
  let postHeader = `
    <div class="post-header">
      <img src="Images/${post.userAvatar}" alt="${post.userName}" class="post-avatar">
      <div class="post-user">
        <div class="post-user-name">${post.userName}</div>
        <div class="post-user-title">${post.userTitle}</div>
        <span class="post-time">${post.time}</span>
      </div>
    </div>
  `;

  // Post type badge
  let typeBadge = "";
  if (post.type === "notes") {
    typeBadge = '<span class="post-type">Notes</span>';
  } else if (post.type === "question") {
    typeBadge = '<span class="post-type">Question</span>';
  } else if (post.type === "achievement") {
    typeBadge = '<span class="post-type">Achievement</span>';
  }

  // Post content
  let postContent = `
    <div class="post-content">
      ${post.content}
    </div>
  `;

  // Post file/image
  let postMedia = "";
  if (post.file) {
    postMedia = `
      <a href="#" class="post-file">
        <img src="Icons/file-icon.svg" alt="File icon">
        <span>${post.file.name}</span>
      </a>
    `;
  } else if (post.image) {
    postMedia = `
      <img src="Images/${post.image}" alt="Post image" class="post-image">
    `;
  }

  // Post actions
  let likeButtonClass = post.isLiked ? "liked" : "";
  let likeButtonText = post.isLiked ? "Liked" : "Like";

  let postActions = `
    <div class="post-actions-bar">
      <div class="post-action like-btn ${likeButtonClass}" data-post-id="${post.id}">
        <img src="Icons/like-icon.svg" alt="Like">
        <span>${likeButtonText}</span>
        <span class="like-count">${post.likes}</span>
      </div>
      <div class="post-action comment-btn" data-post-id="${post.id}">
        <img src="Icons/comment-icon.svg" alt="Comment">
        <span>Comment</span>
        <span>${post.comments}</span>
      </div>
      <div class="post-action share-btn" data-post-id="${post.id}">
        <img src="Icons/share-icon.svg" alt="Share">
        <span>Share</span>
      </div>
    </div>
  `;

  // Comment form
  let commentForm = `
    <div class="post-comments">
      <div class="comment-form">
        <img src="Images/${feedData.currentUser.avatar}" alt="Your avatar" class="comment-avatar">
        <input type="text" class="comment-input" placeholder="Write a comment...">
        <button class="btn-small post-comment-btn" data-post-id="${post.id}">Post</button>
      </div>
    </div>
  `;

  // Combine all parts
  postElement.innerHTML = `
    ${postHeader}
    ${typeBadge}
    ${postContent}
    ${postMedia}
    ${postActions}
    ${commentForm}
  `;

  return postElement;
}

function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      document.querySelector(".filter-btn.active").classList.remove("active");
      this.classList.add("active");
      const filter = this.dataset.filter;
      const sort = document.getElementById("feed-sort").value;
      renderPosts(filter, sort);
    });
  });

  // Sort dropdown
  document.getElementById("feed-sort").addEventListener("change", function() {
    const filter = document.querySelector(".filter-btn.active").dataset.filter;
    const sort = this.value;
    renderPosts(filter, sort);
  });

  // Post submission
  document.getElementById("post-submit").addEventListener("click", createNewPost);

  // Like buttons (delegated)
  document.addEventListener("click", function(e) {
    if (e.target.closest(".like-btn")) {
      const likeBtn = e.target.closest(".like-btn");
      const postId = parseInt(likeBtn.dataset.postId);
      toggleLike(postId, likeBtn);
    }
  });

  // Note modal
  document.getElementById("add-note-btn").addEventListener("click", openNoteModal);
  document.querySelector("#note-modal .close-modal").addEventListener("click", closeNoteModal);
  document.getElementById("cancel-note").addEventListener("click", closeNoteModal);
  document.getElementById("share-note").addEventListener("click", shareNote);
}

function createNewPost() {
  const postText = document.getElementById("post-text").value.trim();
  if (!postText) return;

  const newPost = {
    id: Date.now(),
    userId: feedData.currentUser.id,
    userName: feedData.currentUser.name,
    userTitle: "Student",
    userAvatar: feedData.currentUser.avatar,
    type: "post",
    time: "Just now",
    content: postText,
    likes: 0,
    comments: 0,
    isLiked: false
  };

  feedData.posts.unshift(newPost);
  document.getElementById("post-text").value = "";
  renderPosts();
}

function toggleLike(postId, likeBtn) {
  const post = feedData.posts.find(p => p.id === postId);
  if (!post) return;

  if (post.isLiked) {
    post.likes--;
    post.isLiked = false;
    likeBtn.classList.remove("liked");
    likeBtn.querySelector("span:not(.like-count)").textContent = "Like";
  } else {
    post.likes++;
    post.isLiked = true;
    likeBtn.classList.add("liked");
    likeBtn.querySelector("span:not(.like-count)").textContent = "Liked";
  }

  likeBtn.querySelector(".like-count").textContent = post.likes;
}

function openNoteModal() {
  document.getElementById("note-modal").classList.add("show");
}

function closeNoteModal() {
  document.getElementById("note-modal").classList.remove("show");
}

function shareNote() {
  const noteContent = document.getElementById("note-content").value.trim();
  if (!noteContent) return;

  const fileInput = document.getElementById("note-file");
  let fileName = "";
  
  if (fileInput.files.length > 0) {
    fileName = fileInput.files[0].name;
  }

  const newPost = {
    id: Date.now(),
    userId: feedData.currentUser.id,
    userName: feedData.currentUser.name,
    userTitle: "Student",
    userAvatar: feedData.currentUser.avatar,
    type: "notes",
    time: "Just now",
    content: noteContent,
    likes: 0,
    comments: 0,
    isLiked: false
  };

  if (fileName) {
    const fileExt = fileName.split(".").pop().toLowerCase();
    newPost.file = {
      name: fileName,
      type: fileExt
    };
  }

  feedData.posts.unshift(newPost);
  document.getElementById("note-content").value = "";
  fileInput.value = "";
  closeNoteModal();
  renderPosts();
}

// Initialize feed page if we're on it
if (document.querySelector(".feed-container")) {
  initFeedPage();
}
// ===== Tutor Profile Functions =====
function initTutorProfile() {
  // Load tutor data
  loadTutorData();
  
  // Setup event listeners
  setupTutorEventListeners();
  
  // Initialize dark mode if needed
  if (document.getElementById('dark-mode-toggle')) {
    initDarkMode();
  }
}

function loadTutorData() {
  const tutorData = {
    name: "Dr. Sarah Johnson",
    title: "Mathematics Tutor",
    bio: "PhD in Mathematics with 8 years of tutoring experience. Specialized in Calculus, Linear Algebra, and Statistics. My teaching approach focuses on building strong foundational knowledge while making complex concepts accessible.",
    stats: {
      sessions: 427,
      students: 183,
      responseTime: 2
    },
    rating: {
      stars: 4.9,
      reviews: 128
    },
    subjects: [
      { name: "Calculus", level: "Advanced", rate: 60 },
      { name: "Linear Algebra", level: "University", rate: 55 },
      { name: "Statistics", level: "Intermediate", rate: 50 }
    ],
    qualifications: [
      "PhD in Mathematics, University of Cape Town",
      "Certified Mathematics Tutor, SAT Association",
      "MSc in Applied Mathematics, Stellenbosch University"
    ],
    reviews: [
      {
        author: "James Wilson",
        date: "2023-05-15",
        rating: 5,
        content: "Dr. Johnson made calculus understandable for the first time in my life. Her patience and clear explanations are unmatched."
      },
      {
        author: "Emma Brown",
        date: "2023-04-22",
        rating: 5,
        content: "The best tutor I've ever had. She breaks down complex problems into manageable steps."
      }
    ]
  };

  // Populate profile data
  document.getElementById('tutor-name').textContent = tutorData.name;
  document.querySelector('.tutor-title').textContent = tutorData.title;
  document.getElementById('tutor-bio').textContent = tutorData.bio;
  document.getElementById('sessions-completed').textContent = tutorData.stats.sessions;
  document.getElementById('students-helped').textContent = tutorData.stats.students;
  document.getElementById('response-time').textContent = tutorData.stats.responseTime;
  document.querySelector('.rating-value').textContent = `${tutorData.rating.stars} (${tutorData.rating.reviews} reviews)`;

  // Render stars
  const starsContainer = document.querySelector('.stars');
  starsContainer.innerHTML = '';
  const fullStars = Math.floor(tutorData.rating.stars);
  const hasHalfStar = tutorData.rating.stars % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsContainer.innerHTML += '★';
    } else if (i === fullStars && hasHalfStar) {
      starsContainer.innerHTML += '½';
    } else {
      starsContainer.innerHTML += '☆';
    }
  }

  // Render subjects
  const subjectsContainer = document.getElementById('subjects-container');
  subjectsContainer.innerHTML = '';
  tutorData.subjects.forEach(subject => {
    const subjectElement = document.createElement('div');
    subjectElement.className = 'subject-item';
    subjectElement.innerHTML = `
      <div>
        <div class="subject-name">${subject.name}</div>
        <div class="subject-details">${subject.level} • $${subject.rate}/hr</div>
      </div>
    `;
    subjectsContainer.appendChild(subjectElement);
  });

  // Render qualifications
  const qualificationsContainer = document.getElementById('qualifications-container');
  qualificationsContainer.innerHTML = '';
  tutorData.qualifications.forEach(qualification => {
    const qualElement = document.createElement('div');
    qualElement.className = 'qualification-item';
    qualElement.textContent = qualification;
    qualificationsContainer.appendChild(qualElement);
  });

  // Render reviews
  renderReviews(tutorData.reviews);
}

function renderReviews(reviews, page = 1) {
  const reviewsPerPage = 3;
  const startIndex = (page - 1) * reviewsPerPage;
  const paginatedReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const reviewsContainer = document.getElementById('reviews-list');
  reviewsContainer.innerHTML = '';

  paginatedReviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    reviewElement.innerHTML = `
      <div class="review-header">
        <span class="review-author">${review.author}</span>
        <span class="review-date">${review.date}</span>
      </div>
      <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
      <div class="review-content">${review.content}</div>
    `;
    reviewsContainer.appendChild(reviewElement);
  });

  // Update pagination info
  document.getElementById('review-page-info').textContent = `Page ${page} of ${totalPages}`;
  document.getElementById('prev-review').disabled = page === 1;
  document.getElementById('next-review').disabled = page === totalPages;
}

function setupTutorEventListeners() {
  // Photo upload
  document.getElementById('change-tutor-photo').addEventListener('click', () => {
    document.getElementById('tutor-photo-upload').click();
  });

  document.getElementById('tutor-photo-upload').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(event) {
        document.getElementById('tutor-image').src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Bio editing
  document.getElementById('edit-bio-btn').addEventListener('click', function() {
    const bioEdit = document.getElementById('bio-edit');
    const tutorBio = document.getElementById('tutor-bio');
    
    if (bioEdit.classList.contains('hide')) {
      bioEdit.value = tutorBio.textContent;
      tutorBio.classList.add('hide');
      bioEdit.classList.remove('hide');
      this.textContent = 'Save Bio';
    } else {
      tutorBio.textContent = bioEdit.value || tutorBio.textContent;
      tutorBio.classList.remove('hide');
      bioEdit.classList.add('hide');
      this.textContent = 'Edit Bio';
    }
  });

  // Subject modal
  document.getElementById('add-subject-btn').addEventListener('click', function() {
    document.getElementById('subject-modal').classList.add('show');
  });

  document.querySelector('#subject-modal .close-modal').addEventListener('click', function() {
    document.getElementById('subject-modal').classList.remove('show');
  });

  document.getElementById('cancel-subject').addEventListener('click', function() {
    document.getElementById('subject-modal').classList.remove('show');
  });

  document.getElementById('save-subject').addEventListener('click', function() {
    const name = document.getElementById('subject-name').value.trim();
    const level = document.getElementById('subject-level').value;
    const rate = document.getElementById('subject-rate').value;
    
    if (name) {
      const subjectsContainer = document.getElementById('subjects-container');
      const subjectElement = document.createElement('div');
      subjectElement.className = 'subject-item';
      subjectElement.innerHTML = `
        <div>
          <div class="subject-name">${name}</div>
          <div class="subject-details">${level} • $${rate}/hr</div>
        </div>
      `;
      subjectsContainer.appendChild(subjectElement);
      
      document.getElementById('subject-name').value = '';
      document.getElementById('subject-modal').classList.remove('show');
    }
  });

  // Review pagination
  document.getElementById('prev-review').addEventListener('click', function() {
    const pageInfo = document.getElementById('review-page-info').textContent;
    const currentPage = parseInt(pageInfo.split(' ')[1]);
    if (currentPage > 1) {
      // In a real app, we would load the previous page of reviews
      // For now, we'll just simulate it
      console.log('Loading previous page of reviews');
    }
  });

  document.getElementById('next-review').addEventListener('click', function() {
    const pageInfo = document.getElementById('review-page-info').textContent;
    const totalPages = parseInt(pageInfo.split(' ')[3]);
    const currentPage = parseInt(pageInfo.split(' ')[1]);
    if (currentPage < totalPages) {
      // In a real app, we would load the next page of reviews
      // For now, we'll just simulate it
      console.log('Loading next page of reviews');
    }
  });
}

// ===== Lecturer Profile Functions =====
function initLecturerProfile() {
  // Load lecturer data
  loadLecturerData();
  
  // Setup event listeners
  setupLecturerEventListeners();
  
  // Initialize dark mode if needed
  if (document.getElementById('dark-mode-toggle')) {
    initDarkMode();
  }
}

function loadLecturerData() {
  const lecturerData = {
    name: "Prof. Michael Chen",
    title: "Department of Computer Science",
    institution: "University of South Africa",
    bio: "Professor of Computer Science with 15 years of teaching experience. Specialized in Artificial Intelligence, Machine Learning, and Data Structures. My research focuses on neural networks and their applications in natural language processing.",
    stats: {
      courses: 14,
      materials: 237,
      students: 1842
    },
    rating: {
      stars: 4.3,
      reviews: 87
    },
    courses: [
      { code: "CS401", name: "Advanced Machine Learning" },
      { code: "CS305", name: "Data Structures and Algorithms" },
      { code: "CS410", name: "Natural Language Processing" }
    ],
    publications: [
      { title: "Neural Approaches to NLP", journal: "Journal of AI Research", year: 2022 },
      { title: "Deep Learning for Beginners", journal: "Computer Science Education", year: 2021 }
    ],
    materials: [
      { name: "Lecture 1: Intro to ML", type: "slides", course: "CS401", date: "2023-06-15" },
      { name: "Assignment 1 Guidelines", type: "document", course: "CS305", date: "2023-06-10" },
      { name: "Research Paper Samples", type: "pdf", course: "CS410", date: "2023-06-05" }
    ]
  };

  // Populate profile data
  document.getElementById('lecturer-name').textContent = lecturerData.name;
  document.querySelector('.lecturer-title').textContent = lecturerData.title;
  document.querySelector('.lecturer-institution').textContent = lecturerData.institution;
  document.getElementById('lecturer-bio').textContent = lecturerData.bio;
  document.getElementById('courses-taught').textContent = lecturerData.stats.courses;
  document.getElementById('materials-uploaded').textContent = lecturerData.stats.materials;
  document.getElementById('students-taught').textContent = lecturerData.stats.students;
  document.querySelector('.rating-value').textContent = `${lecturerData.rating.stars} (${lecturerData.rating.reviews} reviews)`;

  // Render stars
  const starsContainer = document.querySelector('.stars');
  starsContainer.innerHTML = '';
  const fullStars = Math.floor(lecturerData.rating.stars);
  const hasHalfStar = lecturerData.rating.stars % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsContainer.innerHTML += '★';
    } else if (i === fullStars && hasHalfStar) {
      starsContainer.innerHTML += '½';
    } else {
      starsContainer.innerHTML += '☆';
    }
  }

  // Render courses
  const coursesContainer = document.getElementById('courses-container');
  coursesContainer.innerHTML = '';
  lecturerData.courses.forEach(course => {
    const courseElement = document.createElement('div');
    courseElement.className = 'course-item';
    courseElement.innerHTML = `
      <div>
        <span class="course-code">${course.code}</span>
        <span class="course-name">${course.name}</span>
      </div>
    `;
    coursesContainer.appendChild(courseElement);
  });

  // Render publications
  const publicationsContainer = document.getElementById('publications-container');
  publicationsContainer.innerHTML = '';
  lecturerData.publications.forEach(pub => {
    const pubElement = document.createElement('div');
    pubElement.className = 'publication-item';
    pubElement.innerHTML = `
      <div class="publication-title">${pub.title}</div>
      <div class="publication-details">${pub.journal}, ${pub.year}</div>
    `;
    publicationsContainer.appendChild(pubElement);
  });

  // Render materials
  const materialsContainer = document.getElementById('materials-container');
  materialsContainer.innerHTML = '';
  lecturerData.materials.forEach(material => {
    const materialElement = document.createElement('div');
    materialElement.className = 'material-card';
    materialElement.innerHTML = `
      <div class="material-icon">${getMaterialIcon(material.type)}</div>
      <div class="material-name">${material.name}</div>
      <div class="material-course">${material.course}</div>
      <div class="material-date">${material.date}</div>
    `;
    materialsContainer.appendChild(materialElement);
  });
}

function getMaterialIcon(type) {
  const icons = {
    'slides': '📊',
    'document': '📄',
    'pdf': '📑',
    'video': '🎬',
    'audio': '🎧'
  };
  return icons[type] || '📂';
}

function setupLecturerEventListeners() {
  // Photo upload
  document.getElementById('change-lecturer-photo').addEventListener('click', () => {
    document.getElementById('lecturer-photo-upload').click();
  });

  document.getElementById('lecturer-photo-upload').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(event) {
        document.getElementById('lecturer-image').src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Bio editing
  document.getElementById('edit-bio-btn').addEventListener('click', function() {
    const bioEdit = document.getElementById('bio-edit');
    const lecturerBio = document.getElementById('lecturer-bio');
    
    if (bioEdit.classList.contains('hide')) {
      bioEdit.value = lecturerBio.textContent;
      lecturerBio.classList.add('hide');
      bioEdit.classList.remove('hide');
      this.textContent = 'Save Bio';
    } else {
      lecturerBio.textContent = bioEdit.value || lecturerBio.textContent;
      lecturerBio.classList.remove('hide');
      bioEdit.classList.add('hide');
      this.textContent = 'Edit Bio';
    }
  });

  // Course modal
  document.getElementById('add-course-btn').addEventListener('click', function() {
    document.getElementById('course-modal').classList.add('show');
  });

  document.querySelector('#course-modal .close-modal').addEventListener('click', function() {
    document.getElementById('course-modal').classList.remove('show');
  });

  document.getElementById('cancel-course').addEventListener('click', function() {
    document.getElementById('course-modal').classList.remove('show');
  });

  document.getElementById('save-course').addEventListener('click', function() {
    const code = document.getElementById('course-code').value.trim();
    const name = document.getElementById('course-name').value.trim();
    const semester = document.getElementById('course-semester').value;
    
    if (code && name) {
      const coursesContainer = document.getElementById('courses-container');
      const courseElement = document.createElement('div');
      courseElement.className = 'course-item';
      courseElement.innerHTML = `
        <div>
          <span class="course-code">${code}</span>
          <span class="course-name">${name}</span>
        </div>
      `;
      coursesContainer.appendChild(courseElement);
      
      document.getElementById('course-code').value = '';
      document.getElementById('course-name').value = '';
      document.getElementById('course-modal').classList.remove('show');
    }
  });
}

// Initialize the correct profile page
if (document.querySelector('.tutor-profile-container')) {
  initTutorProfile();
} else if (document.querySelector('.lecturer-profile-container')) {
  initLecturerProfile();
}
// ===== Achievements Page =====
function initAchievementsPage() {
  // Load achievements data
  loadAchievementsData();
  
  // Setup tab switching
  setupAchievementTabs();
  
  // Initialize dark mode if needed
  if (document.getElementById('dark-mode-toggle')) {
    initDarkMode();
  }
}

function loadAchievementsData() {
  const achievementsData = {
    level: 15,
    xp: 1250,
    nextLevelXp: 2000,
    badges: [
      { id: 1, name: "Fast Learner", icon: "🚀", date: "2023-06-15", description: "Completed 5 quizzes in one day" },
      { id: 2, name: "Book Worm", icon: "📚", date: "2023-06-10", description: "Studied for 10 hours in one week" },
      { id: 3, name: "Streak Starter", icon: "🔥", date: "2023-06-05", description: "3-day study streak" },
      { id: 4, name: "Quiz Master", icon: "🧠", date: "2023-05-28", description: "Scored 100% on 3 quizzes" },
      { id: 5, name: "Early Bird", icon: "🌅", date: "2023-05-20", description: "Studied before 8 AM for 5 days" },
      { id: 6, name: "Night Owl", icon: "🌙", date: "2023-05-15", description: "Studied after 10 PM for 5 days" }
    ],
    milestones: [
      { id: 1, name: "First Quiz", icon: "🥇", date: "2023-05-01", progress: 100 },
      { id: 2, name: "10 Study Hours", icon: "⏱️", date: "2023-05-10", progress: 100 },
      { id: 3, name: "50 Study Hours", icon: "⏳", date: "", progress: 65 },
      { id: 4, name: "Top 100 Leaderboard", icon: "🏆", date: "", progress: 42 }
    ],
    leaderboard: [
      { rank: 1, name: "Sarah Johnson", level: 42, xp: 12500, avatar: "leader1.jpg" },
      { rank: 2, name: "Michael Chen", level: 38, xp: 11800, avatar: "leader2.jpg" },
      { rank: 3, name: "Emma Williams", level: 35, xp: 11250, avatar: "leader3.jpg" },
      { rank: 4, name: "David Kim", level: 32, xp: 10500, avatar: "friend4.jpg" },
      { rank: 5, name: "Lisa Park", level: 30, xp: 9800, avatar: "friend5.jpg" }
    ]
  };

  // Populate level and XP
  document.getElementById('current-level').textContent = achievementsData.level;
  document.getElementById('current-xp').textContent = achievementsData.xp.toLocaleString();
  document.getElementById('next-level-xp').textContent = achievementsData.nextLevelXp.toLocaleString();
  
  // Set progress bar
  const progressPercentage = (achievementsData.xp / achievementsData.nextLevelXp) * 100;
  document.querySelector('.progress').style.width = `${progressPercentage}%`;
  
  // Load badges
  const badgesGrid = document.querySelector('.badges-grid');
  badgesGrid.innerHTML = '';
  achievementsData.badges.forEach(badge => {
    const badgeElement = document.createElement('div');
    badgeElement.className = 'badge-card';
    badgeElement.innerHTML = `
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-date">${badge.date}</div>
    `;
    badgesGrid.appendChild(badgeElement);
  });
  
  // Load milestones
  const milestonesList = document.querySelector('.milestones-list');
  milestonesList.innerHTML = '';
  achievementsData.milestones.forEach(milestone => {
    const milestoneElement = document.createElement('div');
    milestoneElement.className = 'milestone-item';
    milestoneElement.innerHTML = `
      <div class="milestone-icon">${milestone.icon}</div>
      <div class="milestone-info">
        <div class="milestone-name">${milestone.name}</div>
        ${milestone.date ? `<div class="milestone-date">${milestone.date}</div>` : ''}
      </div>
      ${!milestone.date ? `
      <div class="milestone-progress">
        <div class="progress-bar">
          <div class="progress" style="width: ${milestone.progress}%"></div>
        </div>
      </div>
      ` : ''}
    `;
    milestonesList.appendChild(milestoneElement);
  });
  
  // Load leaderboard
  const leaderboardTable = document.querySelector('.leaderboard-table tbody');
  leaderboardTable.innerHTML = '';
  achievementsData.leaderboard.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.rank}</td>
      <td>
        <div class="leaderboard-user">
          <img src="Images/${user.avatar}" alt="${user.name}" width="30" height="30">
          ${user.name}
        </div>
      </td>
      <td>${user.level}</td>
      <td>${user.xp.toLocaleString()}</td>
      <td>${Math.floor(user.level / 5)}</td>
      <td>${Math.floor(Math.random() * 30) + 1}</td>
    `;
    leaderboardTable.appendChild(row);
  });
}

function setupAchievementTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.dataset.tab + '-tab';
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// ===== Budd Page =====
function initBuddPage() {
  // Load initial conversation
  loadInitialConversation();
  
  // Setup event listeners
  setupBuddEventListeners();
  
  // Initialize dark mode if needed
  if (document.getElementById('dark-mode-toggle')) {
    initDarkMode();
  }
}

function loadInitialConversation() {
  const initialMessages = [
    {
      sender: 'budd',
      text: 'Hi there! I\'m Budd, your AI study companion. How can I help you today?',
      time: 'Just now'
    },
    {
      sender: 'budd',
      text: 'I can explain concepts, help solve problems, create study plans, and even quiz you on topics!',
      time: 'Just now'
    }
  ];
  
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  
  initialMessages.forEach(message => {
    addMessageToChat(message.sender, message.text, message.time);
  });
}

function addMessageToChat(sender, text, time) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${sender}`;
  
  messageDiv.innerHTML = `
    <div class="message-content">${text}</div>
    <div class="message-time">${time}</div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setupBuddEventListeners() {
  // Send message button
  document.getElementById('send-message').addEventListener('click', sendMessage);
  
  // Quick question buttons
  document.querySelectorAll('.quick-btn').forEach(button => {
    button.addEventListener('click', function() {
      const question = this.dataset.question;
      document.getElementById('user-message').value = question;
      sendMessage();
    });
  });
  
  // Tool buttons
  document.querySelectorAll('.tool-btn').forEach(button => {
    button.addEventListener('click', function() {
      const tool = this.dataset.tool;
      let message = '';
      
      switch(tool) {
        case 'flashcards':
          message = 'Can you generate flashcards for me about the topic we discussed?';
          break;
        case 'summary':
          message = 'Please create a summary of the key points from our conversation.';
          break;
        case 'quiz':
          message = 'I\'d like a practice quiz on this subject.';
          break;
        case 'plan':
          message = 'Can you create a study plan for me?';
          break;
      }
      
      addMessageToChat('user', message, 'Just now');
      
      // Simulate Budd's response
      setTimeout(() => {
        addMessageToChat('budd', `Sure! I'll prepare that ${tool.replace('-', ' ')} for you.`, 'Just now');
      }, 1000);
    });
  });
  
  // Document upload
  document.getElementById('document-upload').addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      addMessageToChat('user', `I uploaded a document: ${fileName}`, 'Just now');
      
      // Simulate Budd processing the document
      setTimeout(() => {
        addMessageToChat('budd', 'I\'ve processed your document. What would you like me to do with it?', 'Just now');
      }, 2000);
    }
  });
  
  // Clear history
  document.getElementById('clear-history').addEventListener('click', function() {
    document.getElementById('chat-messages').innerHTML = '';
    loadInitialConversation();
  });
}

function sendMessage() {
  const messageInput = document.getElementById('user-message');
  const messageText = messageInput.value.trim();
  
  if (messageText) {
    // Add user message to chat
    addMessageToChat('user', messageText, 'Just now');
    messageInput.value = '';
    
    // Simulate Budd typing
    setTimeout(() => {
      // Simple response logic - in a real app, this would call an AI API
      let response = "I'm not sure how to answer that. Can you provide more details?";
      
      if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) {
        response = "Hello again! How can I assist you with your studies today?";
      } else if (messageText.toLowerCase().includes('explain')) {
        response = "I'd be happy to explain that concept. Which specific part would you like me to focus on?";
      } else if (messageText.toLowerCase().includes('problem')) {
        response = "Let's work through that problem together. Can you share the details of what you're trying to solve?";
      } else if (messageText.toLowerCase().includes('plan')) {
        response = "I can create a study plan for you. What subject are you focusing on and when is your exam?";
      } else if (messageText.toLowerCase().includes('quiz')) {
        response = "Great! What topic would you like to be quizzed on?";
      }
      
      addMessageToChat('budd', response, 'Just now');
    }, 1000);
  }
}
// ===== Edit Profile Page =====
function initEditProfilePage() {
  // Load current profile data
  loadProfileData();
  
  // Setup event listeners
  setupProfileEventListeners();
  
  // Initialize dark mode if needed
  if (document.getElementById('dark-mode-toggle')) {
    initDarkMode();
  }
}

function loadProfileData() {
  // Sample profile data - in a real app, this would come from your backend
  const profileData = {
    username: "studyBuddy123",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Computer Science student | Passionate about learning new technologies",
    avatar: "profile-avatar.jpg",
    course: "Computer Science",
    university: "Stanford University",
    graduationYear: "2025",
    studyStreak: 7,
    studyHours: 42
  };

  // Populate form fields
  document.getElementById('username').value = profileData.username;
  document.getElementById('name').value = profileData.name;
  document.getElementById('email').value = profileData.email;
  document.getElementById('bio').value = profileData.bio;
  document.getElementById('course').value = profileData.course;
  document.getElementById('university').value = profileData.university;
  document.getElementById('graduation-year').value = profileData.graduationYear;
  
  // Set avatar preview
  document.getElementById('avatar-preview').src = `Images/${profileData.avatar}`;
  
  // Display stats
  document.getElementById('streak-count').textContent = profileData.studyStreak;
  document.getElementById('hours-count').textContent = profileData.studyHours;
}

function setupProfileEventListeners() {
  // Avatar upload
  document.getElementById('avatar-upload').addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = function(event) {
        document.getElementById('avatar-preview').src = event.target.result;
      };
      
      reader.readAsDataURL(file);
    }
  });
  
  // Save button
  document.getElementById('save-profile').addEventListener('click', function() {
    if (validateProfileForm()) {
      saveProfileData();
      showToast('Profile saved successfully!', 'success');
    }
  });
  
  // Reset button
  document.getElementById('reset-profile').addEventListener('click', function() {
    if (confirm('Are you sure you want to reset all changes?')) {
      loadProfileData();
      showToast('Changes discarded', 'info');
    }
  });
  
  // Delete account button
  document.getElementById('delete-account').addEventListener('click', function() {
    if (confirm('WARNING: This will permanently delete your account and all data. Continue?')) {
      // In a real app, this would call your backend API
      showToast('Account deletion requested', 'warning');
      setTimeout(() => {
        // Redirect to home page after deletion
        window.location.href = '/';
      }, 1500);
    }
  });
}

function validateProfileForm() {
  const email = document.getElementById('email').value;
  const graduationYear = document.getElementById('graduation-year').value;
  
  // Simple email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address', 'error');
    return false;
  }
  
  // Graduation year validation
  const currentYear = new Date().getFullYear();
  if (graduationYear && (graduationYear < currentYear || graduationYear > currentYear + 10)) {
    showToast('Please enter a valid graduation year', 'error');
    return false;
  }
  
  return true;
}

function saveProfileData() {
  // In a real app, this would send data to your backend
  const profileData = {
    username: document.getElementById('username').value,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    bio: document.getElementById('bio').value,
    course: document.getElementById('course').value,
    university: document.getElementById('university').value,
    graduationYear: document.getElementById('graduation-year').value,
    // Avatar would be handled via file upload in a real app
  };
  
  console.log('Profile data to save:', profileData);
  // Simulate API call
  // return fetch('/api/profile', { method: 'POST', body: JSON.stringify(profileData) });
}

function showToast(message, type) {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// ===== Dark Mode =====
function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');
  const currentMode = localStorage.getItem('darkMode') === 'true';
  
  // Set initial state
  if (currentMode) {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
  }
  
  // Toggle dark mode
  toggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', this.checked);
  });
}
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const toggleFormText = document.getElementById('toggle-form-text');
    const toggleFormLink = document.getElementById('toggle-form');
    const passwordInput = document.getElementById('signup-password');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    // Switch between login and signup tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            const tabId = this.dataset.tab;
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(`${tabId}-form`).classList.add('active');
            
            // Update toggle text
            updateToggleText(tabId);
        });
    });

    // Toggle between forms
    toggleFormLink.addEventListener('click', function(e) {
        e.preventDefault();
        const currentActive = document.querySelector('.tab-btn.active').dataset.tab;
        const newTab = currentActive === 'login' ? 'signup' : 'login';
        
        // Simulate click on the other tab button
        document.querySelector(`.tab-btn[data-tab="${newTab}"]`).click();
    });

    // Update the toggle form text
    function updateToggleText(activeTab) {
        if (activeTab === 'login') {
            toggleFormText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-form">Sign up</a>';
        } else {
            toggleFormText.innerHTML = 'Already have an account? <a href="#" id="toggle-form">Login</a>';
        }
    }

    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Check password length
        if (password.length >= 8) strength += 1;
        
        // Check for mixed case
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;
        
        // Check for numbers
        if (password.match(/([0-9])/)) strength += 1;
        
        // Check for special chars
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;
        
        // Update strength bars
        strengthBars.forEach((bar, index) => {
            bar.style.backgroundColor = index < strength ? getStrengthColor(strength) : '#eee';
        });
        
        // Update strength text
        const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
        strengthText.textContent = strengthLabels[strength - 1] || '';
        strengthText.style.color = getStrengthColor(strength);
    });

    function getStrengthColor(strength) {
        const colors = ['#ff4d4d', '#ffa64d', '#66cc66', '#2ecc71'];
        return colors[strength - 1] || '#ff4d4d';
    }

    // Form validation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        let isValid = true;
        
        // Email validation
        if (!validateEmail(email)) {
            document.getElementById('login-email-error').textContent = 'Please enter a valid email';
            isValid = false;
        } else {
            document.getElementById('login-email-error').textContent = '';
        }
        
        // Password validation
        if (password.length < 6) {
            document.getElementById('login-password-error').textContent = 'Password must be at least 6 characters';
            isValid = false;
        } else {
            document.getElementById('login-password-error').textContent = '';
        }
        
        if (isValid) {
            // Simulate login - in a real app, you would call your backend here
            alert('Login successful! Redirecting...');
            // window.location.href = 'dashboard.html';
        }
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        const termsAgree = document.getElementById('terms-agree').checked;
        let isValid = true;
        
        // Name validation
        if (name.trim().length < 2) {
            document.getElementById('signup-name-error').textContent = 'Please enter your full name';
            isValid = false;
        } else {
            document.getElementById('signup-name-error').textContent = '';
        }
        
        // Email validation
        if (!validateEmail(email)) {
            document.getElementById('signup-email-error').textContent = 'Please enter a valid email';
            isValid = false;
        } else {
            document.getElementById('signup-email-error').textContent = '';
        }
        
        // Password validation
        if (password.length < 8) {
            document.getElementById('signup-password-error').textContent = 'Password must be at least 8 characters';
            isValid = false;
        } else {
            document.getElementById('signup-password-error').textContent = '';
        }
        
        // Confirm password validation
        if (password !== confirmPassword) {
            document.getElementById('signup-confirm-error').textContent = 'Passwords do not match';
            isValid = false;
        } else {
            document.getElementById('signup-confirm-error').textContent = '';
        }
        
        // Terms agreement validation
        if (!termsAgree) {
            alert('Please agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate signup - in a real app, you would call your backend here
            alert('Account created successfully! Redirecting...');
            // window.location.href = 'dashboard.html';
        }
    });

    // Helper function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Forgot password handler
    document.getElementById('forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        const email = prompt('Please enter your email to reset your password:');
        if (email && validateEmail(email)) {
            alert(`Password reset link sent to ${email}`);
        } else if (email) {
            alert('Please enter a valid email address');
        }
    });
    
});
 

