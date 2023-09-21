import { Sidebar } from "@/components/layout/sidebar";
import { UploadDropzone } from "@/components/upload/upload-dropzone";

export default function UploadPage() {
  return <div className="flex"><Sidebar /><main className="w-full p-6 lg:p-10"><h1 className="mb-6 text-3xl font-bold">Upload imaging study</h1><UploadDropzone /></main></div>;
}
