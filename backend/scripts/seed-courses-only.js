/**
 * Add sample courses only. Run this if you already have users and want to add more courses.
 * Usage: node scripts/seed-courses-only.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnhub';

const courseData = [
  { title: 'Web Development Fundamentals', shortDescription: 'A complete introduction to web development for beginners.', description: 'Learn HTML, CSS, and JavaScript from scratch. Build responsive websites and understand the basics of front-end development.', category: 'Web Development', difficulty: 'beginner', isFree: true, price: 0, sections: [{ title: 'Getting Started', order: 0, lessons: [{ title: 'Introduction to the Web', type: 'video', order: 0, duration: 10 }, { title: 'Setting Up Your Environment', type: 'reading', order: 1, duration: 5 }] }, { title: 'HTML Basics', order: 1, lessons: [{ title: 'HTML Structure', type: 'video', order: 0, duration: 15 }, { title: 'Forms and Inputs', type: 'video', order: 1, duration: 12 }] }, { title: 'CSS and Styling', order: 2, lessons: [{ title: 'CSS Selectors and Box Model', type: 'video', order: 0, duration: 18 }, { title: 'Flexbox and Grid', type: 'video', order: 1, duration: 20 }] }] },
  { title: 'Advanced Web Development', shortDescription: 'For developers ready to build production applications.', description: 'Deep dive into modern frameworks, APIs, and deployment.', category: 'Web Development', difficulty: 'advanced', isFree: false, price: 999, sections: [{ title: 'Module 1', order: 0, lessons: [{ title: 'Introduction to Advanced Topics', type: 'video', order: 0, duration: 15 }] }] },
  { title: 'React.js: Building Modern UIs', shortDescription: 'Build fast, interactive user interfaces with React.', description: 'Master React from basics to hooks, state management, and real-world projects.', category: 'Web Development', difficulty: 'intermediate', isFree: true, price: 0, sections: [{ title: 'React Basics', order: 0, lessons: [{ title: 'Components and JSX', type: 'video', order: 0, duration: 12 }, { title: 'Props and State', type: 'video', order: 1, duration: 15 }] }, { title: 'Hooks', order: 1, lessons: [{ title: 'useState and useEffect', type: 'video', order: 0, duration: 18 }, { title: 'Custom Hooks', type: 'video', order: 1, duration: 14 }] }] },
  { title: 'Node.js & Express Backend', shortDescription: 'Server-side JavaScript and REST APIs.', description: 'Build scalable REST APIs with Node.js and Express. Authentication, databases, and deployment.', category: 'Web Development', difficulty: 'intermediate', isFree: true, price: 0, sections: [{ title: 'Express Basics', order: 0, lessons: [{ title: 'Setting Up Express', type: 'video', order: 0, duration: 10 }, { title: 'Routes and Middleware', type: 'video', order: 1, duration: 16 }] }] },
  { title: 'Python for Beginners', shortDescription: 'Your first steps in Python programming.', description: 'Learn Python from zero: variables, loops, functions, and your first scripts.', category: 'Programming', difficulty: 'beginner', isFree: true, price: 0, sections: [{ title: 'Basics', order: 0, lessons: [{ title: 'Installation and Hello World', type: 'video', order: 0, duration: 8 }, { title: 'Variables and Types', type: 'video', order: 1, duration: 12 }] }, { title: 'Control Flow', order: 1, lessons: [{ title: 'Conditionals and Loops', type: 'video', order: 0, duration: 15 }] }] },
  { title: 'Data Science with Python', shortDescription: 'Analyze data and build simple ML models.', description: 'Pandas, NumPy, and basic machine learning with Python.', category: 'Data Science', difficulty: 'intermediate', isFree: false, price: 799, sections: [{ title: 'Data Wrangling', order: 0, lessons: [{ title: 'Pandas Introduction', type: 'video', order: 0, duration: 20 }, { title: 'Cleaning Data', type: 'video', order: 1, duration: 18 }] }] },
  { title: 'UI/UX Design Fundamentals', shortDescription: 'Design interfaces users love.', description: 'User research, wireframing, and design principles for better products.', category: 'Design', difficulty: 'beginner', isFree: true, price: 0, sections: [{ title: 'Principles', order: 0, lessons: [{ title: 'What is UX?', type: 'video', order: 0, duration: 10 }, { title: 'Wireframes and Prototypes', type: 'video', order: 1, duration: 14 }] }] },
  { title: 'SQL and Databases', shortDescription: 'Master SQL and database basics.', description: 'Write queries, design schemas, and work with relational databases.', category: 'Programming', difficulty: 'beginner', isFree: true, price: 0, sections: [{ title: 'SQL Basics', order: 0, lessons: [{ title: 'SELECT and WHERE', type: 'video', order: 0, duration: 12 }, { title: 'JOINs', type: 'video', order: 1, duration: 16 }] }] },
  { title: 'Git & GitHub Essentials', shortDescription: 'Version control and collaboration.', description: 'Version control for your projects. Commit, branch, merge, and collaborate.', category: 'Programming', difficulty: 'beginner', isFree: true, price: 0, sections: [{ title: 'Git Basics', order: 0, lessons: [{ title: 'Installation and First Commit', type: 'video', order: 0, duration: 8 }, { title: 'Branching and Merging', type: 'video', order: 1, duration: 14 }] }] },
  { title: 'JavaScript Deep Dive', shortDescription: 'Level up your JavaScript skills.', description: 'Closures, async/await, and modern JavaScript patterns.', category: 'Web Development', difficulty: 'intermediate', isFree: true, price: 0, sections: [{ title: 'Core Concepts', order: 0, lessons: [{ title: 'Closures and Scope', type: 'video', order: 0, duration: 15 }, { title: 'Promises and Async', type: 'video', order: 1, duration: 18 }] }] },
];

async function seedCourses() {
  await mongoose.connect(MONGODB_URI);
  let teacher = await User.findOne({ role: 'teacher' });
  if (!teacher) {
    teacher = await User.findOne({ role: 'admin' });
  }
  if (!teacher) {
    teacher = await User.create({ name: 'Instructor', email: 'instructor@learnhub.com', password: 'instructor123', role: 'teacher' });
    console.log('Created instructor: instructor@learnhub.com / instructor123');
  }
  let added = 0;
  for (let i = 0; i < courseData.length; i++) {
    const c = courseData[i];
    const exists = await Course.findOne({ title: c.title });
    if (exists) continue;
    const slug = c.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now() + '-' + i;
    await Course.create({ ...c, slug, instructor: teacher._id, isPublished: true });
    added++;
    console.log('Added:', c.title);
  }
  console.log('Done. Added', added, 'courses.');
  process.exit(0);
}

seedCourses().catch((err) => {
  console.error(err);
  process.exit(1);
});
