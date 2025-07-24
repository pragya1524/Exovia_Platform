import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { Loader2, FileText, Trash2, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

interface Analysis {
  _id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  analysisType: string;
  status: 'pending' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AnalysisHistory() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalysisHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analysis/history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch analysis history');
        
        const data = await response.json();
        setAnalyses(data.analyses || []);
      } catch (error) {
        console.error('Error fetching analysis history:', error);
        toast({
          title: "Error",
          description: "Failed to load analysis history",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisHistory();
  }, [toast]);

  const deleteAnalysis = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/analysis/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete analysis');

      setAnalyses(analyses.filter(analysis => analysis._id !== id));
      toast({
        title: "Success",
        description: "Analysis deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast({
        title: "Error",
        description: "Failed to delete analysis",
        variant: "destructive"
      });
    }
  };

  const downloadResult = (analysis: Analysis) => {
    if (!analysis.result) return;
    
    const blob = new Blob([JSON.stringify(analysis.result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.fileName}_result.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Analysis History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          {analyses.length === 0 ? (
            <p className="text-center text-gray-500">No analysis history found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Analysis Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.map((analysis) => (
                  <TableRow key={analysis._id}>
                    <TableCell className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {analysis.fileName}
                    </TableCell>
                    <TableCell>{analysis.fileType}</TableCell>
                    <TableCell>{(analysis.fileSize / 1024).toFixed(2)} KB</TableCell>
                    <TableCell>{analysis.analysisType}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          analysis.status === 'completed'
                            ? 'default'
                            : analysis.status === 'failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {analysis.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {analysis.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadResult(analysis)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAnalysis(analysis._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 