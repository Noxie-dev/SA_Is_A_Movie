import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { checkImageCopyright, getCopyrightStatusColor, getCopyrightStatusIcon } from '../services/copyrightService';

const CopyrightChecker = ({ imageUrl, onStatusChange }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [copyrightStatus, setCopyrightStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleCopyrightCheck = async () => {
    if (!imageUrl) {
      setError('No image URL provided');
      return;
    }

    setIsChecking(true);
    setError(null);
    setCopyrightStatus(null);

    try {
      const result = await checkImageCopyright(imageUrl);
      setCopyrightStatus(result.analysis);
      
      // Notify parent component of status change
      if (onStatusChange) {
        onStatusChange(result.analysis);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'flagged':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Copyright Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!copyrightStatus && !isChecking && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Check this image for potential copyright issues before publishing
            </p>
            <Button 
              onClick={handleCopyrightCheck}
              disabled={!imageUrl}
              className="w-full"
            >
              <Shield className="mr-2 h-4 w-4" />
              Check Copyright
            </Button>
          </div>
        )}

        {isChecking && (
          <div className="text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-gray-600">Analyzing image for copyright issues...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {copyrightStatus && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(copyrightStatus.status)}
                <span className="font-medium">Status: {copyrightStatus.status}</span>
              </div>
              <Badge 
                variant="outline" 
                className={`${getCopyrightStatusColor(copyrightStatus.status)} border-current`}
              >
                {getCopyrightStatusIcon(copyrightStatus.status)}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Risk Level:</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getRiskColor(copyrightStatus.copyrightRisk)}`}></div>
                <span className="text-sm capitalize">{copyrightStatus.copyrightRisk}</span>
              </div>
            </div>

            {copyrightStatus.confidence > 0 && (
              <div className="text-sm">
                <span className="font-medium">Confidence: </span>
                <span>{Math.round(copyrightStatus.confidence * 100)}%</span>
              </div>
            )}

            {copyrightStatus.issues && copyrightStatus.issues.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Issues Found:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {copyrightStatus.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {copyrightStatus.recommendations && copyrightStatus.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Recommendations:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {copyrightStatus.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              onClick={handleCopyrightCheck}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Re-check Copyright
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CopyrightChecker;
