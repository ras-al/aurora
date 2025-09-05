<p align="center">
<img src="public/logo.png" alt="Aurora '25 Logo" width="200"/>
</p>

<h1 align="center">Aurora '25 - Official Tech Fest Website</h1>

<p align="center">
The official web application for <strong>Aurora '25</strong>, the flagship technical fest of <strong>IEEE SB TKMCE</strong>. This platform serves as the central hub for event information, user registration, and participation management.
</p>

<p align="center">
<a href="#-features"><strong>Features</strong></a> ·
<a href="#-tech-stack"><strong>Tech Stack</strong></a> ·
<a href="#-getting-started"><strong>Getting Started</strong></a> ·
<a href="#-contributing"><strong>Contributing</strong></a> ·
<a href="#-license"><strong>License</strong></a>
</p>

## ✨ Features
This application is packed with features to ensure a smooth and engaging experience for both participants and administrators:

- **Secure User Authentication**: Robust and secure user registration and login functionality powered by Firebase Authentication.
- **Dynamic Event Management**: Admins can effortlessly create, update, and manage all fest events through a dedicated dashboard.
- **Personalized User Dashboard**: Participants get a personalized dashboard to view their profile, track registered events, and access their unique Aurora Pass.
- **Comprehensive Admin Dashboard**: A powerful admin panel to:
  - Oversee all registered users.
  - Monitor event registration counts.
  - Download participant lists for specific events in CSV format.
  - Download a complete list of all Aurora registrants.
- **Seamless Event Registration**: A simple and intuitive process for users to browse and register for various events.
- **Digital Aurora Pass**: Upon registration, each participant receives a unique "Aurora Pass" with a QR code for quick and easy check-ins at the event.
- **Fully Responsive Design**: The application is meticulously designed to be fully functional and visually appealing across all devices, from desktops to mobile phones.

## 💻 Tech Stack
The project leverages a modern and efficient technology stack:

- **Frontend**: React (bootstrapped with Vite)
- **Backend & Database**: Firebase (Authentication, Firestore)
- **Routing**: React Router
- **Styling**: Custom CSS for a unique and branded look
- **Deployment**: Configured for seamless deployment on Vercel

## 🚀 Getting Started
To get a local copy up and running, please follow these steps.

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v14 or newer)
- npm or yarn package manager

### Installation & Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/ras-al/aurora.git
   cd aurora
   ```
2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set Up Environment Variables**
   - Create a `.env` file in the root of your project.
   - Add your Firebase project configuration keys to the `.env` file. You can find these in your Firebase project settings:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
4. **Run the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application should now be running on `http://localhost:5173/`.

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` file for more information.

<p align="center">
Made with ❤️ by the team at IEEE SB TKMCE.
</p>
