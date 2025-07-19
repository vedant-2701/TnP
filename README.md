# Training and Placement Automation System

This is a full-stack web application designed to automate the training and placement process for educational institutions. The system provides a platform for students, the training and placement office (TPO), and administrators to manage and streamline the placement process.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Java 17 or higher
*   Node.js 16 or higher
*   MongoDB

### Installing

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/vedant-2701/TnP.git
    cd your-repository
    ```

2.  **Set up the backend:**

    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```

3.  **Set up the frontend:**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Technologies

### Backend

*   **Java 17**
*   **Spring Boot**
*   **Spring Security**
*   **MongoDB**
*   **JWT (JSON Web Tokens)**
*   **Cloudinary**
*   **Apache POI**

### Frontend

*   **React**
*   **Vite**
*   **Material-UI**
*   **Tailwind CSS**
*   **D3.js**
*   **Axios**

## Features

*   **User Authentication:** Secure login for students, TPO, and administrators.
*   **Student Profile Management:** Students can create and manage their profiles, including personal details, academic information, and resumes.
*   **Company Management:** TPO can add and manage company profiles, including job descriptions and eligibility criteria.
*   **Placement Drive Management:** TPO can create and manage placement drives, including scheduling and tracking.
*   **Application Tracking:** Students can apply for placement drives and track their application status.
*   **Analytics Dashboard:** The TPO and administrators can view analytics and reports on placement statistics.

## Project Structure

The repository is organized into two main directories:

*   `backend/`: Contains the Spring Boot application that provides the REST API.
*   `frontend/`: Contains the React application that serves as the user interface.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
