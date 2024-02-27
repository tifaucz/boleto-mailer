import { useFileContext, FileActionType, uploadFile } from './file'

const FileUploader = () => {
  const { state, dispatch } = useFileContext();
  const { file, isLoading, error } = state;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      dispatch({ type: FileActionType.SET_FILE, payload: { file: files[0] } }); 
    }
  }

  const handleUpload = () => {
    if (file) {
      dispatch({ type: FileActionType.UPLOAD_FILE, payload: { file } });
      uploadFile(file, dispatch).catch((error) => {
        console.error('Error during file upload:', error);
        dispatch({ type: FileActionType.UPLOAD_FAILURE });
      });
    }
  }

  const handleCloseError = () => {
    dispatch({ type: FileActionType.CLEAR_ERROR });
  };

  return (
    <div className = "flex flex-col gap-6 w-full text-center">
      <div>
        <label htmlFor="file" className="sr-only">
          Choose a file
        </label>
        {!file && <input id="file" className="rounded-lg bg-blue-800 text-white px-4 py-2 border-none font-semibold" type="file" onChange={handleFileChange} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" />}
        {file && !isLoading && <button onClick={handleUpload} className="rounded-lg bg-green-800 text-white px-4 py-2 border-none font-semibold">
        Upload the file
      </button>}
      </div>
      
      <section className = "text-left p-10">
        <p className="pb-6">File details:</p>
        <ul>
          <li>Name: {file && file.name}</li>
          <li>Type: {file && file.type}</li>
          <li>Size: {file && file.size} bytes</li>
        </ul>
      </section>

      {isLoading && (
        <dialog open className="fixed inset-0 z-50 bg-green-500 text-white rounded-lg p-4 max-h-sm max-w-sm m-auto">
          <div className="flex items-center justify-center">
            <div>
            <p className="animate-pulse">Uploading your file...</p>
            </div>
          </div>
        </dialog>
      )}

      {error && (
        <dialog open className="fixed inset-0 z-50 bg-red-500 text-white rounded-lg p-4 max-h-sm max-w-sm m-auto">
          <div className="flex items-center justify-center">
            <div>
              <p>Error: {error}</p>
              <button
                onClick={handleCloseError}
                className="mt-4 bg-red-700 text-white rounded-lg px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export { FileUploader };
