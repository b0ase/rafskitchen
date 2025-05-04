import ClientSignupForm from "../components/ClientSignupForm";

export default function SignupPage() {
  return (
    <div className="w-full max-w-none mx-auto my-12 px-2 md:px-8">
      <section className="w-full bg-gradient-to-br from-blue-900/80 to-gray-900/80 rounded-xl shadow-lg p-4 md:p-12 text-white">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Welcome to B0ASE.COM</h1>
          <p className="text-lg mb-8">B0ASE is a full-service digital agency, blending creativity, technology, and strategy to help you build, launch, and grow your vision.</p>
          <p className="text-md text-blue-200 max-w-2xl mx-auto">We're passionate about partnering with founders, startups, and established brands to create digital experiences that inspire and deliver results. Share your ideas with us—no project is too big or too small. We can't wait to help you make it real.</p>
        </div>

        <div className="w-full">
          <h2 className="text-3xl font-bold mb-4 text-center">Start Your Project with B0ASE</h2>
          <p className="text-gray-300 text-center mb-8">
            Fill out the form below and tell us about your vision. The more details you share, the better we can help!
          </p>
          <ClientSignupForm />
        </div>
      </section>
    </div>
  );
} 