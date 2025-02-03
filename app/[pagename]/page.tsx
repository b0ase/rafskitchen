import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '[Page Name] | b0ase.com',
  description: '[Page description]',
};

export default function PageName() {
  return (
    <div>
      <h1>[Page Name]</h1>
      <p>Content goes here</p>
    </div>
  );
}
