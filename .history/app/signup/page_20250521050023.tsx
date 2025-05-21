import ClientSignupForm from "../components/ClientSignupForm";
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
      <section className="bg-black p-8 md:p-12 border border-gray-800 shadow-2xl rounded-lg text-center w-full my-12">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl mb-12 border border-gray-700">
          <div className="w-full mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-white mb-8">Welcome to B0ASE</h1>
            <p className="text-lg text-gray-400 mb-8">We are a full-service digital agency who specializes in transforming ideas into powerful digital experiences—from sophisticated web applications and mobile solutions to blockchain innovations and AI-driven platforms.</p>
            
            <p className="text-md text-gray-400 mb-8">Our approach combines strategic thinking with cutting-edge technology to deliver results that matter. Whether you're a startup with a groundbreaking concept, an established brand seeking digital transformation, or an innovator exploring new technological frontiers—we're here to bring your vision to life.</p>
            
            <p className="text-md text-gray-400">Every project begins with understanding your unique goals and challenges. We believe in creating lasting partnerships, and our team is committed to guiding you through each step of the journey—from initial concept to successful launch and beyond.</p>

            {/* Social Links - Added */}
            <div className="mt-8 flex justify-center space-x-6">
              {/* Add social icons and links here, mapping over data from lib/data.ts */}
              {/* Example for GitHub, you'll need to add others */} 
              <a href="https://github.com/b0ase" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="h-6 w-6" />
              </a>
               <a href="https://www.linkedin.com/in/richardboase/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="h-6 w-6" />
              </a>
               <a href="https://x.com/b0ase" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="h-6 w-6" />
              </a>
               <a href="https://www.youtube.com/@richardboase" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube className="h-6 w-6" />
              </a>
               {/* You may want to add others from lib/data.ts as needed */}
            </div>
          </div>
        </div>

        <div className="w-full mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center text-white">Tell Us About Your Vision</h2>
          <p className="text-gray-400 text-center mb-8">
            Share your project with us below. The more details you provide, the better we can understand and support your goals.
          </p>
          <ClientSignupForm />
        </div>
      </section>
    </div>
  );
} 