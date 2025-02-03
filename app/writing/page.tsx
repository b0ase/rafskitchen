import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing | b0ase.com',
  description: 'Writing and articles',
};

export default function WritingPage() {
  return (
    <div>
      <h1>Writing</h1>
      <p>Welcome to my writing collection.</p>
    </div>
  );
}
