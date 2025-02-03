import { Metadata } from 'next';
import { Boundary } from '#/ui/boundary';

export const metadata: Metadata = {
  title: 'Art | b0ase.com',
  description: 'Art projects and gallery',
};

export default function ArtPage() {
  return (
    <Boundary labels={['art']} color="violet">
      <div className="space-y-4">
        <h1 className="text-xl font-medium text-gray-400/80">Art</h1>
        <p className="text-gray-400">Welcome to my art gallery.</p>
      </div>
    </Boundary>
  );
}
