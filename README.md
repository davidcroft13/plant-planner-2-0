# Plant Planner 2.0

A comprehensive meal planning and content management platform built with React, TypeScript, and Supabase.

## Features

- **User Authentication**: Secure login/signup with Supabase Auth
- **Recipe Management**: Create, edit, and organize recipes with images and nutrition info
- **Meal Planning**: Weekly meal plans with smart recommendations
- **Workout Library**: Exercise routines and fitness content
- **Course System**: Educational content with progress tracking
- **Admin Portal**: Content management for creators and administrators
- **Subscription Management**: Stripe integration for recurring billing
- **Real-time Support**: Intercom widget for customer support

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe
- **Support**: Intercom
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Intercom account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd plant-planner-2-0
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
VITE_INTERCOM_APP_ID=your_intercom_app_id_here
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database-schema.sql` in your Supabase SQL editor
3. Configure Row Level Security (RLS) policies as needed
4. Set up storage buckets for images and media

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── BottomNavigation.tsx
│   └── IntercomWidget.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── StripeContext.tsx
├── pages/              # Page components
│   ├── LandingPage.tsx
│   ├── HomePage.tsx
│   ├── RecipesPage.tsx
│   ├── MealPlanPage.tsx
│   ├── CoursesPage.tsx
│   ├── WorkoutsPage.tsx
│   ├── ProfilePage.tsx
│   └── AdminPortal.tsx
├── App.tsx             # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Key Features Implementation

### Authentication
- Supabase Auth integration
- Role-based access control (user/admin)
- Protected routes and components

### Content Management
- CRUD operations for recipes, meal plans, workouts, courses
- Image upload to Supabase Storage
- Content status management (draft/published/archived)

### Subscription Management
- Stripe integration for payments
- Webhook handling for subscription updates
- User subscription status tracking

### Admin Portal
- Content management interface
- User management
- Analytics and reporting
- Platform settings

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_INTERCOM_APP_ID`

## API Integration

### Supabase
- Database operations
- User authentication
- File storage
- Real-time subscriptions

### Stripe
- Payment processing
- Subscription management
- Webhook handling

### Intercom
- Customer support widget
- User communication
- Help documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact us through the Intercom widget in the app or email support@plantplanner.com.
