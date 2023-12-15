import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    if (file == null) {
      return;
    }
    let uploadUrl: string | null = null;
    // Get the presigned URL
    try {
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      });
      uploadUrl = response.data;
    } catch (err: any) {
      console.log('failed to get signed URL');
      console.error(err);
      const status = err.response.status;
      if (status == 401) {
        alert('Error 401. Authorization token was not provided');
      } else if (status == 403) {
        alert('Error 403. Authorization token is invalid');
      }
    }

    if (!uploadUrl) {
      return;
    }

    console.log("File to upload: ", file.name);
    console.log("Uploading to: ", uploadUrl);
    const result = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });
    console.log("Result: ", result);
    setFile(undefined);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
