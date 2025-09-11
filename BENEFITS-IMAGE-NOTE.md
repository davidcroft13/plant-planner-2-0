# Benefits Section Image Upload

## Missing Image
You still need to upload an image for the **"Why switch to an App?"** section.

## Where to upload:
- **Folder:** `public/images/benefits/`
- **Current placeholder:** The section still shows `/api/placeholder/400/600`

## How to update:
1. Upload your image to `public/images/benefits/`
2. Update the code in `src/pages/LandingPage.tsx` around line 125:
   ```jsx
   // Change this:
   src="/api/placeholder/400/600"
   
   // To this:
   src="/images/benefits/your-image-name.jpg"
   ```

## Recommended image:
- **Size:** 400x600px or similar aspect ratio
- **Content:** Your app showing the benefits/meal planning features
- **Format:** JPG, PNG, or WebP
