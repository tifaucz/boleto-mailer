import { ReactNode, createContext, useContext, useReducer } from "react";

export enum FileActionType {
  SET_FILE = 'SET_FILE',
  CLEAR_ERROR = 'CLEAR_ERROR',
  UPLOAD_FILE = 'UPLOAD_FILE',
  UPLOAD_SUCCESS = 'UPLOAD_SUCCESS',
  UPLOAD_FAILURE = 'UPLOAD_FAILURE'
}

type ReducerAction<T, P> = {
  type: T;
  payload?: Partial<P>;
};

type FileAction = ReducerAction<
  FileActionType,
  Partial<FileContextState>
>;

type FileDispatch = ({ type, payload }: FileAction) => void;

type FileContextState = {
  isLoading: boolean;
  file: File | null;
  fileList: File[];
  error?: string | null;
};

type FileContextType = {
  state: FileContextState;
  dispatch: FileDispatch;
};

type FileProviderProps = { children: ReactNode };

export const FileContextInitialValues: Partial<FileContextState> = {
  file: null,
  isLoading: false,
  fileList: []
};

const FileContext = createContext({} as FileContextType);

const uploadFile = async (file: File, dispatch: FileDispatch) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const data = {
      method: 'POST',
      body: formData,
    }
    console.log('uploadFile DATA', data);

    const response = await fetch('/upload', data);
    console.log('uploadFile RESPONSE', response);
    if (response.status == 200) {
      const responseBody = await response.text();
      console.log("UPLOAD_SUCCESS:", responseBody);
      dispatch({ type: FileActionType.UPLOAD_SUCCESS, payload: { file } });
    } else {
      const error = response.statusText as string;
      console.error('File upload failed:', response.status, error);
      dispatch({ type: FileActionType.UPLOAD_FAILURE, payload:{error} });
    }
  } catch (e) {
    const error = e as string;
    console.error('File upload failed:', error);
    dispatch({ type: FileActionType.UPLOAD_FAILURE, payload:{error} });
  }
};

const FileReducer = (
  state: FileContextState,
  action: FileAction,
): FileContextState => {
  console.log('FileReducer', state, action);

  switch (action.type) {
    case FileActionType.SET_FILE:
      if(!action.payload || !action.payload.file) { throw new Error('No payload provided for SET_FILE action')  }
      return {
        ...state,
        file: action.payload.file,
    };
    case 'UPLOAD_FILE':
      return {
        ...state, 
        isLoading: true 
    }
    case FileActionType.UPLOAD_SUCCESS:
      if(!action.payload || !action.payload.file) { throw new Error('No payload provided for UPLOAD_SUCCESS action')  }
      console.log('UPLOAD_SUCCESS', action.payload.file, state.fileList);
      return {
        ...state,
        fileList: [...state.fileList, action.payload.file as File],
        file: null,
        isLoading: false,
      };
    case FileActionType.UPLOAD_FAILURE:
      if(!action.payload || !action.payload.error) { throw new Error('No payload provided for UPLOAD_FAILURE action')  }
      return {
        ...state,
        file: null,
        isLoading: false,
        error: action.payload.error != "Bad Request" ? action.payload.error : "File not supported. Please check the CSV formatting."
      };
    case FileActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
    };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const FileProvider = ({ children }: FileProviderProps) => {
  const [state, dispatch] = useReducer(
    FileReducer,
    FileContextInitialValues as FileContextState,
  );

  return (
    <FileContext.Provider value={{ state, dispatch }}>
      {children}
    </FileContext.Provider>
  );
};

const useFileContext = () => {
  const context = useContext(FileContext);

  if (context === undefined)
    throw new Error("useFileContext must be used within a FileProvider");

  return context;
};

export { FileProvider, useFileContext, uploadFile };
