import { Poppins } from 'next/font/google'; 
import './globals.css';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'], 
  variable: '--font-poppins',
});

export const metadata = {
  title: 'LearnX - Modern Tuition Platform',
  description: 'Connect with expert tutors and master your exams',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${poppins.className} antialiased`} 
      >
        {children}
      </body>
    </html>
  );
}
