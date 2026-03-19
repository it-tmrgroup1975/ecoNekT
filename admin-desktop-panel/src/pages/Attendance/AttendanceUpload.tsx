import { useState } from 'react';
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import api from '../../api/axios';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export const AttendanceUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("กรุณาเลือกไฟล์ก่อน");

    setIsUploading(true); // เริ่มสถานะการอัปโหลด
    const formData = new FormData();
    formData.append('excel_file', file);

    try {
      const response = await api.post('/attendance/import-excel/', formData);
      toast.success(response.data.message);
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setIsUploading(false); // สิ้นสุดสถานะการอัปโหลด
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Upload className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-slate-800">นำเข้าเวลาทำงาน (ZKTeco)</h3>
      </div>
      
      <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
        <Input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".xlsx, .xls"
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium text-slate-700">{file.name}</span>
          </div>
        ) : (
          <div className="text-slate-400">
            <p>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</p>
            <p className="text-xs mt-1">รองรับเฉพาะไฟล์ .xlsx และ .xls จากเครื่องสแกน</p>
          </div>
        )}
      </div>

      <Button 
        className="w-full" 
        disabled={!file || isUploading}
        onClick={handleUpload}
      >
        {isUploading ? "กำลังประมวลผล..." : "เริ่มนำเข้าข้อมูล"}
      </Button>
    </div>
  );
};