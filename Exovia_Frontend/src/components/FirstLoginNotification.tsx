import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X, Sparkles, BarChart3, Upload, MessageSquare } from 'lucide-react';

interface FirstLoginNotificationProps {
  onDismiss: () => void;
}

export const FirstLoginNotification: React.FC<FirstLoginNotificationProps> = ({ onDismiss }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 border-2 border-[#e6e0d6] bg-gradient-to-r from-[#fdfaf5] to-[#f6f1eb] shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#c49c6b]" />
            <CardTitle className="text-xl text-[#7a7066]">Welcome to Exovia Analytics! 🎉</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-[#a27850] hover:text-[#7a7066]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[#7a7066] leading-relaxed">
          You're all set to start analyzing your data! Here's what you can do:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#e6e0d6]">
            <Upload className="h-5 w-5 text-[#c49c6b] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#7a7066]">Upload Files</h4>
              <p className="text-sm text-[#a27850]">Upload Excel files to analyze your data</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#e6e0d6]">
            <BarChart3 className="h-5 w-5 text-[#c49c6b] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#7a7066]">Create Charts</h4>
              <p className="text-sm text-[#a27850]">Generate beautiful visualizations</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#e6e0d6]">
            <MessageSquare className="h-5 w-5 text-[#c49c6b] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#7a7066]">Chat with Data</h4>
              <p className="text-sm text-[#a27850]">Ask questions about your data</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#efe2d3] p-4 rounded-lg border border-[#e6e0d6]">
          <p className="text-sm text-[#7a7066]">
            <strong>Pro tip:</strong> Start by uploading an Excel file and let our AI analyze it for you. 
            You'll get instant insights and chart recommendations!
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onDismiss} className="bg-[#c49c6b] hover:bg-[#b38b5d] text-white">
            Get Started
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
