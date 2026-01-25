# Personal Portfolio Website

A modern, responsive personal portfolio website built with HTML, CSS, and JavaScript. This portfolio showcases skills, projects, and provides a contact form for potential clients and employers.

## Features

### 🏠 Home Page
- Eye-catching hero section with animated profile image
- Brief introduction and professional tagline
- Social media links (GitHub, LinkedIn, Twitter)
- Smooth scroll navigation
- Call-to-action buttons

### 👤 About Section
- Detailed professional bio
- Education and work experience timeline
- Hobbies and interests
- Interactive skill progress bars with animations
- Downloadable resume (PDF format)

### 💼 Projects Section
- Responsive project gallery with 6 featured projects
- Hover effects with overlay and "View Details" button
- Project modal with detailed information:
  - Full project description
  - Key features list
  - Technologies used
  - Links to GitHub repository and live demo
- Technology tags for quick reference

### 📧 Contact Section
- Fully functional contact form with JavaScript validation
- Real-time field validation
- Required fields: Name, Email, Subject, Message
- Email format validation
- Success modal on form submission
- Form data saved to localStorage
- Contact information display (Email, Phone, Location)
- Social media integration

### ✨ Interactive Features
- Smooth scrolling between sections
- Active navigation highlighting based on scroll position
- Mobile-responsive hamburger menu
- Hover effects on buttons and project cards
- Modal windows for projects and success messages
- Skill bar animations on scroll
- Responsive design for desktop, tablet, and mobile

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: 
  - Custom properties (CSS variables)
  - Flexbox and Grid layouts
  - Animations and transitions
  - Media queries for responsiveness
- **JavaScript (Vanilla)**:
  - DOM manipulation
  - Form validation
  - Smooth scrolling
  - Intersection Observer API
  - LocalStorage API
  - Event handling

## File Structure

```
project4/
│
├── index.html          # Main HTML file with all sections
├── styles.css          # Complete stylesheet with responsive design
├── script.js           # JavaScript for interactivity and validation
├── images/             # Profile and project images
│   └── profile.jpg
└── assets/             # Additional resources
    └── resume.pdf      # Downloadable resume
```

## How to Use

### Local Setup

1. **Clone or download** the project files to your local machine

2. **Add your profile image**:
   - Place your profile picture in the `images/` folder as `profile.jpg`
   - Recommended size: 400x400 pixels
   - If no image is provided, a placeholder will be generated automatically

3. **Add your resume**:
   - Place your resume PDF in the `assets/` folder as `resume.pdf`
   - Update the download link in `index.html` if using a different filename

4. **Customize the content**:
   - Update name, bio, and contact information in `index.html`
   - Modify education and work experience details
   - Replace placeholder projects with your actual projects
   - Update social media links with your profiles
   - Adjust skill percentages to match your proficiency

5. **Open the website**:
   - Simply open `index.html` in any modern web browser
   - No server setup required for local viewing

### Customization

#### Colors and Styling
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #f59e0b;
    /* Modify other colors as needed */
}
```

#### Projects
Update project details in `script.js`:
```javascript
const projectDetails = {
    '1': {
        title: 'Your Project Name',
        description: 'Project description...',
        features: ['Feature 1', 'Feature 2'],
        technologies: ['Tech 1', 'Tech 2'],
        github: 'your-github-link',
        demo: 'your-demo-link'
    }
    // Add more projects...
}
```

#### Contact Form
The contact form currently saves submissions to localStorage. To connect it to a backend:
1. Modify the `saveContactMessage()` function in `script.js`
2. Add AJAX/Fetch API call to your backend endpoint
3. Replace localStorage with actual email service integration

## Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Form Validation

The contact form includes comprehensive validation:
- **Name**: Minimum 2 characters
- **Email**: Valid email format (example@domain.com)
- **Subject**: Minimum 5 characters
- **Message**: Minimum 10 characters

Error messages appear in real-time as users type.

## Performance Features

- Lazy loading for images
- CSS animations for smooth user experience
- Intersection Observer for scroll-based animations
- Optimized for fast loading times
- Minimal external dependencies

## Deployment

### GitHub Pages
1. Upload all files to a GitHub repository
2. Go to repository Settings > Pages
3. Select main branch as source
4. Your site will be live at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop the project folder to Netlify
2. Site will be deployed automatically
3. Get a custom domain or use provided Netlify URL

### Web Hosting
Upload all files to your web hosting provider via FTP or file manager.

## Future Enhancements

- Blog section integration
- Dark mode toggle
- Multi-language support
- Backend integration for contact form
- Analytics integration
- Additional project filtering options
- Testimonials section
- Certificate gallery

## Credits

- Profile image placeholder: UI Avatars API
- Project images: Unsplash
- Icons: Inline SVG
- Fonts: System fonts (Segoe UI)

## License

This project is open source and available for personal and commercial use.

## Contact

For questions or suggestions about this portfolio template:
- Email: suyash.singh@example.com
- GitHub: [Your GitHub Profile]
- LinkedIn: [Your LinkedIn Profile]

---

**Note**: Remember to update all placeholder content with your actual information before deploying!
