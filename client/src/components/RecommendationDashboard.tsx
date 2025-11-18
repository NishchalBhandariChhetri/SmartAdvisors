import React from "react";

interface Prof {
  name: string;
  attributes: string[];
}

interface CourseRecommendation {
  course: string;
  professors: Prof[];
}

interface Props {
  userData?: any;
}

// Color coding rules
const getAttributeColor = (attr: string) => {
  const lower = attr.toLowerCase();

  if (
    lower.includes("easy") ||
    lower.includes("help") ||
    lower.includes("fair") ||
    lower.includes("engaging") ||
    lower.includes("clear") ||
    lower.includes("organized")
  ) {
    return "bg-green-100 text-green-800 border-green-300";
  }

  if (
    lower.includes("strict") ||
    lower.includes("tough") ||
    lower.includes("heavy") ||
    lower.includes("hard") ||
    lower.includes("attendance required")
  ) {
    return "bg-red-100 text-red-800 border-red-300";
  }

  return "bg-blue-100 text-blue-800 border-blue-300";
};

// Sample data (replace with backend data later)
const sampleData: CourseRecommendation[] = [
  {
    course: "CE 3000",
    professors: [
      { name: "Eleanor Vance", attributes: ["Helpful", "Clear", "Fair Grader"] },
      { name: "Arthur Sterling", attributes: ["Strict", "Attendance Required"] },
      { name: "Caleb Holloway", attributes: ["Easy Exams", "Organized"] },
      { name: "Beatrice Montgomery", attributes: ["Flexible", "Chill Lectures"] },
    ],
  },
  {
    course: "CE 323",
    professors: [
      { name: "Vivian Albright", attributes: ["Project Heavy", "Strict Rubrics"] },
      { name: "Jasper Finch", attributes: ["Fast Grading", "Helpful"] },
      { name: "Isolade Cartwright", attributes: ["Tough Exams"] },
      { name: "Rowan Hayes", attributes: ["Organized", "Clear Slides"] },
    ],
  },
  {
    course: "CE 525",
    professors: [
      { name: "Clara Davenport", attributes: ["Engaging", "Real Examples"] },
      { name: "Silas Pendleton", attributes: ["Fair", "Flexible Attendance"] },
      { name: "Georgia Thorne", attributes: ["Lots of Homework"] },
      { name: "Miles Ashford", attributes: ["Chill", "Good Pace"] },
    ],
  },
  {
    course: "CE 2300",
    professors: [
      { name: "Violet Hayes", attributes: ["Funny", "Super Chill"] },
      { name: "Felix Montgomerr", attributes: ["Strict", "Hard Exams"] },
      { name: "Thea Sterling", attributes: ["Great Slides", "Organized"] },
      { name: "Theodore Ale", attributes: ["Helpful", "Accessible"] },
    ],
  },
];

const RecommendationDashboard: React.FC<Props> = ({ userData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-10 text-gray-900 text-center">
        Your Recommendations
      </h1>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        {sampleData.map((col, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md border p-5 transition hover:shadow-xl"
          >
            {/* Course Title */}
            <h2 className="text-xl font-semibold mb-5 text-center text-blue-700">
              {col.course}
            </h2>

            {/* Professors (dynamic height) */}
            <div className="flex flex-col gap-4">
              {col.professors.map((prof, pIndex) => (
                <div
                  key={pIndex}
                  className="border rounded-xl p-4 bg-gray-50 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {prof.name}
                  </h3>

                  {/* Attribute Chips */}
                  <div className="flex flex-wrap gap-2">
                    {prof.attributes.map((attr, aIndex) => (
                      <span
                        key={aIndex}
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getAttributeColor(
                          attr
                        )}`}
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationDashboard;
