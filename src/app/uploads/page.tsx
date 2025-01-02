"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import { texts } from "@/locales";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface UploadedFile {
    id: number;
    name: string;
    size: number;
    type: string;
    uploadDate: string;
    uploader: string | null;
    preview?: string; // URL preview image
  }

export default function UploadsPage() {
    const { user } = useUser();
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // status loading

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
        const uploadedFiles = Array.from(event.target.files || []);
        const maxFileSize = 5 * 1024 * 1024; // 5 MB en octets
        const invalidReasons: string[] = [];
        const validFiles: UploadedFile[] = [];
        setIsLoading(true);


        for (const file of uploadedFiles) {
            if (file.size > maxFileSize) {
              invalidReasons.push(`${file.name} : File size should not exceed 5 MB.`);
            } else if (!acceptedTypes.includes(file.type)) {
              invalidReasons.push(`${file.name} : The file type is not allowed.`);
            } else {
              const newFile: UploadedFile = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toLocaleString(),
                uploader: user?.email ?? null,
              };

              // If it's an image, generate a preview
              if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  newFile.preview = e.target?.result as string;
                  setFiles((prev) => [...prev, newFile]);
                };
                reader.readAsDataURL(file);
              } else {
                validFiles.push(newFile);
              }
            }
          }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Add valid files to the report
        setFiles((prev) => [...prev, ...validFiles]);

        // Show errors if invalid files exist
        if (invalidReasons.length > 0) {
          setError(invalidReasons.join(" "));
        }
      };

    const handleFileDelete = (id: number) => {
        setFiles(files.filter((file) => file.id !== id));
        setIsLoading(false);
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">{texts.uploads.title}</h1>
            {user?.role === "admin" || user?.role === "uploader" ? (
                <>
                    <input
                        type="file"
                        accept=".jpeg,.png,.gif,.pdf"
                        multiple
                        onChange={handleFileUpload}
                        className="mb-4 border px-4 py-2 rounded"
                    />
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                </>
            ) : (null)}

            {/* table list file uploads */}
            <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">{texts.uploads.table.fileName}</th>
                        <th className="border border-gray-300 px-4 py-2">{texts.uploads.table.date}</th>
                        <th className="border border-gray-300 px-4 py-2">{texts.uploads.table.uploader}</th>
                        {user?.role === "admin" || user?.role === "uploader" ? (
                            <th className="border border-gray-300 px-4 py-2">{texts.uploads.table.actions}</th>
                        ) : null}
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <tr key={file.id}>
                            <td className="border border-gray-300 px-4 py-2 flex items-center content-start">
                                {file.preview ? (
                                    <img
                                        src={file.preview}
                                        alt={file.name}
                                        className="w-8 h-8 object-cover mr-2"
                                    /> ) : null}
                                    <p >{file.name}</p></td>
                            <td className="border border-gray-300 px-4 py-2">{file.uploadDate}</td>
                            <td className="border border-gray-300 px-4 py-2">{file.uploader}</td>
                            {user?.role === "admin" || user?.role === "uploader" ? (
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleFileDelete(file.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    <FontAwesomeIcon icon={faTrash} style={{ marginRight: '10px' }} />
                                    {texts.uploads.btnDelete}
                                </button>
                            </td>
                            ) : null}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
}
