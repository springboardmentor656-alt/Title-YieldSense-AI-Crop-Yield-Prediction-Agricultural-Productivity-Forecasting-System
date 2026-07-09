# UI Wireframes & Layout Planning - YieldSense AI

This document maps out the layout, elements, and states of the interactive pages built inside the `frontend/` workspace directory.

## 1. Authentication View (`app/login/page.tsx`)
- **Aesthetic**: Premium dark gradient background with ambient glowing orbs and glassmorphism panel styling.
- **Components**:
  - Header text ("Welcome Back")
  - Username/Email field (Pre-filled for mock verification)
  - Password input (Pre-filled for mock verification)
  - Interactive "Sign In" button containing custom submission logic routing to the Dashboard.

## 2. Dashboard View (`app/dashboard/page.tsx`)
- **Aesthetic**: Responsive sidebar layout, premium dark themes, cards featuring translucent glass borders.
- **Components**:
  - Left-hand sidebar panel mapping navigation actions (Dashboard, Farm Data, Weather, Settings).
  - Main metric cards grid displaying current farm analytics:
    - **Predicted Yield**: Displays estimated forecast outputs.
    - **Soil Moisture**: Displays average soil humidity metrics.
    - **Upcoming Rainfall**: Displays short-term forecast precipitations.
  - Large center card container acting as a placeholder container for upcoming data visualization components.

## 3. Farm Data Entry View (`app/dashboard/farm-data/page.tsx`)
- **Aesthetic**: Split-column form block on glassmorphism card layouts.
- **Components**:
  - Form Fields:
    - Location/Region (Input field)
    - Date Select (Interactive Date selector)
    - Crop Type Selection (Dropdown: Wheat, Corn, Rice, Soybeans)
  - Submission button ("Save Data Record") to log user entries.
