# Exovia---Excel-Analytics-Platform
Exovia is a full-stack MERN web application for secure spreadsheet upload, interactive data visualization, and centralized chart history management.

# Exovia

**Exovia** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed for secure spreadsheet upload, interactive data visualization, and centralized chart history management. Users can upload Excel/CSV files, generate dynamic charts (bar, line, histogram), and revisit or manage their visualizations—all within a user-friendly dashboard running locally for privacy and control.

---

## Features

- User registration, login, and secure JWT-based authentication
- Excel/CSV file upload with validation and error handling
- Interactive data visualization with multiple chart types (bar, line, histogram)
- Chart customization and real-time preview
- Persistent chart history: save, view, rename, and delete charts
- Responsive, mobile-friendly UI built with React.js and Tailwind CSS
- Data privacy: all data and files managed locally
- Comprehensive error messages and notifications

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (local instance), Mongoose
- **Authentication:** JWT, bcrypt, HTTP-only cookies
- **Charting:** Chart.js or Recharts (customizable)
- **File Parsing:** xlsx, multer

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (running locally)

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/exovia.git
    cd exovia
    ```

2. **Install dependencies for both frontend and backend**
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3. **Start MongoDB**
    - Make sure your local MongoDB server is running (default port: 27017).

4. **Environment Variables**

    - Create a `.env` file in the `backend` folder with:
      ```
      MONGODB_URI=mongodb://localhost:27017/exovia
      JWT_SECRET=your_secret_key
      PORT=5000
      ```

5. **Run the application**

    - **Backend:**
      ```bash
      cd backend
      npm start
      ```

    - **Frontend:**
      ```bash
      cd frontend
      npm start
      ```

## Contributing

Pull requests and suggestions are welcome!  
For major changes, please open an issue first to discuss what you would like to change.



