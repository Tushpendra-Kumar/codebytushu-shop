// src/js/courses-shop.js

// Cart logic ko import karo, courses ko bhi cart mein add kar sakte hain
import { addToCart } from './cart.js'; 

const coursesListContainer = document.getElementById('courses-list');

let allCourses = []; 

// Function: Single Course Card ka HTML banana
function createCourseCard(course) {
    // Courses mein size nahi hoga, isliye sirf basic info dikhao
    
    return `
        <div class="course-card" data-type="${course.type}">
            <h3>${course.name}</h3>
            <p>${course.description}</p>
            
            <div class="course-details">
                <span>Type: ${course.type}</span>
                <span>Level: ${course.level}</span>
                <span>Duration: ${course.duration}</span>
            </div>

            <p class="course-price">$${course.price.toFixed(2)}</p>
            
            <button class="btn-primary" 
                onclick="event.preventDefault(); handleCourseAddToCart(${course.id});">
                Enroll Now / Add to Cart
            </button>
        </div>
    `;
}

// Function: Courses ko Grid mein Render karna
function renderCourses(coursesToRender) {
    coursesListContainer.innerHTML = '';
    
    if (coursesToRender.length === 0) {
        coursesListContainer.innerHTML = '<p class="no-results">Sorry, no courses are available right now.</p>';
        return;
    }

    coursesToRender.forEach(course => {
        coursesListContainer.innerHTML += createCourseCard(course);
    });
}

// Function: API se data fetch karna
async function fetchCourses() {
    try {
        // Courses ka naya API endpoint use karo: /api/courses
        const response = await fetch('/api/courses');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        allCourses = data; // Courses ko filter ki zarurat nahi, sab dikhao
        
        renderCourses(allCourses); 

    } catch (error) {
        console.error("Error fetching courses data:", error);
        coursesListContainer.innerHTML = '<h3 class="error-message">Could not load courses. Please check server connection.</h3>';
    }
}

// Cart Functionality for Courses
window.handleCourseAddToCart = (courseId) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
        // Courses ke liye size 'N/A' bhej do
        addToCart(course, 1, 'N/A'); 
    }
};

// Initialization: Page load hote hi courses fetch karna
fetchCourses();