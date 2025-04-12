const fs = require('fs');
const path = require('path');

// Function to extract courses from Swift file
function extractCoursesFromSwift(swiftContent) {
    const courses = [];
    const courseRegex = /Course\(([\s\S]*?)\)/g;
    let match;

    while ((match = courseRegex.exec(swiftContent)) !== null) {
        const courseData = match[1];
        const course = {};

        // Extract course properties while preserving exact values
        const properties = courseData.split(',');
        properties.forEach(prop => {
            const [key, value] = prop.split(':').map(s => s.trim());
            if (key && value) {
                const cleanKey = key.trim();
                const cleanValue = value.trim().replace(/,$/, '');
                
                switch (cleanKey) {
                    case 'courseNumber':
                    case 'name':
                    case 'courseLevel':
                    case 'description':
                    case 'prerequisites':
                    case 'gradeLevel':
                        // Preserve exact string values
                        course[cleanKey] = cleanValue.replace(/"/g, '');
                        break;
                    case 'isWeighted':
                        // Preserve exact boolean value
                        course[cleanKey] = cleanValue === 'true';
                        break;
                    case 'credits':
                        // Preserve exact numeric value
                        course[cleanKey] = parseFloat(cleanValue);
                        break;
                    case 'secondHalfCredit':
                        if (cleanValue !== 'nil') {
                            const halfCreditMatch = cleanValue.match(/HalfCreditCourseInfo\(([\s\S]*?)\)/);
                            if (halfCreditMatch) {
                                const halfCreditData = halfCreditMatch[1];
                                const halfCredit = {};
                                const halfCreditProps = halfCreditData.split(',');
                                halfCreditProps.forEach(hp => {
                                    const [hKey, hValue] = hp.split(':').map(s => s.trim());
                                    if (hKey && hValue) {
                                        const cleanHKey = hKey.trim();
                                        const cleanHValue = hValue.trim().replace(/,$/, '');
                                        if (cleanHKey === 'credits') {
                                            halfCredit[cleanHKey] = parseFloat(cleanHValue);
                                        } else {
                                            halfCredit[cleanHKey] = cleanHValue.replace(/"/g, '');
                                        }
                                    }
                                });
                                course[cleanKey] = halfCredit;
                            }
                        }
                        break;
                }
            }
        });

        courses.push(course);
    }

    return courses;
}

// Process all Swift files in the Categories directory
const categoriesDir = path.join(__dirname, '../../HCPSSCatalog/Data/Categories');
const outputDir = path.join(__dirname, '../data/courses');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read all Swift files
fs.readdirSync(categoriesDir).forEach(file => {
    if (file.endsWith('Courses.swift')) {
        const categoryName = file.replace('Courses.swift', '');
        const filePath = path.join(categoriesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const courses = extractCoursesFromSwift(content);
        const categoryData = {
            name: categoryName,
            courses: courses
        };

        // Save as JSON
        const outputPath = path.join(outputDir, `${categoryName.toLowerCase()}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(categoryData, null, 2));
        console.log(`Converted ${categoryName} courses to JSON`);
    }
}); 