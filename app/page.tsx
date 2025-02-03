import { Metadata } from 'next';
import { Boundary } from '#/ui/boundary';

export const metadata: Metadata = {
  title: 'Index | b0ase.com',
  description: 'b0ase.com home page',
};

export default function IndexPage() {
  return (
    <Boundary labels={['index']} color="violet">
      <div className="space-y-4">
        <h1 className="text-xl font-medium text-gray-400/80">Index</h1>
        <p className="text-gray-400">Welcome to b0ase.com</p>
      </div>
    </Boundary>
  );
}
