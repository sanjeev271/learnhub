/**
 * Add content (sections and lessons) to existing courses.
 * Usage: node scripts/add-content-to-courses.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnhub';

const courseContentMap = {
  'Web Development Fundamentals': {
    sections: [
      {
        title: 'Getting Started',
        order: 0,
        lessons: [
          { title: 'Introduction to the Web', type: 'video', order: 0, duration: 10, content: '<p>Welcome to web development! In this lesson, you\'ll learn about how the web works, browsers, and the role of HTML, CSS, and JavaScript.</p><p>Key topics:</p><ul><li>How websites work</li><li>Client-server architecture</li><li>Introduction to HTML, CSS, and JavaScript</li></ul>' },
          { title: 'Setting Up Your Environment', type: 'reading', order: 1, duration: 5, content: '<p>Before we start coding, let\'s set up your development environment. You\'ll need:</p><ul><li>A code editor (VS Code recommended)</li><li>A modern web browser</li><li>Basic understanding of file systems</li></ul><p>Follow the step-by-step guide to install and configure everything.</p>' },
          { title: 'Your First HTML Page', type: 'video', order: 2, duration: 12, content: '<p>Create your very first HTML page! Learn the basic structure and essential tags.</p>' },
        ],
      },
      {
        title: 'HTML Basics',
        order: 1,
        lessons: [
          { title: 'HTML Structure and Elements', type: 'video', order: 0, duration: 15, content: '<p>Master the fundamental HTML structure. Learn about:</p><ul><li>DOCTYPE and html tag</li><li>Head and body sections</li><li>Common HTML elements</li><li>Semantic HTML5 tags</li></ul>' },
          { title: 'Forms and Inputs', type: 'video', order: 1, duration: 12, content: '<p>Build interactive forms with various input types. Learn form validation and best practices.</p>' },
          { title: 'HTML Assignment: Build a Profile Page', type: 'assignment', order: 2, duration: 20, content: '<p><strong>Assignment:</strong> Create a personal profile page using HTML. Include:</p><ul><li>Your name and photo</li><li>About section</li><li>Contact form</li><li>Links to social media</li></ul><p>Submit your HTML file for review.</p>' },
        ],
      },
      {
        title: 'CSS and Styling',
        order: 2,
        lessons: [
          { title: 'CSS Selectors and Box Model', type: 'video', order: 0, duration: 18, content: '<p>Learn how CSS works and how to style your HTML elements. Topics include:</p><ul><li>CSS selectors (class, ID, element)</li><li>Box model (margin, padding, border)</li><li>Colors and typography</li></ul>' },
          { title: 'Flexbox Layout', type: 'video', order: 1, duration: 20, content: '<p>Master Flexbox for creating flexible layouts. Learn flex-direction, justify-content, align-items, and more.</p>' },
          { title: 'CSS Grid', type: 'video', order: 2, duration: 22, content: '<p>Build complex layouts with CSS Grid. Learn grid-template-columns, grid-template-rows, and grid areas.</p>' },
          { title: 'Responsive Design', type: 'reading', order: 3, duration: 15, content: '<p>Make your websites work on all devices. Learn about:</p><ul><li>Media queries</li><li>Mobile-first design</li><li>Responsive images</li><li>Viewport meta tag</li></ul>' },
        ],
      },
      {
        title: 'JavaScript Basics',
        order: 3,
        lessons: [
          { title: 'JavaScript Introduction', type: 'video', order: 0, duration: 14, content: '<p>Get started with JavaScript! Learn variables, data types, and basic operations.</p>' },
          { title: 'Functions and Events', type: 'video', order: 1, duration: 16, content: '<p>Learn how to write functions and handle user events to make your pages interactive.</p>' },
          { title: 'DOM Manipulation', type: 'video', order: 2, duration: 18, content: '<p>Change page content dynamically using JavaScript. Select elements, modify content, and handle events.</p>' },
        ],
      },
      {
        title: 'Quiz: Test Your Knowledge',
        order: 4,
        lessons: [
          {
            title: 'HTML & CSS Quiz',
            type: 'quiz',
            order: 0,
            duration: 10,
            quizQuestions: [
              { question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High-Level Text Language', 'Home Tool Markup Language', 'Hyperlink Text Markup'], correctAnswer: 0 },
              { question: 'Which CSS property is used to change text color?', options: ['font-color', 'text-color', 'color', 'text-style'], correctAnswer: 2 },
              { question: 'What is the correct HTML tag for the largest heading?', options: ['<h6>', '<heading>', '<h1>', '<head>'], correctAnswer: 2 },
              { question: 'Which CSS property is used to make text bold?', options: ['font-weight', 'text-bold', 'bold', 'font-style'], correctAnswer: 0 },
              { question: 'What is the purpose of CSS?', options: ['To structure content', 'To style and layout web pages', 'To add interactivity', 'To store data'], correctAnswer: 1 },
            ],
          },
        ],
      },
    ],
  },
  'Advanced Web Development': {
    sections: [
      {
        title: 'Modern JavaScript',
        order: 0,
        lessons: [
          { title: 'ES6+ Features', type: 'video', order: 0, duration: 20, content: '<p>Arrow functions, destructuring, spread operator, template literals, and more modern JavaScript features.</p>' },
          { title: 'Async/Await and Promises', type: 'video', order: 1, duration: 18, content: '<p>Master asynchronous JavaScript with Promises and async/await syntax.</p>' },
          { title: 'Modules and Imports', type: 'reading', order: 2, duration: 12, content: '<p>Learn ES6 modules, import/export, and module bundlers.</p>' },
        ],
      },
      {
        title: 'React Framework',
        order: 1,
        lessons: [
          { title: 'React Components and JSX', type: 'video', order: 0, duration: 22, content: '<p>Build reusable components with React and JSX syntax.</p>' },
          { title: 'State Management', type: 'video', order: 1, duration: 25, content: '<p>Manage component state with useState and useEffect hooks.</p>' },
          { title: 'React Router', type: 'video', order: 2, duration: 20, content: '<p>Implement client-side routing in your React applications.</p>' },
          {
            title: 'React Quiz',
            type: 'quiz',
            order: 3,
            duration: 15,
            quizQuestions: [
              { question: 'What is JSX?', options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS framework', 'A database'], correctAnswer: 1 },
              { question: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correctAnswer: 1 },
            ],
          },
        ],
      },
      {
        title: 'Backend Development',
        order: 2,
        lessons: [
          { title: 'Node.js and Express', type: 'video', order: 0, duration: 24, content: '<p>Build RESTful APIs with Node.js and Express framework.</p>' },
          { title: 'Database Integration', type: 'video', order: 1, duration: 26, content: '<p>Connect to MongoDB and perform CRUD operations.</p>' },
          { title: 'Authentication & Security', type: 'reading', order: 2, duration: 20, content: '<p>Implement JWT authentication and secure your APIs.</p>' },
        ],
      },
      {
        title: 'Deployment',
        order: 3,
        lessons: [
          { title: 'Deploying to Production', type: 'video', order: 0, duration: 18, content: '<p>Deploy your full-stack application to cloud platforms.</p>' },
          { title: 'CI/CD Pipeline', type: 'reading', order: 1, duration: 15, content: '<p>Set up continuous integration and deployment workflows.</p>' },
        ],
      },
    ],
  },
  'React.js: Building Modern UIs': {
    sections: [
      {
        title: 'React Basics',
        order: 0,
        lessons: [
          { title: 'Introduction to React', type: 'video', order: 0, duration: 12, content: '<p>What is React? Learn about the library, its benefits, and when to use it.</p>' },
          { title: 'Components and JSX', type: 'video', order: 1, duration: 15, content: '<p>Create your first React components and understand JSX syntax.</p>' },
          { title: 'Props and State', type: 'video', order: 2, duration: 15, content: '<p>Pass data with props and manage component state.</p>' },
          { title: 'Event Handling', type: 'video', order: 3, duration: 12, content: '<p>Handle user interactions and events in React components.</p>' },
        ],
      },
      {
        title: 'React Hooks',
        order: 1,
        lessons: [
          { title: 'useState Hook', type: 'video', order: 0, duration: 18, content: '<p>Manage state in functional components with useState.</p>' },
          { title: 'useEffect Hook', type: 'video', order: 1, duration: 20, content: '<p>Perform side effects and lifecycle operations with useEffect.</p>' },
          { title: 'Custom Hooks', type: 'video', order: 2, duration: 14, content: '<p>Create reusable custom hooks for your application logic.</p>' },
          {
            title: 'React Hooks Quiz',
            type: 'quiz',
            order: 3,
            duration: 12,
            quizQuestions: [
              { question: 'What does useState return?', options: ['A state value', 'An array with state and setter', 'A function', 'An object'], correctAnswer: 1 },
              { question: 'When does useEffect run by default?', options: ['Only on mount', 'After every render', 'Only on unmount', 'Never'], correctAnswer: 1 },
            ],
          },
        ],
      },
      {
        title: 'Building Projects',
        order: 2,
        lessons: [
          { title: 'Todo App Project', type: 'assignment', order: 0, duration: 30, content: '<p><strong>Project:</strong> Build a todo app with React. Include add, delete, and toggle complete functionality.</p>' },
          { title: 'State Management Patterns', type: 'reading', order: 1, duration: 15, content: '<p>Learn best practices for managing state in larger applications.</p>' },
        ],
      },
    ],
  },
  'Node.js & Express Backend': {
    sections: [
      {
        title: 'Node.js Fundamentals',
        order: 0,
        lessons: [
          { title: 'Introduction to Node.js', type: 'video', order: 0, duration: 12, content: '<p>Learn what Node.js is and why it\'s powerful for backend development.</p>' },
          { title: 'NPM and Modules', type: 'reading', order: 1, duration: 10, content: '<p>Understand npm, package.json, and how to use Node modules.</p>' },
        ],
      },
      {
        title: 'Express Framework',
        order: 1,
        lessons: [
          { title: 'Setting Up Express', type: 'video', order: 0, duration: 10, content: '<p>Create your first Express server and understand the basics.</p>' },
          { title: 'Routes and Middleware', type: 'video', order: 1, duration: 16, content: '<p>Define routes and use middleware to handle requests.</p>' },
          { title: 'Request and Response', type: 'video', order: 2, duration: 14, content: '<p>Handle HTTP requests and send responses in Express.</p>' },
          { title: 'Error Handling', type: 'reading', order: 3, duration: 12, content: '<p>Implement proper error handling in your Express applications.</p>' },
        ],
      },
      {
        title: 'RESTful APIs',
        order: 2,
        lessons: [
          { title: 'Building REST APIs', type: 'video', order: 0, duration: 20, content: '<p>Design and implement RESTful API endpoints following best practices.</p>' },
          { title: 'API Testing', type: 'assignment', order: 1, duration: 15, content: '<p><strong>Assignment:</strong> Test your API endpoints using Postman or curl.</p>' },
        ],
      },
    ],
  },
  'Python for Beginners': {
    sections: [
      {
        title: 'Getting Started',
        order: 0,
        lessons: [
          { title: 'Installation and Setup', type: 'video', order: 0, duration: 8, content: '<p>Install Python and set up your development environment.</p>' },
          { title: 'Hello World', type: 'video', order: 1, duration: 6, content: '<p>Write and run your first Python program!</p>' },
          { title: 'Python Syntax Basics', type: 'reading', order: 2, duration: 10, content: '<p>Learn about indentation, comments, and Python\'s syntax rules.</p>' },
        ],
      },
      {
        title: 'Variables and Data Types',
        order: 1,
        lessons: [
          { title: 'Variables and Types', type: 'video', order: 0, duration: 12, content: '<p>Learn about strings, numbers, booleans, and how to use variables.</p>' },
          { title: 'Working with Strings', type: 'video', order: 1, duration: 14, content: '<p>String methods, formatting, and manipulation techniques.</p>' },
          { title: 'Numbers and Math', type: 'video', order: 2, duration: 10, content: '<p>Perform calculations and work with different number types.</p>' },
        ],
      },
      {
        title: 'Control Flow',
        order: 2,
        lessons: [
          { title: 'Conditionals (if/else)', type: 'video', order: 0, duration: 15, content: '<p>Make decisions in your code with if, elif, and else statements.</p>' },
          { title: 'Loops (for and while)', type: 'video', order: 1, duration: 18, content: '<p>Repeat code efficiently with for and while loops.</p>' },
          {
            title: 'Python Basics Quiz',
            type: 'quiz',
            order: 2,
            duration: 10,
            quizQuestions: [
              { question: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'func', 'define'], correctAnswer: 1 },
              { question: 'What is the output of: print(2 ** 3)?', options: ['6', '8', '9', '5'], correctAnswer: 1 },
              { question: 'Which data type is mutable in Python?', options: ['tuple', 'string', 'list', 'int'], correctAnswer: 2 },
            ],
          },
        ],
      },
      {
        title: 'Functions and Modules',
        order: 3,
        lessons: [
          { title: 'Defining Functions', type: 'video', order: 0, duration: 16, content: '<p>Create reusable code blocks with functions.</p>' },
          { title: 'Function Parameters', type: 'video', order: 1, duration: 14, content: '<p>Pass arguments to functions and use default parameters.</p>' },
          { title: 'Working with Modules', type: 'reading', order: 2, duration: 12, content: '<p>Import and use Python modules and packages.</p>' },
        ],
      },
    ],
  },
  'Data Science with Python': {
    sections: [
      {
        title: 'Python for Data Science',
        order: 0,
        lessons: [
          { title: 'NumPy Basics', type: 'video', order: 0, duration: 18, content: '<p>Introduction to NumPy arrays and numerical computing.</p>' },
          { title: 'NumPy Operations', type: 'video', order: 1, duration: 16, content: '<p>Perform mathematical operations on arrays efficiently.</p>' },
        ],
      },
      {
        title: 'Data Wrangling',
        order: 1,
        lessons: [
          { title: 'Pandas Introduction', type: 'video', order: 0, duration: 20, content: '<p>Learn about DataFrames and Series in Pandas.</p>' },
          { title: 'Reading and Writing Data', type: 'video', order: 1, duration: 15, content: '<p>Load data from CSV, Excel, and other formats.</p>' },
          { title: 'Cleaning Data', type: 'video', order: 2, duration: 18, content: '<p>Handle missing values, duplicates, and data inconsistencies.</p>' },
          { title: 'Data Transformation', type: 'reading', order: 3, duration: 16, content: '<p>Filter, group, and transform your datasets.</p>' },
        ],
      },
      {
        title: 'Data Visualization',
        order: 2,
        lessons: [
          { title: 'Matplotlib Basics', type: 'video', order: 0, duration: 17, content: '<p>Create charts and plots to visualize your data.</p>' },
          { title: 'Seaborn Advanced', type: 'video', order: 1, duration: 19, content: '<p>Build beautiful statistical visualizations with Seaborn.</p>' },
        ],
      },
      {
        title: 'Machine Learning Basics',
        order: 3,
        lessons: [
          { title: 'Introduction to ML', type: 'reading', order: 0, duration: 14, content: '<p>Understand supervised vs unsupervised learning.</p>' },
          { title: 'Linear Regression', type: 'video', order: 1, duration: 22, content: '<p>Build your first machine learning model.</p>' },
          {
            title: 'Data Science Quiz',
            type: 'quiz',
            order: 2,
            duration: 12,
            quizQuestions: [
              { question: 'What is a DataFrame?', options: ['A Python list', 'A 2D data structure in Pandas', 'A NumPy array', 'A dictionary'], correctAnswer: 1 },
              { question: 'Which library is used for numerical computing?', options: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'], correctAnswer: 1 },
            ],
          },
        ],
      },
    ],
  },
  'UI/UX Design Fundamentals': {
    sections: [
      {
        title: 'Introduction to UX',
        order: 0,
        lessons: [
          { title: 'What is UX?', type: 'video', order: 0, duration: 10, content: '<p>Understand user experience design and why it matters.</p>' },
          { title: 'UX vs UI', type: 'reading', order: 1, duration: 8, content: '<p>Learn the difference between UX and UI design.</p>' },
          { title: 'User-Centered Design', type: 'video', order: 2, duration: 12, content: '<p>Put users at the center of your design process.</p>' },
        ],
      },
      {
        title: 'Design Process',
        order: 1,
        lessons: [
          { title: 'User Research', type: 'video', order: 0, duration: 16, content: '<p>Conduct user interviews and surveys to understand needs.</p>' },
          { title: 'Personas and User Stories', type: 'reading', order: 1, duration: 12, content: '<p>Create user personas and write effective user stories.</p>' },
          { title: 'Wireframes and Prototypes', type: 'video', order: 2, duration: 14, content: '<p>Sketch wireframes and build interactive prototypes.</p>' },
        ],
      },
      {
        title: 'Design Principles',
        order: 2,
        lessons: [
          { title: 'Visual Hierarchy', type: 'video', order: 0, duration: 13, content: '<p>Guide users\' attention with proper visual hierarchy.</p>' },
          { title: 'Color Theory', type: 'video', order: 1, duration: 15, content: '<p>Choose colors that enhance usability and convey meaning.</p>' },
          { title: 'Typography', type: 'reading', order: 2, duration: 11, content: '<p>Select fonts and use typography effectively.</p>' },
          {
            title: 'Design Quiz',
            type: 'quiz',
            order: 3,
            duration: 10,
            quizQuestions: [
              { question: 'What does UX stand for?', options: ['User Experience', 'User eXchange', 'Universal eXpression', 'User eXecution'], correctAnswer: 0 },
              { question: 'What is a wireframe?', options: ['A final design', 'A low-fidelity layout sketch', 'A color palette', 'A font choice'], correctAnswer: 1 },
            ],
          },
        ],
      },
      {
        title: 'Design Assignment',
        order: 3,
        lessons: [
          { title: 'Redesign a Landing Page', type: 'assignment', order: 0, duration: 25, content: '<p><strong>Assignment:</strong> Redesign an existing landing page applying UX principles learned in this course.</p>' },
        ],
      },
    ],
  },
  'SQL and Databases': {
    sections: [
      {
        title: 'Database Fundamentals',
        order: 0,
        lessons: [
          { title: 'Introduction to Databases', type: 'video', order: 0, duration: 10, content: '<p>Learn what databases are and why we use them.</p>' },
          { title: 'Relational Database Concepts', type: 'reading', order: 1, duration: 12, content: '<p>Understand tables, rows, columns, and relationships.</p>' },
        ],
      },
      {
        title: 'SQL Basics',
        order: 1,
        lessons: [
          { title: 'SELECT Queries', type: 'video', order: 0, duration: 12, content: '<p>Retrieve data from tables using SELECT statements.</p>' },
          { title: 'WHERE Clause', type: 'video', order: 1, duration: 14, content: '<p>Filter data with WHERE conditions.</p>' },
          { title: 'ORDER BY and LIMIT', type: 'video', order: 2, duration: 10, content: '<p>Sort results and limit the number of rows returned.</p>' },
        ],
      },
      {
        title: 'Advanced Queries',
        order: 2,
        lessons: [
          { title: 'JOINs', type: 'video', order: 0, duration: 16, content: '<p>Combine data from multiple tables with INNER JOIN, LEFT JOIN, etc.</p>' },
          { title: 'Aggregate Functions', type: 'video', order: 1, duration: 14, content: '<p>Use COUNT, SUM, AVG, and GROUP BY for data analysis.</p>' },
          { title: 'Subqueries', type: 'reading', order: 2, duration: 13, content: '<p>Write nested queries for complex data retrieval.</p>' },
        ],
      },
      {
        title: 'Database Design',
        order: 3,
        lessons: [
          { title: 'Creating Tables', type: 'video', order: 0, duration: 15, content: '<p>Design and create database tables with proper data types.</p>' },
          { title: 'Primary and Foreign Keys', type: 'video', order: 1, duration: 12, content: '<p>Establish relationships between tables.</p>' },
          {
            title: 'SQL Quiz',
            type: 'quiz',
            order: 2,
            duration: 12,
            quizQuestions: [
              { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Sequential Query Language'], correctAnswer: 0 },
              { question: 'Which JOIN returns all rows from the left table?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'], correctAnswer: 1 },
              { question: 'What is a primary key?', options: ['A foreign key', 'A unique identifier for a row', 'A column name', 'A table name'], correctAnswer: 1 },
            ],
          },
        ],
      },
    ],
  },
  'Git & GitHub Essentials': {
    sections: [
      {
        title: 'Git Basics',
        order: 0,
        lessons: [
          { title: 'What is Version Control?', type: 'reading', order: 0, duration: 8, content: '<p>Understand why version control is essential for development.</p>' },
          { title: 'Installation and Setup', type: 'video', order: 1, duration: 6, content: '<p>Install Git and configure it on your system.</p>' },
          { title: 'First Commit', type: 'video', order: 2, duration: 8, content: '<p>Initialize a repository and make your first commit.</p>' },
          { title: 'Understanding the Staging Area', type: 'video', order: 3, duration: 10, content: '<p>Learn about git add, commit, and the three states of files.</p>' },
        ],
      },
      {
        title: 'Branching and Merging',
        order: 1,
        lessons: [
          { title: 'Creating Branches', type: 'video', order: 0, duration: 12, content: '<p>Create and switch between branches to work on features.</p>' },
          { title: 'Merging Branches', type: 'video', order: 1, duration: 14, content: '<p>Combine changes from different branches.</p>' },
          { title: 'Resolving Conflicts', type: 'reading', order: 2, duration: 11, content: '<p>Handle merge conflicts when they occur.</p>' },
        ],
      },
      {
        title: 'GitHub Collaboration',
        order: 2,
        lessons: [
          { title: 'GitHub Basics', type: 'video', order: 0, duration: 10, content: '<p>Create a GitHub account and set up repositories.</p>' },
          { title: 'Push and Pull', type: 'video', order: 1, duration: 12, content: '<p>Sync your local repository with GitHub.</p>' },
          { title: 'Pull Requests', type: 'video', order: 2, duration: 15, content: '<p>Collaborate using pull requests and code reviews.</p>' },
          {
            title: 'Git Quiz',
            type: 'quiz',
            order: 3,
            duration: 10,
            quizQuestions: [
              { question: 'What command stages files for commit?', options: ['git commit', 'git add', 'git push', 'git pull'], correctAnswer: 1 },
              { question: 'What is a branch in Git?', options: ['A folder', 'A separate line of development', 'A file', 'A commit'], correctAnswer: 1 },
            ],
          },
        ],
      },
    ],
  },
  'JavaScript Deep Dive': {
    sections: [
      {
        title: 'Advanced Concepts',
        order: 0,
        lessons: [
          { title: 'Closures and Scope', type: 'video', order: 0, duration: 15, content: '<p>Understand lexical scoping and how closures work in JavaScript.</p>' },
          { title: 'this Keyword', type: 'video', order: 1, duration: 14, content: '<p>Master the "this" keyword and its binding rules.</p>' },
          { title: 'Prototypes and Inheritance', type: 'reading', order: 2, duration: 16, content: '<p>Learn JavaScript\'s prototype-based inheritance model.</p>' },
        ],
      },
      {
        title: 'Asynchronous JavaScript',
        order: 1,
        lessons: [
          { title: 'Callbacks', type: 'video', order: 0, duration: 12, content: '<p>Handle asynchronous operations with callbacks.</p>' },
          { title: 'Promises', type: 'video', order: 1, duration: 16, content: '<p>Work with Promises for better async code.</p>' },
          { title: 'Async/Await', type: 'video', order: 2, duration: 18, content: '<p>Write clean asynchronous code with async/await syntax.</p>' },
        ],
      },
      {
        title: 'Modern JavaScript',
        order: 2,
        lessons: [
          { title: 'ES6+ Features', type: 'video', order: 0, duration: 20, content: '<p>Arrow functions, destructuring, spread operator, and more.</p>' },
          { title: 'Modules and Imports', type: 'reading', order: 1, duration: 12, content: '<p>Use ES6 modules for better code organization.</p>' },
          {
            title: 'JavaScript Advanced Quiz',
            type: 'quiz',
            order: 2,
            duration: 15,
            quizQuestions: [
              { question: 'What is a closure?', options: ['A function', 'A function with access to outer scope', 'A variable', 'A loop'], correctAnswer: 1 },
              { question: 'What does async/await return?', options: ['A callback', 'A Promise', 'A value', 'An error'], correctAnswer: 1 },
              { question: 'What is the purpose of a Promise?', options: ['To store data', 'To handle asynchronous operations', 'To create loops', 'To define variables'], correctAnswer: 1 },
            ],
          },
        ],
      },
      {
        title: 'Best Practices',
        order: 3,
        lessons: [
          { title: 'Code Organization', type: 'reading', order: 0, duration: 14, content: '<p>Structure your JavaScript code for maintainability.</p>' },
          { title: 'Error Handling', type: 'video', order: 1, duration: 13, content: '<p>Implement proper error handling in your applications.</p>' },
        ],
      },
    ],
  },
};

async function addContentToCourses() {
  await mongoose.connect(MONGODB_URI);
  let updated = 0;
  
  for (const [title, content] of Object.entries(courseContentMap)) {
    // Match by exact title or case-insensitive so existing DB courses are found
    const course = await Course.findOne({
      $or: [
        { title },
        { title: new RegExp('^' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
      ],
    });
    if (course) {
      const oldLessonCount = course.sections ? course.sections.reduce((acc, s) => acc + (s.lessons ? s.lessons.length : 0), 0) : 0;
      course.sections = content.sections;
      await course.save();
      const newLessonCount = content.sections.reduce((acc, s) => acc + s.lessons.length, 0);
      updated++;
      console.log(`✓ Updated: ${title} (${oldLessonCount} → ${newLessonCount} lessons)`);
    } else {
      console.log(`✗ Not found: ${title}`);
    }
  }
  
  console.log(`\nDone. Updated ${updated} course(s) with content.`);
  process.exit(0);
}

addContentToCourses().catch((err) => {
  console.error(err);
  process.exit(1);
});
