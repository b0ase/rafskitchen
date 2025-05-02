import ClientForm from '../components/ClientForm';

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-start py-12">
      <h1 className="text-3xl font-bold mb-8">Clients</h1>
      <ClientForm />
    </div>
  );
} 