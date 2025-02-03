import { Metadata } from 'next';
import { Boundary } from '#/ui/boundary';

export const metadata: Metadata = {
  title: 'Photography | b0ase.com',
  description: 'Photography portfolio and projects',
};

export default function PhotographyPage() {
  return (
    <Boundary labels={['photography']} color="blue">
      <div className="space-y-4">
        <h1 className="text-xl font-medium text-gray-400/80">Photography</h1>
        <p className="text-gray-400">Photography content coming soon.</p>
      </div>
    </Boundary>
  );
}
