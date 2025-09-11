import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, CheckCircle, DollarSign, Camera, BarChart3, Users, Star } from 'lucide-react'
import IntercomWidget from '../components/IntercomWidget'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <IntercomWidget />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PlantPlanner</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Product</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">Benefits</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ's</a>
            </nav>
            
            <div className="flex space-x-4">
              <Link to="/app" className="btn btn-secondary px-4 py-2">
                Log In
              </Link>
              <Link to="/app" className="btn btn-primary px-4 py-2">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Creators, pioneering together.
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                At Plant Planner, we provide a platform for creators who are committed to making a positive impact.
              </p>
              <button className="btn btn-primary px-6 py-3 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Watch Intro Video
              </button>
            </div>
            
            <div className="relative">
              {/* Hero phone photo */}
              <img 
                src="/images/hero/Plant Planner - Hero Section.png" 
                alt="Plant Planner App on Phone - Hero Section"
                className="w-full max-w-56 mx-auto rounded-3xl shadow-2xl"
              />
              
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-100 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Switch to an App Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why switch to an App?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AUDIENCE CONNECTION</h3>
                  <p className="text-gray-600">
                    With an app, creators can communicate with their audience, share their work, and build a community on their terms.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">PERSONAL BRANDING</h3>
                  <p className="text-gray-600">
                    An app can serve as a powerful tool for personal branding, allowing creators to showcase their work, their unique style, and their creative process.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">REVENUE OPPORTUNITIES</h3>
                  <p className="text-gray-600">
                    By owning their own platform, creators can control the revenue stream from their content and create sustainable income streams outside of traditional monetization models.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Benefits phone photo */}
              <img 
                src="/images/benefits/PP-Why_Switch.png" 
                alt="Plant Planner Benefits App on Phone"
                className="w-full max-w-64 mx-auto rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven performance</h2>
            <p className="text-xl text-gray-600">Features loved by users</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              {/* Meal planning feature photo */}
              <div className="mb-4">
                <img 
                  src="/images/features/PP-Meal_Planning.png" 
                  alt="Plant Planner Meal Planning Feature"
                  className="w-full max-w-48 mx-auto rounded-2xl shadow-lg"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Meal Planning</h3>
              <p className="text-gray-600 text-sm">
                Our meal planning feature takes the guesswork out of healthy eating through personalized weekly meal plans
              </p>
            </div>
            
            <div className="text-center">
              {/* Recipe details feature photo */}
              <div className="mb-4">
                <img 
                  src="/images/features/PP-Recipe_Details.png" 
                  alt="Plant Planner Recipe Details Feature"
                  className="w-full max-w-48 mx-auto rounded-2xl shadow-lg"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Recipe Details</h3>
              <p className="text-gray-600 text-sm">
                From prep to presentation, with detailed tool information to cook time, our recipe detail covers it all
              </p>
            </div>
            
            <div className="text-center">
              {/* Grocery list feature photo */}
              <div className="mb-4">
                <img 
                  src="/images/features/PP-Grocery_List.png" 
                  alt="Plant Planner Grocery List Feature"
                  className="w-full max-w-48 mx-auto rounded-2xl shadow-lg"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Grocery List</h3>
              <p className="text-gray-600 text-sm">
                In store or online, never again forget an ingredient using our grocery list builder which sums all your items for the whole week
              </p>
            </div>
            
            <div className="text-center">
              {/* Recipe box feature photo */}
              <div className="mb-4">
                <img 
                  src="/images/features/PP-Recipe_Box.png" 
                  alt="Plant Planner Recipe Box Feature"
                  className="w-full max-w-48 mx-auto rounded-2xl shadow-lg"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Recipe Box</h3>
              <p className="text-gray-600 text-sm">
                By keeping all of your recipes in one place with our recipe box feature, you can let your followers quickly find the perfect meal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing Packages</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-primary-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-gray-600 mb-6">Perfect for influencers just starting to monetize their content</p>
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">$0 up front</div>
                <div className="text-lg text-gray-600">25% of profit</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Unlimited recipes and meal plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Unlimited workout plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Email Support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Web app - Plant Planner domain</span>
                </li>
              </ul>
              <button className="w-full btn btn-primary py-3">Get Started</button>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-primary-600 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
              <p className="text-gray-600 mb-6">For established influencers ready to scale their digital presence</p>
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">$0 up front</div>
                <div className="text-lg text-gray-600">25% of profit + $50/month</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Unlimited recipes and meal plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Unlimited workout plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Email Support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Web app - Custom Domain</span>
                </li>
              </ul>
              <button className="w-full btn btn-primary py-3">Get Started</button>
            </div>
            
            <div className="bg-white rounded-xl border border-primary-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">For professional influencers with large audiences</p>
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">$0 up front</div>
                <div className="text-lg text-gray-600">25% of profit + $100/month</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Unlimited recipes and meal plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Unlimited workout plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Email Support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Web app - Custom Domain</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Mobile App</span>
                </li>
              </ul>
              <button className="w-full btn btn-primary py-3">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">And they seem to love us</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 mb-6">
                "I absolutely LOVE working with plant planner! They are on point with the tech side and truly care about making the best app possible! The features of the app are super unique and incredibly valuable. They are always ready to help and come up with the coolest updates and new features! I'm mega happy with everything so far and excited for more to come!"
              </p>
              <div className="flex items-center space-x-4">
                {/* Melissa photo */}
                <img 
                  src="/images/testimonials/Melissa - Raw Food Romance.png" 
                  alt="Melissa - Raw Food Romance"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Lissa Marris</p>
                  <p className="text-gray-600 text-sm">@rawfoodromance</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                {/* Julie and Lauren photo */}
                <img 
                  src="/images/testimonials/Julie and Lauren - Rabbit & Wolves.png" 
                  alt="Julie and Lauren - Rabbit & Wolves"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Lauren & Partner</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Lauren and I wanted to create a meal planning app but had absolutely no idea where to begin. Alex and Anna at Plant Planner came to our rescue! Luckily, we needed no knowledge about the backend tech side of things. Alex and Anna handled everything for us. When we had questions, we received prompt and clear answers. The end product was what was promised and beautiful. It was affordable as well! We highly recommend working with Alex and Anna at Plant Planner. You won't regret it. Our experience has been..."
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 mb-6">
                "We had been wanting a meal planner to provide to our audience for quite some time. Alex and Anna and The Plant Planner is exactly what we were looking for. From the moment we began working together, they were extremely prompt, responsive, and meticulous when it came to designing our meal planner. We love that the Plant Planner is mobile and desktop friendly, connects to Amazon Fresh, includes detailed nutrition info, and is able to cater to each individual's specific goals and needs. We've had an amazing response from our friends and followers who love the meal planner and have experienced great results using!"
              </p>
              <div className="flex items-center space-x-4">
                {/* Dusty & Erin photo */}
                <img 
                  src="/images/testimonials/Dusty and Erin - EatMoveRest.png" 
                  alt="Dusty and Erin - EatMoveRest"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Dusty & Erin Stanczyk</p>
                  <p className="text-gray-600 text-sm">@eatmoverest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">More About Us</h2>
          </div>
          
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="flex justify-center space-x-4 mb-8">
              <button 
                id="about-prev"
                className="btn btn-secondary p-3 rounded-full"
                onClick={() => {
                  const container = document.getElementById('about-cards');
                  if (container) {
                    container.scrollBy({ left: -640, behavior: 'smooth' });
                  }
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                id="about-next"
                className="btn btn-primary p-3 rounded-full"
                onClick={() => {
                  const container = document.getElementById('about-cards');
                  if (container) {
                    container.scrollBy({ left: 640, behavior: 'smooth' });
                  }
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Cards Container */}
            <div id="about-cards" className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide snap-x snap-mandatory">
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-8 text-white snap-start">
                <h3 className="text-2xl font-bold mb-4">Affordability</h3>
                <p className="text-lg">
                  We believe that technology should be accessible to all businesses, regardless of size or budget. That's why we offer our white label vegan app service at a fraction of the cost of typical software development startup costs.
                </p>
              </div>
              
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-8 text-white snap-start">
                <h3 className="text-2xl font-bold mb-4">Our clients love us</h3>
                <p className="text-lg">
                  We pride ourselves on providing exceptional customer service and support to all our clients. We are always available to help you with any questions or concerns you may have.
                </p>
              </div>
              
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-8 text-white snap-start">
                <h3 className="text-2xl font-bold mb-4">Custom Solutions</h3>
                <p className="text-lg">
                  Every business is unique, and we understand that. That's why we offer fully customizable solutions that can be tailored to meet your specific needs and requirements.
                </p>
              </div>
              
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-8 text-white snap-start">
                <h3 className="text-2xl font-bold mb-4">Expert Support</h3>
                <p className="text-lg">
                  Our team of experienced developers and designers are here to support you every step of the way, from initial concept to final deployment and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">FAQ's</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <button 
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                onClick={() => {
                  const answer = document.getElementById('faq-1-answer');
                  if (answer) {
                    answer.classList.toggle('hidden');
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">What is a White Label App?</h3>
                  <svg className="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div id="faq-1-answer" className="hidden px-6 pb-6">
                <p className="text-gray-600">
                  A white label app is a fully customizable mobile application that you can brand with your own logo, colors, and content. It's built once but can be customized for multiple businesses or creators.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <button 
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                onClick={() => {
                  const answer = document.getElementById('faq-2-answer');
                  if (answer) {
                    answer.classList.toggle('hidden');
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Why would I use a White Label App?</h3>
                  <svg className="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div id="faq-2-answer" className="hidden px-6 pb-6">
                <p className="text-gray-600">
                  White label apps save you time and money by providing a pre-built solution that you can customize to match your brand. You get all the benefits of a custom app without the high development costs.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <button 
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                onClick={() => {
                  const answer = document.getElementById('faq-3-answer');
                  if (answer) {
                    answer.classList.toggle('hidden');
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Can this App be customized to my needs?</h3>
                  <svg className="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div id="faq-3-answer" className="hidden px-6 pb-6">
                <p className="text-gray-600">
                  Absolutely! Our white label solution is highly customizable. You can change colors, logos, content, and even add your own features to make it uniquely yours.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <button 
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                onClick={() => {
                  const answer = document.getElementById('faq-4-answer');
                  if (answer) {
                    answer.classList.toggle('hidden');
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">I am concerned that all my users will ask me technical questions.</h3>
                  <svg className="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div id="faq-4-answer" className="hidden px-6 pb-6">
                <p className="text-gray-600">
                  Don't worry! We provide comprehensive support and documentation. Plus, our apps are designed to be intuitive and user-friendly, minimizing technical questions from your users.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <button 
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                onClick={() => {
                  const answer = document.getElementById('faq-5-answer');
                  if (answer) {
                    answer.classList.toggle('hidden');
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">How can I make my app successful?</h3>
                  <svg className="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div id="faq-5-answer" className="hidden px-6 pb-6">
                <p className="text-gray-600">
                  Success comes from providing valuable content, engaging with your users, and consistently updating your app with fresh content. We provide guidance and best practices to help you succeed.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <button 
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                onClick={() => {
                  const answer = document.getElementById('faq-6-answer');
                  if (answer) {
                    answer.classList.toggle('hidden');
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">How do I remove my data from the app?</h3>
                  <svg className="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div id="faq-6-answer" className="hidden px-6 pb-6">
                <p className="text-gray-600">
                  You have full control over your data. You can export your data at any time, and if you decide to stop using the service, we'll help you remove all your data from our systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold">PlantPlanner</span>
            </div>
            <p className="text-gray-400 mb-8">
              We'd Love To Meet You
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
