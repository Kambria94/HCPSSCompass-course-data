const fs = require('fs');
const path = require('path');

/**
 * Extracts field values from a Swift Course object
 * @param {string} courseText - The full text of a Course object
 * @returns {Object} - The extracted course data
 */
function extractCourseData(courseText) {
    const course = {};
    
    // Match each field using specific patterns that capture the entire value
    const fieldPatterns = {
        courseNumber: /courseNumber:\s*"(.*?)"/,
        name: /name:\s*"(.*?)"/,
        isWeighted: /isWeighted:\s*(true|false)/,
        courseLevel: /courseLevel:\s*"(.*?)"/,
        credits: /credits:\s*([\d.]+)/,
        prerequisites: /prerequisites:\s*"(.*?)"/,
        gradeLevel: /gradeLevel:\s*"(.*?)"/
    };
    
    // Extract the simple fields
    for (const [field, pattern] of Object.entries(fieldPatterns)) {
        const match = courseText.match(pattern);
        if (match) {
            if (field === 'isWeighted') {
                course[field] = match[1] === 'true';
            } else if (field === 'credits') {
                course[field] = parseFloat(match[1]);
            } else {
                course[field] = match[1];
            }
        }
    }
    
    // Extract description separately as it can contain newlines and quotes
    const descriptionMatch = courseText.match(/description:\s*"([\s\S]*?)(?=",\s*prerequisites:|",\s*gradeLevel:|"\s*\))/);
    if (descriptionMatch) {
        course.description = descriptionMatch[1];
    }
    
    return course;
}

/**
 * Converts a Swift course file to JSON format
 * @param {string} swiftContent - The content of the Swift file
 * @returns {Object} - The JSON representation of the course data
 */
function convertSwiftToJSON(swiftContent) {
    // Extract category name
    const categoryMatch = swiftContent.match(/static let (\w+)\s*=\s*CourseCategory\(name:\s*"([^"]+)"/);
    if (!categoryMatch) return null;
    
    const result = {
        name: categoryMatch[1],
        courses: []
    };
    
    // Find all Course blocks in the content
    let courseBlocks = [];
    let regex = /Course\(\s*courseNumber[\s\S]*?\n\s*\)/g;
    let match;
    
    while ((match = regex.exec(swiftContent)) !== null) {
        courseBlocks.push(match[0]);
    }
    
    // Process each course block
    for (const block of courseBlocks) {
        const course = extractCourseData(block);
        if (Object.keys(course).length > 0) {
            result.courses.push(course);
        }
    }
    
    return result;
}

// Main script
const sourceDir = path.join(__dirname, '..', '..', 'HCPSSCatalog', 'Data', 'Categories');
const outputDir = path.join(__dirname, '..', 'data', 'courses');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Process each Swift file
const files = fs.readdirSync(sourceDir);
for (const file of files) {
    if (file.endsWith('Courses.swift')) {
        const categoryName = file.replace('Courses.swift', '');
        const swiftContent = fs.readFileSync(path.join(sourceDir, file), 'utf8');
        const jsonData = convertSwiftToJSON(swiftContent);
        
        if (jsonData && jsonData.courses.length > 0) {
            const outputPath = path.join(outputDir, `${categoryName.toLowerCase()}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
            console.log(`Converted ${categoryName.toLowerCase()} courses to JSON`);
        } else {
            console.log(`No valid courses found in ${categoryName.toLowerCase()}, skipping JSON output.`);
        }
    }
}

console.log('Script finished.'); 