// Service for handling copyright checks and story operations

export const checkImageCopyright = async (imageUrl, imageBase64 = null) => {
  try {
    const response = await fetch('/.netlify/functions/vision-copyright-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        imageBase64
      }),
    });

    if (!response.ok) {
      throw new Error(`Copyright check failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Copyright check error:', error);
    throw error;
  }
};

export const postStoryToBlog = async (storyId, authorDetails) => {
  try {
    const response = await fetch('/.netlify/functions/post-story-to-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyId,
        authorDetails
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to post story to blog');
    }

    return await response.json();
  } catch (error) {
    console.error('Post story error:', error);
    throw error;
  }
};

export const getCopyrightStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'text-green-500';
    case 'flagged':
      return 'text-yellow-500';
    case 'rejected':
      return 'text-red-500';
    case 'pending':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

export const getCopyrightStatusIcon = (status) => {
  switch (status) {
    case 'approved':
      return '✅';
    case 'flagged':
      return '⚠️';
    case 'rejected':
      return '❌';
    case 'pending':
      return '⏳';
    default:
      return '❓';
  }
};
