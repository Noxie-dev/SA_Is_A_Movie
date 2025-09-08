import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, AlertTriangle, Loader2, ChevronDown, ChevronUp, RefreshCw, FileText, Shield, Search, Zap } from 'lucide-react';

const ComplianceChecker = ({ content, title, metaDescription, images, sourceLinks, onPublish }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [complianceResults, setComplianceResults] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(true);

  const runComplianceCheck = useCallback(async () => {
    // Prevent running if content is too short
    if (!content || content.length < 100) {
      setComplianceResults(null); // Clear previous results
      return;
    }
    
    setIsChecking(true);
    
    try {
      const response = await fetch('/.netlify/functions/complianceEngine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title, metaDescription, images, sourceLinks })
      });
      
      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setComplianceResults(data);

    } catch (error) {
      console.error('Compliance check failed:', error);
      setComplianceResults({
        success: false,
        error: error.message
      });
    } finally {
      setIsChecking(false);
    }
  }, [content, title, metaDescription, images, sourceLinks]); // Dependencies for the check logic

  // Auto-check when content changes (debounced)
  useEffect(() => {
    if (autoCheckEnabled) {
      const timer = setTimeout(() => {
        runComplianceCheck();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, title, metaDescription, images, sourceLinks, autoCheckEnabled, runComplianceCheck]); // Complete dependency array

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'fail':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'fail':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  // Recommendation component to render actionable advice
  const Recommendations = ({ recommendations }) => {
    if (!recommendations || recommendations.length === 0) {
      return null;
    }
    
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'critical':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'high':
          return 'bg-orange-50 border-orange-200 text-orange-800';
        case 'medium':
          return 'bg-blue-50 border-blue-200 text-blue-800';
        default:
          return 'bg-gray-50 border-gray-200 text-gray-800';
      }
    };

    return (
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Top Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {rec.priority === 'critical' && <X className="w-4 h-4 text-red-600" />}
                  {rec.priority === 'high' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                  {rec.priority === 'medium' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-2">{rec.action}</p>
                  {rec.details && rec.details.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {rec.details.map((detail, dIdx) => (
                        <li key={dIdx}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // CheckItem component with improved accessibility
  const CheckItem = ({ icon: Icon, title, status, score, details, expandable = true }) => {
    const isExpanded = expandedSections[title];
    
    return (
      <div className={`border rounded-lg mb-3 shadow-sm transition-shadow ${getStatusColor(status)}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-4 text-left hover:shadow-md transition-shadow"
          onClick={() => expandable && toggleSection(title)}
          aria-expanded={isExpanded}
          aria-controls={`${title}-details`}
          disabled={!expandable}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">{title}</span>
            {getStatusIcon(status)}
          </div>
          <div className="flex items-center gap-3">
            {score !== undefined && (
              <span className={`font-bold ${getScoreColor(score)}`}>
                {score}%
              </span>
            )}
            {expandable && details && (
              isExpanded ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </button>
        
        {isExpanded && details && (
          <div 
            id={`${title}-details`}
            className="p-4 pt-0 pl-8 text-sm text-gray-600"
            role="region"
            aria-labelledby={`${title}-button`}
          >
            {details}
          </div>
        )}
      </div>
    );
  };

  const renderCheckDetails = (check, type) => {
    if (!check) return null;
    
    switch (type) {
      case 'grammar':
        return (
          <div className="space-y-2">
            {check.readabilityScore && (
              <p>Readability Score: <span className={`font-bold ${getScoreColor(check.readabilityScore)}`}>{check.readabilityScore.toFixed(1)}</span></p>
            )}
            {check.grammarIssueCount !== undefined && (
              <p>Grammar Issues Found: <span className="font-bold">{check.grammarIssueCount}</span></p>
            )}
            {check.issues && check.issues.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold mb-1">Issues to fix:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {check.issues.slice(0, 5).map((issue, idx) => (
                    <li key={idx}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'adsense':
        return (
          <div className="space-y-2">
            {check.violations && check.violations.length > 0 && (
              <div>
                <p className="font-semibold text-red-600 mb-1">Critical Violations:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {check.violations.map((violation, idx) => (
                    <li key={idx} className="text-red-600">{violation.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {check.warnings && check.warnings.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-yellow-600 mb-1">Warnings:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {check.warnings.map((warning, idx) => (
                    <li key={idx} className="text-yellow-600">{warning.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'facts':
        return (
          <div className="space-y-2">
            {check.credibilityScore !== undefined && (
              <p>Credibility Score: <span className={`font-bold ${getScoreColor(check.credibilityScore)}`}>{check.credibilityScore.toFixed(0)}%</span></p>
            )}
            {check.claims && check.claims.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold mb-1">Claims checked:</p>
                <ul className="space-y-2">
                  {check.claims.map((claim, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {claim.verified ? 
                        <Check className="w-4 h-4 text-green-500 mt-0.5" /> : 
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      }
                      <div>
                        <p className="text-xs">{claim.claim}</p>
                        <p className="text-xs text-gray-500">Status: {claim.rating}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'seo':
        return (
          <div className="space-y-2">
            {check.issues && check.issues.length > 0 && (
              <div>
                <p className="font-semibold text-red-600 mb-1">SEO Issues:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {check.issues.map((issue, idx) => (
                    <li key={idx} className="text-red-600">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {check.suggestions && check.suggestions.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-blue-600 mb-1">Suggestions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {check.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-blue-600">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const handlePublish = () => {
    if (onPublish && complianceResults) {
      onPublish(complianceResults);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Content Compliance Checker
        </h2>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoCheckEnabled}
              onChange={(e) => setAutoCheckEnabled(e.target.checked)}
              className="rounded"
            />
            Auto-check
          </label>
          <button
            onClick={runComplianceCheck}
            disabled={isChecking}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isChecking ? 'Checking...' : 'Check Now'}
          </button>
        </div>
      </div>

      {/* Overall Score Display */}
      {complianceResults && complianceResults.success && (
        <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Overall Compliance Score</h3>
              <p className="text-sm text-gray-600">
                {complianceResults.canPublish ? 'Ready to publish' : 'Needs improvement before publishing'}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(complianceResults.score)}`}>
                {complianceResults.score}%
              </div>
              <div className="text-sm text-gray-500">
                {complianceResults.canPublish ? 'PASS' : 'FAIL'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isChecking && !complianceResults && (
        <div className="text-center py-8">
          <Loader2 className="mx-auto w-8 h-8 text-blue-600 animate-spin" />
          <p className="mt-2 text-gray-600">Running compliance check...</p>
        </div>
      )}

      {/* Empty State */}
      {!complianceResults && !isChecking && (
        <div className="text-center py-8">
          <FileText className="mx-auto w-12 h-12 text-gray-300" />
          <p className="mt-2 text-gray-500">Compliance check will run automatically when you add content.</p>
          <p className="text-sm text-gray-400 mt-1">Minimum 100 characters required for analysis.</p>
        </div>
      )}

      {/* Error State */}
      {complianceResults && !complianceResults.success && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5" />
            <p className="font-bold">Error</p>
          </div>
          <p className="mt-1">{complianceResults.error}</p>
        </div>
      )}

      {/* Results Display */}
      {complianceResults && complianceResults.success && (
        <>
          <Recommendations recommendations={complianceResults.recommendations} />
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Detailed Analysis</h3>
            <div className="space-y-3">
              <CheckItem
                title="Grammar & Readability"
                icon={FileText}
                status={complianceResults.checks.grammar.status}
                score={complianceResults.checks.grammar.score}
                details={renderCheckDetails(complianceResults.checks.grammar, 'grammar')}
              />
              
              <CheckItem
                title="AdSense Compliance"
                icon={Shield}
                status={complianceResults.checks.adsense.status}
                score={complianceResults.checks.adsense.score}
                details={renderCheckDetails(complianceResults.checks.adsense, 'adsense')}
              />
              
              <CheckItem
                title="Fact Checking"
                icon={Search}
                status={complianceResults.checks.facts.status}
                score={complianceResults.checks.facts.score}
                details={renderCheckDetails(complianceResults.checks.facts, 'facts')}
              />
              
              <CheckItem
                title="SEO Optimization"
                icon={Zap}
                status={complianceResults.checks.seo.status}
                score={complianceResults.checks.seo.score}
                details={renderCheckDetails(complianceResults.checks.seo, 'seo')}
              />
            </div>
          </div>

          {/* Publish Button */}
          {onPublish && (
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={handlePublish}
                disabled={!complianceResults.canPublish}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  complianceResults.canPublish
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {complianceResults.canPublish ? 'Publish Content' : 'Fix Issues Before Publishing'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ComplianceChecker;
