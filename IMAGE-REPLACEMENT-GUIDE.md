# Image Replacement Guide

## How to Replace Placeholder Images with Your Photos

### 1. **Hero Section Phone Photo**
**Location:** Hero section (top of page)
**Current placeholder:** `/api/placeholder/400/600`
**Replace with:** Your hero phone photo
**Recommended size:** 400x600px or similar aspect ratio

### 2. **Benefits Section Phone Photo**
**Location:** "Why switch to an App?" section
**Current placeholder:** `/api/placeholder/400/600`
**Replace with:** Your meal planning phone photo
**Recommended size:** 400x600px or similar aspect ratio

### 3. **Features Section Phone Photos (4 photos)**
**Location:** "Proven performance" section
**Current placeholders:** `/api/placeholder/300/400`

Replace these with your app feature photos:
- **Meal Planning:** `/api/placeholder/300/400` → Your meal planning feature photo
- **Recipe Details:** `/api/placeholder/300/400` → Your recipe details feature photo  
- **Grocery List:** `/api/placeholder/300/400` → Your grocery list feature photo
- **Recipe Box:** `/api/placeholder/300/400` → Your recipe box feature photo

**Recommended size:** 300x400px or similar aspect ratio

### 4. **Testimonial Photos (3 photos)**
**Location:** "And they seem to love us" section
**Current placeholders:** `/api/placeholder/48/48`

Replace these with testimonial photos:
- **Lissa Marris:** `/api/placeholder/48/48` → Lissa Marris photo
- **Lauren & Partner:** `/api/placeholder/48/48` → Lauren & Partner photo
- **Dusty & Erin Stanczyk:** `/api/placeholder/48/48` → Dusty & Erin Stanczyk photo

**Recommended size:** 48x48px (circular, will be automatically cropped)

## How to Replace Images

### Option 1: Replace in Code
1. Add your images to the organized folders in your project:
   - **Hero images:** `public/images/hero/`
   - **Feature images:** `public/images/features/`
   - **Testimonial images:** `public/images/testimonials/`

2. Update the `src` attributes in the code:
   ```jsx
   // Change this:
   src="/api/placeholder/400/600"
   
   // To this:
   src="/images/hero/your-hero-image.jpg"
   src="/images/features/your-feature-image.jpg"
   src="/images/testimonials/your-testimonial-image.jpg"
   ```

### Option 2: Use Supabase Storage
1. Upload your images to Supabase Storage
2. Update the `src` attributes to use Supabase URLs:
   ```jsx
   // Change this:
   src="/api/placeholder/400/600"
   
   // To this:
   src="https://your-project.supabase.co/storage/v1/object/public/recipe-images/your-image.jpg"
   ```

## Image Optimization Tips

- **Compress images** before uploading to reduce file size
- **Use WebP format** for better compression (modern browsers support it)
- **Keep file sizes under 500KB** for faster loading
- **Use consistent aspect ratios** for a professional look

## Navigation Links

The navigation now works with these sections:
- **Product** → `#features` (Proven performance section)
- **Testimonials** → `#testimonials` (And they seem to love us section)
- **Benefits** → `#benefits` (Why switch to an App section)
- **About Us** → `#about` (More About Us section)
- **Pricing** → `#pricing` (Pricing Packages section)
- **FAQ's** → `#faq` (FAQ section)

All navigation links now smoothly scroll to their respective sections on the page!
