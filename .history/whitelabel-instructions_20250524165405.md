# Whitelabelling Plan for "rafskitchen.website"

## 1. Initial Setup

1. Fork the repository and rename it
   - Create a new repository named "rafskitchen" on GitHub/GitLab
   - Clone the existing b0ase repo and push to the new repository
   ```bash
   git clone https://github.com/b0ase/b0ase.git rafskitchen
   cd rafskitchen0
   git remote remove origin
   git remote add origin https://github.com/b0ase/rafskitchen.git
   git push -u origin main
   ```

2. Setup development environment
   - Clone the new repository to your local machine
   - Install dependencies
   ```bash
   git clone https://github.com/b0ase/rafskitchen.git
   cd rafskitchen
   npm install
   ```

## 2. Brand and Content Removal

1. Update package.json
   ```json
   {
     "name": "rafskitchen",
     "version": "1.0.0",
     "private": true,
     ...
   }
   ```

2. Update metadata and title configurations
   - Edit app/metadata.ts:
   ```typescript
   import { Metadata } from 'next';

   export const metadata: Metadata = {
     title: {
       default: 'Raf\'s Kitchen',
       template: '%s | Raf\'s Kitchen',
     },
     metadataBase: new URL('https://rafskitchen.website'),
     description: 'Raf\'s Kitchen - Culinary experiences and recipes',
     openGraph: {
       title: 'Raf\'s Kitchen',
       description: 'Discover culinary experiences and recipes at Raf\'s Kitchen',
       images: [`/api/og?title=Raf\'s Kitchen`],
     },
     twitter: {
       card: 'summary_large_image',
     },
   };
   ```

   - Edit app/layout.tsx:
   ```typescript
   export const metadata: Metadata = {
     title: 'Raf\'s Kitchen | Culinary Experiences & Recipes',
     description: 'Discover culinary experiences and recipes at Raf\'s Kitchen.',
   };
   ```

3. Replace logo and brand assets
   - Replace logo-dark.png and b0ase.png in root directory with new rafskitchen logos
   - Create/add new logos for Raf's Kitchen
   - Update any references to these images in components

4. Remove brand-specific content
   - Search for all instances of "b0ase", "boase", and "b0ase.com" in the codebase:
   ```bash
   grep -r "b0ase" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" --include="*.json" .
   grep -r "boase" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" --include="*.json" .
   grep -r "b0ase.com" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" --include="*.json" .
   ```
   - Replace with "rafskitchen" or "Raf's Kitchen" as appropriate
   - Pay special attention to:
     - Navigation components
     - Footer
     - Page titles
     - Meta descriptions
     - OG tags

5. Clear content pages
   - Identify key content pages (homepage, about, etc.)
   - Replace with generic placeholder content while preserving structure
   - Edit app/page.tsx to have generic landing page content

## 3. Supabase Database Setup

1. Create new Supabase project
   - Sign up/login to Supabase at https://supabase.com
   - Create new project named "rafskitchen"
   - Select a region close to your target audience
   - Note down the URL and API keys (public anon key and secret key)

2. Set up environment variables
   - Create .env.local file with new Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   - Add the same environment variables to your hosting platform

3. Migrate database schema
   - Export schema from original database (without data):
     - Use Supabase migration tools or manually export SQL schema
     - Or use Supabase Studio to view and recreate tables
   - Steps to recreate schema:
     - Identify all tables in the original database
     - Note table structures, relationships, and indexes
     - Create tables with the same structure in the new database
     - Set up foreign key relationships
     - Create necessary indexes

4. Set up authentication
   - Configure authentication providers in Supabase dashboard
   - Set up email authentication at minimum
   - Set up email templates for authentication emails
   - Test authentication flow by creating a test user

## 4. Configuration Updates

1. Update Next.js configuration
   - Edit next.config.js to add any necessary domains for images:
   ```javascript
   images: {
     domains: ['picsum.photos', 'rafskitchen.website'],
   },
   ```

2. Update navigation and routing
   - Check and update navigation components:
     - app/components/AppNavbar.tsx
     - app/components/UserSidebar.tsx
     - Any other navigation components
   - Update routes/links to reflect new site structure
   - Remove any routes specific to b0ase (like b0aseblueprint)

3. Tailwind configuration
   - Edit tailwind.config.js/ts to match new branding:
   ```javascript
   theme: {
     extend: {
       colors: {
         primary: '#YOUR_PRIMARY_COLOR',
         secondary: '#YOUR_SECONDARY_COLOR',
         // Add other brand colors
       },
       // Other theme customizations
     },
   }
   ```

## 5. Testing

1. Local testing
   - Run the development server:
   ```bash
   npm run dev
   ```
   - Test site functionality locally
   - Test all major user flows:
     - Authentication (signup, login, password reset)
     - Navigation
     - Any core functionality
   - Check for any remaining brand references

2. Database interaction testing
   - Test CRUD operations:
     - Create new records
     - Read existing records
     - Update records
     - Delete records
   - Verify data is properly stored and retrieved
   - Check that relationships between tables work correctly

3. Responsive design testing
   - Test on multiple devices and screen sizes
   - Use browser dev tools to simulate different devices
   - Test on actual mobile devices if possible
   - Ensure new branding works across all breakpoints

## 6. Deployment

1. Set up hosting
   - Create account on Vercel (recommended for Next.js)
   - Connect to your GitHub/GitLab repository
   - Configure project settings:
     - Environment variables
     - Build settings
     - Domain settings
   - Add custom domain "rafskitchen.website"

2. Deploy application
   - Deploy from repository through Vercel dashboard
   - Set environment variables:
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY
     - SUPABASE_SERVICE_ROLE_KEY
     - Other environment variables as needed
   - Set up continuous deployment

3. DNS configuration
   - Point rafskitchen.website domain to Vercel:
     - Go to your domain registrar
     - Update nameservers or create A/CNAME records as instructed by Vercel
   - Verify SSL certificates are correctly set up
   - Ensure www subdomain is configured correctly (redirect or serve site)

## 7. Post-Deployment

1. Final testing
   - Verify all functionality works in production
   - Test on multiple devices and browsers
   - Check loading speed and performance
   - Verify authentication flows work in production

2. Documentation
   - Create basic documentation for the site
   - Document:
     - How to update content
     - How to manage users
     - How to deploy changes
     - Any custom functionality

3. Handover
   - Provide access to:
     - GitHub/GitLab repository
     - Vercel (or other hosting platform)
     - Supabase project
   - Brief the client on how to maintain and update the site
   - Provide support contact information
   - Schedule a training session if needed

## 8. Specific Areas Requiring Attention

1. Replace all b0ase-specific routes and components:
   - Look for directories like `/app/boasetoken/` and other brand-specific routes
   - Replace or remove these entirely as needed

2. Check and update all API endpoints
   - Ensure they work with the new Supabase instance
   - Update any hardcoded URLs or references

3. Review and update middleware.ts
   - Ensure authentication and routing logic works with new branding
   - Update any path-specific rules that might reference the old brand

4. Look for brand references in less obvious places:
   - Error messages
   - Email templates 
   - Log messages
   - API documentation
   - Comments in code

5. Update favicon and browser tab icons:
   - Replace favicon.ico
   - Update any manifest files for PWA support if present

## 9. Maintenance Plan

1. Regular updates
   - Keep dependencies updated
   - Regularly check for security issues
   - Plan for periodic feature updates

2. Monitoring
   - Set up error monitoring (e.g., Sentry)
   - Set up performance monitoring
   - Monitor database usage and performance

3. Backup strategy
   - Set up regular database backups
   - Document restoration procedures
   - Test backups periodically 