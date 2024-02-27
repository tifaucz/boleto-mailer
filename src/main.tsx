import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FileProvider } from './components/ui/file';
import { FileUploader } from './components/ui/file-uploader';
import { FileListTable } from './components/ui/file-table';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter >
    <div className="h-screen w-screen bg-zinc-800 text-white gap-6 flex flex-1 flex-col items-center justify-start p-10">
    <FileProvider>
      <FileUploader />
      <FileListTable />
    </FileProvider>
    </div>
    </BrowserRouter>
  </React.StrictMode>,
)
