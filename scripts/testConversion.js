const fs = require('fs');
const path = require('path');

/**
 * Extract courses from a Swift file for comparison
 * @param {string} swiftContent - The content of the Swift file
 * @returns {Array} Array of course objects parsed from Swift
 */
function extractSwiftCourses(swiftContent) {
  const courses = [];
  
  // Find all Course blocks in the content
  let regex = /Course\(\s*courseNumber[\s\S]*?\n\s*\)/g;
  let match;
  
  while ((match = regex.exec(swiftContent)) !== null) {
    const courseText = match[0];
    const course = {};
    
    // Extract each field
    const fields = {
      courseNumber: /courseNumber:\s*"(.*?)"/,
      name: /name:\s*"(.*?)"/,
      isWeighted: /isWeighted:\s*(true|false)/,
      courseLevel: /courseLevel:\s*"(.*?)"/,
      credits: /credits:\s*([\d.]+)/,
      prerequisites: /prerequisites:\s*"(.*?)"/,
      gradeLevel: /gradeLevel:\s*"(.*?)"/
    };
    
    for (const [field, pattern] of Object.entries(fields)) {
      const fieldMatch = courseText.match(pattern);
      if (fieldMatch) {
        if (field === 'isWeighted') {
          course[field] = fieldMatch[1] === 'true';
        } else if (field === 'credits') {
          course[field] = parseFloat(fieldMatch[1]);
        } else {
          course[field] = fieldMatch[1];
        }
      }
    }
    
    // Extract description separately
    const descriptionMatch = courseText.match(/description:\s*"([\s\S]*?)(?=",\s*prerequisites:|",\s*gradeLevel:|"\s*\))/);
    if (descriptionMatch) {
      course.description = descriptionMatch[1];
    }
    
    if (Object.keys(course).length > 0) {
      courses.push(course);
    }
  }
  
  return courses;
}

/**
 * Compare courses from Swift and JSON sources
 * @param {Array} swiftCourses - Courses extracted from Swift
 * @param {Array} jsonCourses - Courses from JSON file
 * @returns {Object} Test results with any discrepancies
 */
function compareCourses(swiftCourses, jsonCourses) {
  const results = {
    totalSwiftCourses: swiftCourses.length,
    totalJsonCourses: jsonCourses.length,
    missingInJson: [],
    missingFields: [],
    differentValues: []
  };
  
  // Check for missing courses
  if (swiftCourses.length !== jsonCourses.length) {
    console.log(`⚠️ Count mismatch: ${swiftCourses.length} courses in Swift, ${jsonCourses.length} in JSON`);
  }
  
  // Check each Swift course
  for (const swiftCourse of swiftCourses) {
    const jsonCourse = jsonCourses.find(c => c.courseNumber === swiftCourse.courseNumber);
    
    if (!jsonCourse) {
      results.missingInJson.push(swiftCourse.courseNumber);
      continue;
    }
    
    // Compare each field
    for (const field of Object.keys(swiftCourse)) {
      if (!(field in jsonCourse)) {
        results.missingFields.push({ courseNumber: swiftCourse.courseNumber, field });
        continue;
      }
      
      // Normalize values for comparison
      let swiftValue = swiftCourse[field];
      let jsonValue = jsonCourse[field];
      
      // For descriptions, normalize whitespace
      if (field === 'description') {
        swiftValue = swiftValue.replace(/\s+/g, ' ').trim();
        jsonValue = jsonValue.replace(/\s+/g, ' ').trim();
      }
      
      if (JSON.stringify(swiftValue) !== JSON.stringify(jsonValue)) {
        results.differentValues.push({
          courseNumber: swiftCourse.courseNumber,
          field,
          swiftValue,
          jsonValue
        });
      }
    }
  }
  
  return results;
}

/**
 * Format the test results for output
 * @param {Object} results - The test results
 * @param {string} categoryName - The name of the course category
 * @returns {string} Formatted results
 */
function formatResults(results, categoryName) {
  let output = `\n📋 Test Results for ${categoryName}:\n`;
  output += `Total courses: ${results.totalSwiftCourses} in Swift, ${results.totalJsonCourses} in JSON\n`;
  
  if (results.missingInJson.length === 0 && 
      results.missingFields.length === 0 && 
      results.differentValues.length === 0) {
    output += `✅ All courses validated successfully!\n`;
    return output;
  }
  
  if (results.missingInJson.length > 0) {
    output += `\n❌ Courses missing in JSON: ${results.missingInJson.length}\n`;
    results.missingInJson.forEach(course => {
      output += `  - ${course}\n`;
    });
  }
  
  if (results.missingFields.length > 0) {
    output += `\n❌ Missing fields: ${results.missingFields.length}\n`;
    results.missingFields.forEach(item => {
      output += `  - Course ${item.courseNumber}: missing field '${item.field}'\n`;
    });
  }
  
  if (results.differentValues.length > 0) {
    output += `\n❌ Value mismatches: ${results.differentValues.length}\n`;
    results.differentValues.forEach(item => {
      output += `  - Course ${item.courseNumber}, field '${item.field}':\n`;
      output += `    Swift: ${JSON.stringify(item.swiftValue)}\n`;
      output += `    JSON:  ${JSON.stringify(item.jsonValue)}\n`;
    });
  }
  
  return output;
}

// Main test script
const sourceDir = path.join(__dirname, '..', '..', 'HCPSSCatalog', 'Data', 'Categories');
const jsonDir = path.join(__dirname, '..', 'data', 'courses');

// Keep track of overall test results
let totalCategories = 0;
let successfulCategories = 0;

// Process each Swift file
const files = fs.readdirSync(sourceDir);
for (const file of files) {
  if (file.endsWith('Courses.swift')) {
    const categoryName = file.replace('Courses.swift', '');
    const jsonPath = path.join(jsonDir, `${categoryName.toLowerCase()}.json`);
    
    // Skip if JSON file doesn't exist
    if (!fs.existsSync(jsonPath)) {
      console.log(`⚠️ JSON file not found for ${categoryName}`);
      continue;
    }
    
    totalCategories++;
    
    // Read the Swift content
    const swiftContent = fs.readFileSync(path.join(sourceDir, file), 'utf8');
    const swiftCourses = extractSwiftCourses(swiftContent);
    
    // Read the JSON content
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const jsonData = JSON.parse(jsonContent);
    const jsonCourses = jsonData.courses || [];
    
    // Compare the courses
    const results = compareCourses(swiftCourses, jsonCourses);
    console.log(formatResults(results, categoryName));
    
    if (results.missingInJson.length === 0 && 
        results.missingFields.length === 0 && 
        results.differentValues.length === 0) {
      successfulCategories++;
    }
  }
}

// Print final summary
console.log('\n📊 Overall Test Summary:');
console.log(`${successfulCategories} of ${totalCategories} categories validated successfully (${Math.round(successfulCategories/totalCategories*100)}%)`);
if (successfulCategories === totalCategories) {
  console.log('✅ All course data successfully converted!');
} else {
  console.log('⚠️ Some categories have conversion issues. See details above.');
} 