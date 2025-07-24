import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Palette, Type, Download, RotateCw, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface ChartCustomizationProps {
  onStyleChange: (style: any) => void;
  onExport: (format: string) => void;
  showGrid: boolean;
  showLegend: boolean;
  enableAnimation: boolean;
  onShowGridChange: (value: boolean) => void;
  onShowLegendChange: (value: boolean) => void;
  onEnableAnimationChange: (value: boolean) => void;
}

const ChartCustomization: React.FC<ChartCustomizationProps> = ({
  onStyleChange,
  onExport,
  showGrid,
  showLegend,
  enableAnimation,
  onShowGridChange,
  onShowLegendChange,
  onEnableAnimationChange
}) => {
  const [chartStyle, setChartStyle] = React.useState({
    color: '#b38b5d',
    fontSize: '12',
    fontFamily: 'Georgia',
    gridLines: true,
    legend: true,
    animation: true,
    theme: 'warm',
    axisLabelRotation: 0,
    chartOpacity: 1,
    backgroundColor: '#fdfaf5',
    borderColor: '#e6e0d6',
    borderWidth: 1
  });

  const colors = [
    '#b38b5d', '#d08467', '#ffb347', '#c49c6b', '#a27850',
    '#e0ac69', '#d9a066', '#c98c5a', '#a47148', '#deb887',
    '#b5651d', '#d2b48c', '#cd853f', '#bc8f8f', '#c9a46c'
  ];

  const fonts = ['Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Helvetica', 'Arial', 'Impact'];

  const handleStyleChange = (key: string, value: any) => {
    const newStyle = { ...chartStyle, [key]: value };
    setChartStyle(newStyle);
    onStyleChange(newStyle);
  };

  return (
    <Card className="bg-[#fdfaf5] border-[#e6e0d6]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#7a7066]">
          <Palette className="w-5 h-5" />
          Customize Chart Style
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Color */}
        <div>
          <Label className="text-sm font-medium text-[#7a7066]">Primary Color</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  chartStyle.color === color ? 'border-[#a27850] ring-2 ring-[#a27850]/20' : 'border-[#e6e0d6]'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleStyleChange('color', color)}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <Label htmlFor="font-family" className="text-[#7a7066]">Font Family</Label>
          <Select value={chartStyle.fontFamily} onValueChange={(value) => handleStyleChange('fontFamily', value)}>
            <SelectTrigger className="bg-[#fdfaf5] border-[#e6e0d6] text-[#7a7066]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#fdfaf5] border-[#e6e0d6] text-[#7a7066]">
              {fonts.map((font) => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div>
          <Label htmlFor="font-size" className="text-[#7a7066]">Font Size: {chartStyle.fontSize}px</Label>
          <Slider
            value={[parseInt(chartStyle.fontSize)]}
            onValueChange={(value) => handleStyleChange('fontSize', value[0].toString())}
            max={24}
            min={8}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Chart Opacity */}
        <div>
          <Label className="text-[#7a7066]">Chart Opacity: {Math.round(chartStyle.chartOpacity * 100)}%</Label>
          <Slider
            value={[chartStyle.chartOpacity]}
            onValueChange={(value) => handleStyleChange('chartOpacity', value[0])}
            max={1}
            min={0.3}
            step={0.1}
            className="mt-2"
          />
        </div>

        {/* Axis Label Rotation */}
        <div>
          <Label className="text-[#7a7066]">Axis Label Rotation: {chartStyle.axisLabelRotation}°</Label>
          <Slider
            value={[chartStyle.axisLabelRotation]}
            onValueChange={(value) => handleStyleChange('axisLabelRotation', value[0])}
            max={90}
            min={-90}
            step={15}
            className="mt-2"
          />
        </div>

        {/* Background Color */}
        <div>
          <Label className="text-sm font-medium text-[#7a7066]">Background Color</Label>
          <div className="flex gap-2 mt-2">
            {['#fdfaf5', '#f6f1eb', '#efe2d3', '#e6d3c3', '#c9a46c', '#a27850'].map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  chartStyle.backgroundColor === color ? 'border-[#a27850] ring-2 ring-[#a27850]/20' : 'border-[#e6e0d6]'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleStyleChange('backgroundColor', color)}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Border Styling */}
        <div>
          <Label className="text-sm font-medium text-[#7a7066]">Border Color</Label>
          <div className="flex gap-2 mt-2">
            {['#e6e0d6', '#d8cfc3', '#c9a46c', '#a27850', '#7a7066'].map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  chartStyle.borderColor === color ? 'border-[#a27850] ring-2 ring-[#a27850]/20' : 'border-[#e6e0d6]'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleStyleChange('borderColor', color)}
                title={color}
              />
            ))}
          </div>
        </div>

        <div>
          <Label className="text-[#7a7066]">Border Width: {chartStyle.borderWidth}px</Label>
          <Slider
            value={[chartStyle.borderWidth]}
            onValueChange={(value) => handleStyleChange('borderWidth', value[0])}
            max={5}
            min={0}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Toggle Options */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid" className="flex items-center gap-2 text-[#7a7066]">
              <Settings className="w-4 h-4" />
              Show Grid Lines
            </Label>
            <Switch
              id="show-grid"
              checked={showGrid}
              onCheckedChange={onShowGridChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-legend" className="flex items-center gap-2 text-[#7a7066]">
              <Type className="w-4 h-4" />
              Show Legend
            </Label>
            <Switch
              id="show-legend"
              checked={showLegend}
              onCheckedChange={onShowLegendChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-animation" className="flex items-center gap-2 text-[#7a7066]">
              <RotateCw className="w-4 h-4" />
              Enable Animation
            </Label>
            <Switch
              id="enable-animation"
              checked={enableAnimation}
              onCheckedChange={onEnableAnimationChange}
            />
          </div>
        </div>

        {/* Export Options */}
        <div className="pt-4 space-y-2">
          <Label className="flex items-center gap-2 text-[#7a7066]">
            <Download className="w-4 h-4" />
            Export Options
          </Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('png')}
              className="flex-1 border-[#a27850] text-[#7a7066]"
            >
              PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('pdf')}
              className="flex-1 border-[#a27850] text-[#7a7066]"
            >
              PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCustomization;
