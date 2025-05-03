import ClientSignupForm from "../components/ClientSignupForm";

export default function SignupPage() {
  return (
    <div className="w-full max-w-none mx-auto my-12 px-2 md:px-8">
      <section className="mb-8 w-full bg-gradient-to-br from-blue-900/80 to-gray-900/80 rounded-xl shadow-lg p-4 md:p-12 text-white text-center">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to B0ASE.COM</h1>
        <p className="text-lg mb-4">B0ASE is a full-service digital agency, blending creativity, technology, and strategy to help you build, launch, and grow your vision.</p>
        <ul className="flex flex-wrap justify-center gap-4 text-base mb-4">
          <li className="bg-blue-800/60 px-4 py-2 rounded">Web & App Development</li>
          <li className="bg-blue-800/60 px-4 py-2 rounded">Branding & Design</li>
          <li className="bg-blue-800/60 px-4 py-2 rounded">Marketing & Growth</li>
          <li className="bg-blue-800/60 px-4 py-2 rounded">Blockchain & Tokenization</li>
          <li className="bg-blue-800/60 px-4 py-2 rounded">AI & Automation</li>
          <li className="bg-blue-800/60 px-4 py-2 rounded">Consulting & Strategy</li>
        </ul>
        <p className="text-md text-blue-200 max-w-2xl mx-auto">We're passionate about partnering with founders, startups, and established brands to create digital experiences that inspire and deliver results. Share your ideas with us—no project is too big or too small. We can't wait to help you make it real.</p>
      </section>
      <div className="w-full">
        <ClientSignupForm />
      </div>
    </div>
  );
} 