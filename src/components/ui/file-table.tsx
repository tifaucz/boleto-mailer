// import React from 'react';
import { useFileContext } from './file';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table';

const FileListTable = () => {
  const { state } = useFileContext();
  const { fileList } = state;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size (bytes)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fileList.map((file, index) => (
          <TableRow key={index}>
            <TableCell>{file.name}</TableCell>
            <TableCell>{file.type}</TableCell>
            <TableCell>{file.size}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { FileListTable };
