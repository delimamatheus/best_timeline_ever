# 🚀 Project Setup & Execution Guide

This guide provides the necessary steps to set up and run the interactive Timeline component, which is built using **React**, **TypeScript**, and **Material-UI (MUI)**. It renders the sample data included in `src/timelineItems.js`.

## Prerequisites

You must have the following installed on your system:

  * **Node.js** (v14 or higher)
  * **npm** (Node Package Manager) or Yarn/pnpm

## 1\. Project File Structure

For the Timeline component to resolve all its dependencies (`TimelineLegend`, `TimelineItem`, `EditModal`, and utility functions), ensure your project directory follows this structure:

```
/my-timeline-project
├── src/
│   ├── components/
│   │   ├── molecules/
│   │   │   ├── TimelineItem/TimelineItem.tsx
│   │   │   ├── TimelineLegend/TimelineLegend.tsx
│   │   │   └── EditModal/EditModal.tsx
│   │   └── Timeline/Timeline.tsx       // The main component
│   ├── utils/
│   │   └── assignLanes.ts              // Custom logic for lane assignment
│   ├── timelineItems.js                // Sample data structure
│   └── App.tsx                         // Main rendering container (must import Timeline)
├── package.json
└── tsconfig.json
```

## 2\. Installation of Dependencies

Open your terminal in the project's root directory (`/my-timeline-project`).

First, install the core dependencies (React, TypeScript):

```bash
npm install react react-dom typescript @types/react @types/react-dom
```

Next, install the Material-UI (MUI) libraries, which are essential for styling and component structure:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

## 3\. How to Run the Project

After all dependencies are successfully installed, you can start the local development server:

```bash
npm run start
# If you are using a standard Create React App setup.
```

The application will typically compile the source code and automatically open in your web browser, usually at: **`http://localhost:3000`**.

### Component Interactions

Once running, you can interact with the Timeline component to verify the implemented features:

1.  **Multiple Filtering:** Click on any legend chip (e.g., 'HR', 'Design'). The items for that category will be displayed. Click on a second chip to display items from both categories. Clicking an active chip removes its filter.
2.  **Stable Height:** Apply and remove filters; the height of the timeline container will remain stable, preventing layout shifts.
3.  **Responsive Zoom:** The zoom controls are correctly positioned and remain usable even on narrow (mobile) screen widths.
4.  **Drag-and-Drop:** You can drag any item horizontally to adjust its start and end dates.

# Reflections on the Timeline Component

This document offers insights into the development of the Timeline component, covering positive implementation aspects, areas for future improvements, the design process, and a proposed testing strategy.

## 1. Highlights of the Current Implementation

I enjoyed the opportunity to apply my knowledge of React and TypeScript to build this feature, which allowed me to explore several creative ideas that emerged during development.

Key strengths of the implementation include:

* **Rich Interactivity (Drag-and-Drop):** The ability to directly drag and drop items on the timeline to intuitively adjust their start and end dates.
* **Lane Management Logic:** The custom lane assignment logic (`assignLanes`) ensures that overlapping items are displayed clearly, optimizing vertical space usage.
* **Dynamic Filtering:** The implementation of category filters in the legend allows users to view data subsets. The use of distinct colors for each category significantly improves quick identification and user experience.
* **Stable UX:** The critical final fix to maintain a **fixed timeline container height** when applying or removing filters prevents layout shifts (the "jumping" effect), ensuring a much more stable user experience.

## 2. What I Would Change in a Future Iteration

If I were to revisit or expand this project, the following improvements would be prioritized, reflecting a Full Stack approach:

1.  **Full Backend Integration:** The primary change would be to replace the static data (`timelineItems.js`) with a comprehensive database integration, consuming data via a RESTful API.
2.  **Complete CRUD Functionality:** I would implement an administration screen or, at minimum, a simple button to **Add New Items/Tasks** (Create), complementing the existing Edit (Update) and potential Delete functionalities.
3.  **Code Structure and Scalability:** I would have focused much more on **folder and file organization**. I started the project with a desired structure (`components/molecules`), but due to time constraints, I couldn't strictly adhere to best practices for managing larger projects. Reorganizing the file structure would be a priority for better maintenance and readability.
4.  **Performance Optimization:** For timelines handling thousands of items, I would explore techniques like list virtualization to ensure that only visible elements are rendered, maintaining high performance.

## 3. Design and Decision-Making Process

My design decisions were guided by the pursuit of clarity and ease of use within a project management context:

1.  **Visual Inspiration:** I initially sought inspiration from professional visualization tools (such as Gantt charts and dedicated project management software) to understand common UX conventions and best practices for displaying timelines.
2.  **Sketching and Prototyping (Low-Fidelity):** The structure and layout were first sketched on paper. I focused on how navigation, zoom, and item overlap should work visually before starting the code implementation.
3.  **MUI Usage:** Choosing Material-UI (MUI) ensured that the component is responsive and uses a consistent, accessible color palette. Making the zoom controls fully responsive was a key adjustment for mobile usability.

## 4. Testing Strategy

Due to time constraints, only ad-hoc feature testing was performed during development. If I had more time, the testing strategy would be expanded into these areas:

1.  **Unit Tests (Jest/RTL):**
    * Test the `assignLanes` utility function to ensure the lane assignment logic is always correct, regardless of input data.
    * Test state handlers (e.g., `handleZoomIn`, `handleItemDrop`) to verify that they update the application state predictably and correctly.
2.  **Integration Tests (Cypress/Playwright):**
    * Test complete user workflows, such as applying multiple filters and confirming only the correct items are displayed, and performing a drag-and-drop action followed by validation in the edit modal.
3.  **User Acceptance Testing (UAT):**
    * The most insightful testing for a complex UI is UAT. I would recruit 2-3 friends or colleagues to use the tool **without any prior instructions**, observing how they naturally attempt to filter, zoom, and interact with the items. This qualitative feedback is essential for identifying non-intuitive design flaws.
