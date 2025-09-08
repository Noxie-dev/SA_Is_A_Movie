// Vision API service for copyright infringement checking
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { imageUrl, imageBase64 } = req.body;

  if (!imageUrl && !imageBase64) {
    return res.status(400).json({ error: 'Image URL or base64 data is required' });
  }

  const apiKey = process.env.VITE_GOOGLE_VISION_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Google Vision API key not configured' });
  }

  try {
    let imageData;
    
    if (imageBase64) {
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      imageData = {
        content: base64Data
      };
    } else {
      imageData = {
        source: {
          imageUri: imageUrl
        }
      };
    }

    const requestBody = {
      requests: [
        {
          image: imageData,
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 10
            },
            {
              type: 'LABEL_DETECTION',
              maxResults: 10
            },
            {
              type: 'WEB_DETECTION',
              maxResults: 10
            },
            {
              type: 'SAFE_SEARCH_DETECTION',
              maxResults: 1
            }
          ]
        }
      ]
    };

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Vision API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Vision API request failed',
        details: errorData 
      });
    }

    const data = await response.json();
    const result = data.responses[0];

    // Analyze results for copyright concerns
    const copyrightAnalysis = analyzeForCopyright(result);

    return res.status(200).json({
      success: true,
      analysis: copyrightAnalysis,
      rawResults: result
    });

  } catch (error) {
    console.error('Vision API processing error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

function analyzeForCopyright(visionResult) {
  const analysis = {
    copyrightRisk: 'low',
    confidence: 0,
    issues: [],
    recommendations: []
  };

  // Check for text that might indicate copyrighted content
  if (visionResult.textAnnotations) {
    const textContent = visionResult.textAnnotations
      .map(annotation => annotation.description)
      .join(' ')
      .toLowerCase();

    const copyrightKeywords = [
      'copyright', '©', 'all rights reserved', 'proprietary',
      'trademark', '™', 'registered', '®', 'watermark'
    ];

    const foundKeywords = copyrightKeywords.filter(keyword => 
      textContent.includes(keyword)
    );

    if (foundKeywords.length > 0) {
      analysis.copyrightRisk = 'high';
      analysis.confidence = 0.9;
      analysis.issues.push(`Found copyright indicators: ${foundKeywords.join(', ')}`);
      analysis.recommendations.push('Review image for copyright compliance before publishing');
    }
  }

  // Check web detection for potential matches
  if (visionResult.webDetection) {
    const webDetection = visionResult.webDetection;
    
    if (webDetection.webEntities) {
      const entities = webDetection.webEntities.filter(entity => 
        entity.score > 0.7
      );

      if (entities.length > 0) {
        analysis.copyrightRisk = analysis.copyrightRisk === 'high' ? 'high' : 'medium';
        analysis.confidence = Math.max(analysis.confidence, 0.7);
        analysis.issues.push(`Image matches known web entities: ${entities.map(e => e.description).join(', ')}`);
        analysis.recommendations.push('Verify image source and usage rights');
      }
    }

    if (webDetection.visuallySimilarImages && webDetection.visuallySimilarImages.length > 0) {
      analysis.copyrightRisk = analysis.copyrightRisk === 'high' ? 'high' : 'medium';
      analysis.confidence = Math.max(analysis.confidence, 0.6);
      analysis.issues.push('Image has visually similar matches on the web');
      analysis.recommendations.push('Check if similar images are copyrighted');
    }
  }

  // Check safe search for inappropriate content
  if (visionResult.safeSearchAnnotation) {
    const safeSearch = visionResult.safeSearchAnnotation;
    const unsafeCategories = ['adult', 'violence', 'racy'];
    
    const unsafeResults = unsafeCategories.filter(category => 
      safeSearch[category] === 'LIKELY' || safeSearch[category] === 'VERY_LIKELY'
    );

    if (unsafeResults.length > 0) {
      analysis.copyrightRisk = 'high';
      analysis.confidence = 0.95;
      analysis.issues.push(`Inappropriate content detected: ${unsafeResults.join(', ')}`);
      analysis.recommendations.push('Do not use this image - contains inappropriate content');
    }
  }

  // Determine final status
  if (analysis.copyrightRisk === 'high') {
    analysis.status = 'rejected';
  } else if (analysis.copyrightRisk === 'medium') {
    analysis.status = 'flagged';
  } else {
    analysis.status = 'approved';
  }

  return analysis;
}
