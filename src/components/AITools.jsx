import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Loader2, Sparkles, MessageSquare, FileText, Lightbulb } from 'lucide-react';

const AITools = ({ content }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [activeTool, setActiveTool] = useState('');

  // Convert PortableText to plain text
  const convertToPlainText = (portableText) => {
    if (!portableText) return '';
    
    return portableText
      .map(block => {
        if (block._type === 'block' && block.children) {
          return block.children
            .map(child => child.text || '')
            .join('');
        }
        return '';
      })
      .join('\n\n');
  };

  const handleAIAction = async (action, prompt) => {
    setIsLoading(true);
    setActiveTool(action);
    setResult('');

    try {
      const plainTextContent = convertToPlainText(content);
      const fullPrompt = `${prompt}\n\nContent:\n${plainTextContent}`;

      const response = await fetch('/.netlify/functions/gemini-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        setResult(data.candidates[0].content.parts[0].text);
      } else {
        setResult('No response generated. Please try again.');
      }
    } catch (error) {
      console.error('AI request failed:', error);
      setResult('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
      setActiveTool('');
    }
  };

  const tools = [
    {
      id: 'summarize',
      title: 'Summarize',
      description: 'Get a concise summary of this article',
      icon: <FileText className="h-4 w-4" />,
      prompt: 'Please provide a concise summary of the following article, highlighting the main points and key takeaways:'
    },
    {
      id: 'explain',
      title: 'Explain',
      description: 'Get a detailed explanation of complex topics',
      icon: <MessageSquare className="h-4 w-4" />,
      prompt: 'Please explain the key concepts and topics discussed in this article in simple, easy-to-understand terms:'
    },
    {
      id: 'insights',
      title: 'Key Insights',
      description: 'Extract important insights and implications',
      icon: <Lightbulb className="h-4 w-4" />,
      prompt: 'What are the key insights, implications, and important takeaways from this article? Please provide actionable insights:'
    }
  ];

  return (
    <div className="my-8 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Article Tools</h3>
        <Badge variant="secondary" className="text-xs">Powered by Gemini</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {tool.icon}
                <CardTitle className="text-sm">{tool.title}</CardTitle>
              </div>
              <CardDescription className="text-xs">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleAIAction(tool.id, tool.prompt)}
                disabled={isLoading}
                size="sm"
                className="w-full"
                variant="outline"
              >
                {isLoading && activeTool === tool.id ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Use ${tool.title}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AI Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <Textarea
                value={result}
                readOnly
                className="min-h-[200px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigator.clipboard.writeText(result)}
              >
                Copy to Clipboard
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setResult('')}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AITools;



