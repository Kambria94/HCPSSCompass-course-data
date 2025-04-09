# HCPSSCompass Course Data Repository

This repository contains the course data for HCPSSCompass, serving as the single source of truth for course information used by both the iOS app and website.

## Repository Structure

```
HCPSSCompass-course-data/
├── data/                  # Course data in JSON format
│   └── courses.json       # Current academic year's course data
├── github_pages/          # GitHub Pages website files
│   ├── index.html         # Landing page
│   └── README.md          # GitHub Pages documentation
└── README.md              # This file
```

## Data Format

The course data is stored in JSON format with the following structure:

```json
{
  "version": "1.0.0",
  "lastUpdated": "YYYY-MM-DD",
  "academicYear": "YYYY-YYYY",
  "categories": {
    "CategoryName": {
      "name": "Category Name",
      "courses": [
        {
          "courseNumber": "XX-XXX-X",
          "name": "Course Name",
          "isWeighted": true,
          "courseLevel": "Level",
          "credits": 1.0,
          "description": "Course description",
          "prerequisites": "Prerequisites",
          "gradeLevel": "Grade levels"
        }
      ]
    }
  }
}
```

## Academic Years

The course data is organized by academic year (e.g., "2025-2026"). Each year's course catalog may be updated to reflect:
- New courses
- Course changes
- Prerequisite updates
- Credit modifications

## Usage

The data can be accessed via GitHub Pages at:
`https://[username].github.io/HCPSSCompass-course-data/data/courses.json`

## Contributing

Course data updates should be made through the iOS app's export functionality. When updating for a new academic year:
1. Create a new branch for the academic year
2. Update the course data
3. Update the academicYear field
4. Submit a pull request for review

## GitHub Pages

The GitHub Pages site is located in the `github_pages` directory. It provides a web interface to view and access the course data. 