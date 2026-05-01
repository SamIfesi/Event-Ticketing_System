# Ticketer 🎫

A modern, feature-rich event ticketing platform built with React and Vite. Ticketer enables users to discover events, book tickets, and manage bookings seamlessly. Organizers can create and manage events while admins oversee the platform.

## Features

### 🎯 Core Features

- **Event Discovery**: Browse, search, and filter events by category, date, and location
- **Event Details**: View comprehensive event information including venue, date, time, and ticket types
- **Ticket Booking**: Seamless booking experience with multiple ticket tiers (Regular, VIP, Early Bird, etc.)
- **Payment Processing**: Integrated Paystack payment gateway for secure transactions
- **QR Code Scanning**: Built-in QR code scanner for event check-ins (html5-qrcode)

### 👥 Multi-Role System

- **Attendees**: Discover events, book tickets, manage bookings and profile
- **Organizers**: Create and manage events, view bookings, handle check-ins
- **Admins**: Platform oversight, user management, event monitoring
- **Role-Based Access Control**: Protected routes ensure users access only appropriate sections

### 🔐 Authentication & Security

- Email registration with OTP verification
- Login with email/password
- Forgot password and password reset flows
- Token-based authentication with persistent sessions
- Email verification requirement before full access

### 🎨 User Experience

- Responsive design with Tailwind CSS
- Dark/Light theme toggle with persistent preference
- Real-time toast notifications for user feedback
- Loading indicators (top bar and center loaders) for async operations
- Pagination for event listings

## Tech Stack

### Frontend

- **React 19** - UI framework
- **Vite** - Fast build tool and dev server with HMR
- **React Router v7** - Client-side routing and navigation
- **Zustand** - Lightweight state management
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library

### Libraries

- **Axios** - HTTP client for API calls
- **react-paystack** - Payment gateway integration
- **html5-qrcode** - QR code scanning
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Auth-related components (OTPInput, ProtectedRoute, RoleRoute)
│   ├── bookings/       # Booking management components
│   ├── dashboard/      # Dashboard components (charts, tables, stats)
│   ├── events/         # Event-related components (cards, filters, grid)
│   ├── layout/         # Layout components (Navbar, Sidebar, Footer)
│   ├── loaders/        # Loading indicators
│   └── ui/             # Reusable UI elements (Button, Input, Modal, etc.)
├── pages/              # Page components
│   ├── public/         # Public pages (Home, Events, Login, Register, etc.)
│   ├── attendee/       # Attendee dashboard pages
│   ├── organizer/      # Organizer management pages
│   ├── admin/          # Admin dashboard pages
│   └── payment/        # Payment-related pages
├── services/           # API service modules
│   ├── auth.service.js
│   ├── events.service.js
│   ├── bookings.service.js
│   ├── tickets.service.js
│   ├── profile.service.js
│   └── api.js          # Axios instance with interceptors
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication state and actions
│   ├── useEvents.js    # Events fetching and filtering
│   ├── useBookings.js  # Booking management
│   ├── useTickets.js   # Ticket operations
│   └── ...
├── store/              # Zustand stores for global state
│   ├── authStore.js    # Auth state
│   ├── uiStore.js      # UI state (toasts, modals)
│   ├── loaderStore.js  # Loading indicators
│   └── themeStore.js   # Theme management
├── utils/              # Utility functions
│   ├── formatCurrency.js
│   ├── formatDate.js
│   ├── roleGuard.js    # Role-based routing logic
│   └── validators/     # Input validators
├── config/
│   └── constants.js    # App constants, API URL, roles, statuses
├── App.jsx             # Main app component with routing
└── main.jsx            # React entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API server running (configure `VITE_API_URL` in `.env`)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ticketer
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file based on `.env.example`:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Outputs optimized build to `dist/` directory

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Key Concepts

### Authentication Flow

1. User registers → Email verification via OTP
2. User logs in → Receives JWT token
3. Token stored in `authStore` and localStorage
4. Protected routes check for valid token and verification status
5. Failed auth redirects to login or onboarding

### State Management

- **authStore**: User authentication state, token, user info
- **uiStore**: Toast notifications, modals, UI state
- **loaderStore**: Global loading indicators
- **themeStore**: Dark/Light theme preference

### Custom Hooks

- **useAuth()**: Login, register, logout, password reset
- **useEvents()**: Fetch events with filters, search, pagination
- **useBookings()**: Manage bookings and payments
- **useTickets()**: Ticket operations and scanning
- **useAdmin()**: Admin operations

### API Integration

- Centralized Axios instance in `services/api.js`
- Token automatically added to request headers
- Error handling with status-specific responses
- Loading states managed via hooks and stores

### Protected Routes

- `<ProtectedRoute>`: Requires valid authentication
- `<RoleRoute>`: Requires specific user role (admin, organizer, attendee)
- Unauthorized access redirects to `/unauthorized` page

## Environment Variables

```env
VITE_API_URL          # Backend API base URL
VITE_PAYSTACK_PUBLIC_KEY  # Paystack payment gateway key
```

## Status Constants

The app uses standardized status enums for consistent state management:

- **User Status**: active, suspended, banned
- **Event Status**: draft, published, cancelled, completed
- **Ticket Status**: valid, used, cancelled, expired
- **Booking Status**: pending, confirmed, cancelled
- **Payment Status**: pending, paid, failed, refunded

## UI Components

Built with Tailwind CSS and Lucide icons, offering:

- **Button**: Customizable button with variants
- **Input**: Form inputs with validation states
- **Modal**: Reusable modal dialogs
- **Badge**: Status and category badges
- **Pagination**: Navigation for paginated lists
- **ToastContainer**: Notification system
- **Spinner/Loaders**: Loading indicators

## Contributing

1. Follow the existing code structure and patterns
2. Use the established hooks for state management
3. Implement role-based access control for new features
4. Add error handling with appropriate toast notifications
5. Keep components focused and reusable

## License

This project is private and confidential.
