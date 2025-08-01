# 🎓 Tagama – Creative Workshop Platform

A modern web application for discovering and managing creative workshops in **Tenerife, Canary Islands**, developed with **vanilla JavaScript**, **Tailwind CSS**, and external APIs.  
Created as part of the _JavaScript Expert Bootcamp_ by **HerTech** and **LaRueca**, funded by **Provivienda**.

![Tagama logo light](/src/assets/images/logo/Tagama-light-background-horiz.svg)
![Tagama logo dark](/src/assets/images/logo/Tagama-dark-background-horiz.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technical Architecture](#-technical-architecture)
- [Installation & Setup](#-installation--setup)
- [External APIs & Services](#-external-apis--services)
- [Technologies Used](#-technologies-used)
- [Team & Collaboration](#-team--collaboration)
- [Authors](#-authors)
- [License](#-license)

---

## ✨ Features

### 🖥️ User Interface

- **Responsive Design**: Fully functional across devices
- **Dark / Light Mode**: Seamless theme switching
- **Modern Look**: Styled with Tailwind CSS
- **Interactive Modals**: Dynamic forms and confirmations

### 🔐 Authentication

- **Sign Up / Login**: Full user authentication flow
- **User Profiles**: Edit personal info and avatar
- **Persistent Sessions**: Stay logged in between visits

### 🧑‍🏫 Workshop Management

- **Full CRUD**: Create, view, update, and delete workshops
- **Categories & Subcategories**: Organized workshop listing
- **Levels & Modes**: Beginner to advanced, online or in-person
- **Geocoding Integration**: Auto-location from address
- **Map Display**: Interactive maps using Leaflet

### 🖼️ Media & Content

- **Image Uploads**: Integrated with Cloudinary
- **Image Previews**: Before uploading
- **Validations**: File type and size checks

### 📬 Communication & UX

- **Contact Form**: Sends email with EmailJS
- **Toast Notifications**: Real-time feedback to users
- **Custom Confirm Modals**: Personalized confirmations

---

## 🏗️ Technical Architecture

### 📁 Folder Structure

```
src/
├── api/
│   ├── apiCategories.js
│   ├── apiUsers.js
│   └── apiWorkshops.js
├── components/
│   ├── cards.js
│   └── modals/
│       └── formModal.js
├── utils/
│   ├── day.js
│   ├── leaflet.js
│   └── toastify.js
├── views/
│   ├── contact.js
│   ├── detail.js
│   ├── login.js
│   ├── profile.js
│   ├── signup.js
│   └── workshops.js
└── assets/
    └── styles/
        └── main.css
```

---

## 🚀 Installation & Setup

### Prerequisites

- Modern web browser
- Internet connection (for external APIs)

### Steps

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd tagama-workshops
   npm install
   ```

2. **Open the project**

   ```bash
   # Use Live Server in VS Code or open index.html directly
   ```

---

## 🌐 App Routes Overview

This web application provides a variety of routes to manage and explore workshops. Below is a summary of each endpoint and its purpose:

---

### `/` — Landing Page

Introductory page of the app, with access to login or sign up.

---

### `/about` — About

Explains the purpose of the platform, its mission, and who we are.

---

### `/login` — Login

Allows registered users to access their accounts.

---

### `/signup` — Sign Up

Form for new users to register and create an account.

---

### `/home` — All Workshops

Displays all available workshops in card format. Includes filters by:

- Category and subcategory
- Date (upcoming or distant)
- Price

Clicking on a card opens its detail page. Users can also save workshops to their personal list.

---

### `/workshop/:id` — Workshop Details

Shows complete information about a specific workshop:

- Description and location (with map)
- Register (payment flow included)
- Cancel registration if already enrolled

---

### `/workshops` — User's Workshops

Dashboard with tabs to view:

- Enrolled workshops
- Created workshops
- Saved workshops

Also includes a modal to create a new workshop and add it to the list.

---

### `/profile` — User Profile

Displays and allows editing of the user's personal information. Features:

- Edit profile and upload/change profile picture
- Summary of enrolled, created, and saved workshops
- Option to delete the account (with confirmation)

---

## 🧭 User Guide

### Public Access

- **Landing page**
- **About Us**
- **Contact page**

### Requires Login

- **Workshop list and filtering**
- **Workshop detail**
- **Save and join workshops**
- **Create, edit, and delete own workshops**
- **Profile page with edit and delete account**

---

## 🔧 External APIs & Services

### **MockAPI**

- **Purpose**: Simulated backend for users, workshops, categories and subcategories
- **Setup**: Endpoints configured in `api/*.js`

### **Cloudinary**

- **Purpose**: Image storage and delivery
- **Usage**: Avatar and workshop image uploads

### **EmailJS**

- **Purpose**: Email sending via contact form
- **Usage**: Real-time form submission

### **Nominatim (OpenStreetMap)**

- **Purpose**: Address-to-coordinates conversion
- **Usage**: Geolocation for workshop addresses

### **Leaflet**

- **Purpose**: Interactive map rendering
- **Usage**: Show locations of in-person workshops

---

## 🛠️ Technologies Used

### **Frontend**

- **JavaScript ES6+**
- **Tailwind CSS**
- **HTML5**
- **CSS3** (with custom properties)

### **APIs & Services**

- **MockAPI**
- **Cloudinary**
- **EmailJS**
- **Nominatim**
- **Leaflet**

### **Utilities**

- **Day.js**: Date formatting
- **Toastify**: Notifications

---

## 🤝 Team & Collaboration

### 🧩 Tools for Teamwork & Documentation

- **Trello**: Task management
- **Discord**: Communication
- **FigJam**: Project documentation:
  - MVP definition
  - PRD
  - User flow diagrams
  - Content and structure maps
  - Visual documentation (wireframes via Whimsical)

### 📈 From MVP to Final Delivery

The team achieved all core objectives except integration with **Unsplash**. Additional features like **landing page**, **about us**, **contact form**, **dark mode**, and **simulated payments** were implemented.

The project scope was narrowed to Tenerife to give it a more **local, artisanal, and human identity**.

> **Next steps**: Add Unsplash API, reviews, and waiting lists.

📎 Access to FigJam:  
[https://www.figma.com/board/jSRhWP6x6qrpY8VS6zac08/Proyecto-final-Her-Tech](https://www.figma.com/board/jSRhWP6x6qrpY8VS6zac08/Proyecto-final-Her-Tech?node-id=0-1&t=RltlJ4fb4WPj1WlV-1)

---

## 🎨 Visual Identity

Tagama’s design is inspired by **earthy, natural elements**, reflecting creativity, community, and artisan values.  
It features:

- **Organic typography**
- **Spiral symbol** evoking natural cycles and creativity
- **Colors**:
  - Muted green-gray
  - Terracotta
  - Beige
- Used on both **light and dark backgrounds**
- Subtitles such as `TALLERES` appear in **uppercase**
- Visual elements reinforce a **local, grounded, and handcrafted feel**

---

## 💡 Contribution

This was a learning project developed in a bootcamp setting. While external contributions aren’t expected, feel free to fork or explore for educational purposes.

---

## 👥 Authors

- **Carolina Melian**
- **Yesenia Medina**
- **Tracy Medina**
- **Sheila Castellano**

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
