import React from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Editor />
      <Preview />
    </div>
  );
}