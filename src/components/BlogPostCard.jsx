import { Link } from 'react-router-dom';
import { urlFor } from '../services/sanity';
import { format } from 'date-fns';

const BlogPostCard = ({ post }) => {
  if (!post) return null;

  const { _id, title, slug, publishedAt, mainImage, author, categories, excerpt } = post;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      {mainImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={urlFor(mainImage).width(400).height(225).url()}
            alt={mainImage.alt || title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {categories.slice(0, 2).map((category) => (
              <span
                key={category.title}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {category.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
          <Link
            to={`/blog/${slug.current}`}
            className="hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            {author && (
              <>
                {author.image && (
                  <img
                    src={urlFor(author.image).width(24).height(24).url()}
                    alt={author.name}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span>{author.name}</span>
              </>
            )}
          </div>
          {publishedAt && (
            <time dateTime={publishedAt}>
              {format(new Date(publishedAt), 'MMM d, yyyy')}
            </time>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
