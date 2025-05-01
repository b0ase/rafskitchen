'use client';

import Link from 'next/link'; // Use Next.js Link for internal navigation
// import { useMenu } from '../context/MenuContext'; // Remove MenuContext dependency

// --- Icon Components --- 
// (Moved from page.tsx and added new ones)
const GitHubIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>;
const XIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LinkedInIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const YouTubeIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>;
const TelegramIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z"/></svg>;
const EmailIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>;
const WhatsAppIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 0C5.49 0 0 5.5 0 12.18c0 2.17.56 4.24 1.65 6.07L0 24l6.01-1.61c1.79.99 3.8 1.53 5.94 1.53h.01c6.64 0 12-5.4 12-12.09S18.69 0 12.04 0zm6.01 14.94c-.26.49-.54.93-.88 1.3-.41.43-1.06.77-1.8.95-.8.19-1.73.22-2.74-.04-.76-.19-1.88-.62-3.64-1.9-1.85-1.33-3.24-3.1-4.1-5.1-.58-1.35-.8-2.8-.79-4.28.02-1.3.35-2.48 1-3.47.4-.6.95-.95 1.6-1.1.73-.17 1.45-.15 2.06.06.52.18.9.43 1.19.75.3.31.48.69.61 1.12.13.43.13.87.08 1.31-.09.75-.39 1.41-.8 1.96-.23.32-.47.63-.7.94l-.25.31c-.08.1-.13.2-.15.3-.02.1-.02.2.01.3.06.25.23.55.49.88.3.39.66.79 1.08 1.2.47.45.97.83 1.5 1.1.35.18.7.3 1.03.36.12.02.24.04.36.04.1 0 .19-.01.28-.03.09-.02.18-.05.26-.09.28-.14.53-.33.73-.56.3-.34.56-.75.75-1.22.12-.29.23-.59.32-.89.2-.69.57-1.18 1.08-1.43.41-.2.86-.25 1.3-.15.56.12 1.06.44 1.44.9.38.45.59.99.59 1.57 0 .63-.18 1.23-.5 1.77z"/></svg>;
// --- End Icon Components ---

// Helper function to generate icon links
const createIconLink = (key: string, href: string, Icon: React.FC) => {
  return (
    <li key={key}>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
        <Icon />
      </a>
    </li>
  );
}

export default function Navigation() {
  // const { isMenuOpen, setIsMenuOpen } = useMenu(); // Remove state related to old menu

  // Define navigation links for the TOP navigation bar
  const textLinks = [
    { name: 'Studio', href: '/studio' },
    { name: 'Token', href: '/token' },
  ];

  // Define icon links (Hardcoded URLs for now)
  const iconLinks = [
    { key: 'github', href: 'https://github.com/b0ase', Icon: GitHubIcon },
    { key: 'linkedin', href: 'https://www.linkedin.com/in/richardboase/', Icon: LinkedInIcon },
    { key: 'x', href: 'https://x.com/b0ase', Icon: XIcon },
    { key: 'youtube', href: 'https://www.youtube.com/@richardboase', Icon: YouTubeIcon },
    // { key: 'telegram', href: '#', Icon: TelegramIcon }, // Omitted Telegram
    { key: 'email', href: 'mailto:richardwboase@gmail.com', Icon: EmailIcon }, 
    { key: 'whatsapp', href: 'https://wa.me/447412922288', Icon: WhatsAppIcon }, 
  ];

  return (
    // Simple horizontal navigation
    <nav>
      {/* Combine text and icon links */}
      <ul className="flex items-center space-x-4 md:space-x-6">
        {/* Render Text Links */}
        {textLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base"
              legacyBehavior>
              {link.name}
            </Link>
          </li>
        ))}
        
        {/* Separator (Optional) */}
        {textLinks.length > 0 && iconLinks.length > 0 && (
          (<li className="h-4 border-l border-gray-700 mx-2"></li>) // Added margin to separator
        )}

        {/* Render Icon Links */}
        {iconLinks.map(linkInfo => 
          linkInfo.href && linkInfo.href !== '#' 
            ? createIconLink(linkInfo.key, linkInfo.href, linkInfo.Icon)
            : null
        )}
      </ul>
      {/* Remove old menu overlay logic */}
    </nav>
  );
} 