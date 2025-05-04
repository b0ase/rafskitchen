import ClientSignupForm from "../components/ClientSignupForm";

export default function SignupPage() {
  return (
    <div className="w-full max-w-none mx-auto my-12 px-2 md:px-8">
      <section className="w-full bg-gradient-to-br from-blue-900/80 to-gray-900/80 rounded-xl shadow-lg p-4 md:p-12 text-white">
        <div className="w-3/4 mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-8">Welcome to B0ASE</h1>
          <p className="text-lg mb-8">B0ASE is a full-service digital agency. We specialize in transforming ideas into powerful digital experiences—from sophisticated web applications and mobile solutions to blockchain innovations and AI-driven platforms.</p>
          
          <p className="text-md text-blue-200 mb-8">Our approach combines strategic thinking with cutting-edge technology to deliver results that matter. Whether you're a startup with a groundbreaking concept, an established brand seeking digital transformation, or an innovator exploring new technological frontiers—we're here to bring your vision to life.</p>
          
          <p className="text-md text-blue-200">Every project begins with understanding your unique goals and challenges. We believe in creating lasting partnerships, and our team is committed to guiding you through each step of the journey—from initial concept to successful launch and beyond.</p>
        </div>

        <div className="w-3/4 mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Tell Us About Your Vision</h2>
          <p className="text-gray-300 text-center mb-8">
            Share your project with us below. The more details you provide, the better we can understand and support your goals.
          </p>
          <ClientSignupForm />
        </div>
      </section>
    </div>
  );
} 