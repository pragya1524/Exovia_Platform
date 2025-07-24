import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload as UploadIcon, 
  FileSpreadsheet, 
  CheckCircle, 
  CloudUpload,
  FileText,
  BarChart3,
  Sparkles,
  ArrowRight,
  Zap,
  Database,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { uploadExcelFile } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv',
      'text/plain',
    ];
    const validExtensions = ['.xls', '.xlsx', '.csv'];
    
    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    return hasValidType || hasValidExtension;
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a valid Excel file (.xls or .xlsx)',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    try {
      await uploadExcelFile(file);
      setUploadedFile(file);
      toast({
        title: 'File Uploaded Successfully',
        description: `${file.name} has been processed and is ready for analysis.`,
        // You don't need to specify a color here if you've set your toasts to brown in Toast.tsx!
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "AI-powered insights from your data",
    },
    {
      icon: Database,
      title: "Secure Processing",
      description: "Your data is processed securely",
    },
    {
      icon: TrendingUp,
      title: "Real-time Charts",
      description: "Create beautiful visualizations instantly",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data never leaves your control",
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-[#6D4C41] via-[#5D4037] to-[#4E342E] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Upload Your Data 📁</h1>
              <p className="text-brown-100">Transform Excel files into stunning visualizations</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-lg bg-[#FAF3E0]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#6D4C41] to-[#5D4037] rounded-lg flex items-center justify-center">
              <UploadIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-[#3E2723]">File Upload</CardTitle>
              <p className="text-sm text-[#5D4037]">Drag & drop or click to upload</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-in-out
              ${isDragging ? 'border-[#5D4037] bg-[#EFEBE9] scale-105' : 'border-[#D7CCC8] hover:border-[#5D4037] hover:scale-[1.02]'}
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-6">
              <div className={`
                w-20 h-20 bg-gradient-to-r from-[#6D4C41] to-[#5D4037] rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-all duration-300
                ${isDragging ? 'scale-110 rotate-12' : 'hover:scale-105'}
              `}>
                <UploadIcon className="w-10 h-10 text-white" />
              </div>
              
              {!uploadedFile ? (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[#3E2723]">
                      {isUploading ? 'Processing your file...' : 'Drop your Excel file here'}
                    </h3>
                    <p className="text-[#5D4037]">or click to browse your files</p>
                  </div>
                  
                  {isUploading && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#5D4037] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[#5D4037]">Processing...</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      {/* CHANGED: bg-green-600 => bg-[#6D4C41], text-green-700 => text-[#6D4C41], text-green-600 => text-[#5D4037] */}
                      <div className="w-16 h-16 bg-[#6D4C41] rounded-2xl flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-[#6D4C41]">
                          File Uploaded Successfully!
                        </h3>
                        <p className="text-[#5D4037]">Ready for analysis</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 p-3 bg-[#EFEBE9] rounded-lg">
                      <FileSpreadsheet className="w-5 h-5 text-[#5D4037]" />
                      <span className="text-[#3E2723] font-medium">{uploadedFile.name}</span>
                    </div>
                  </div>
                </>
              )}

              <input
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              
              {!uploadedFile && (
                <label htmlFor="file-upload">
                  <Button 
                    className="h-12 px-8 bg-gradient-to-r from-[#6D4C41] to-[#5D4037] hover:from-[#5D4037] hover:to-[#4E342E] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    disabled={isUploading}
                    asChild
                  >
                    <span className="cursor-pointer flex items-center gap-2">
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <UploadIcon className="w-5 h-5" />
                          Choose File
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              )}
            </div>
          </div>

          {uploadedFile && (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={() => navigate('/analytics')}
                className="h-12 px-8 bg-[#6D4C41] hover:bg-[#5D4037] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  Start Creating Charts
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-[#FAF3E0]">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#6D4C41] to-[#5D4037] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#3E2723] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#5D4037]">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Upload;
