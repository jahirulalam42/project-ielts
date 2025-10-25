"use client";
import React, { useEffect, useState } from 'react';
import { getWritingSamples, WritingSample } from '@/lib/contentful';
import Link from 'next/link';

const WritingSamplesPage = () => {
  const [samples, setSamples] = useState<WritingSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        setLoading(true);
        const data = await getWritingSamples();
        setSamples(data);
      } catch (err) {
        setError('Failed to load writing samples');
        console.error('Error fetching samples:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderRichText = (content: any) => {
    if (!content || !content.content) return '';
    
    return content.content.map((node: any, index: number) => {
      if (node.nodeType === 'paragraph') {
        return (
          <p key={index} className="mb-4">
            {node.content?.map((textNode: any, textIndex: number) => {
              if (textNode.nodeType === 'text') {
                return (
                  <span key={textIndex}>
                    {textNode.value}
                  </span>
                );
              }
              return null;
            })}
          </p>
        );
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Writing Sample Questions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Explore sample IELTS writing questions and model answers to understand the format and improve your writing skills
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="badge badge-primary badge-lg">All Samples</div>
            <div className="badge badge-outline badge-lg">Task 1</div>
            <div className="badge badge-outline badge-lg">Task 2</div>
            <div className="badge badge-outline badge-lg">Academic</div>
            <div className="badge badge-outline badge-lg">General</div>
          </div>
        </div>

        {/* Samples Grid */}
        {samples.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No writing samples found</div>
            <p className="text-gray-400 mt-2">Check back later for new samples</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {samples.map((sample) => (
              <div key={sample.sys.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {/* Image */}
                {sample.fields.image && (
                  <figure className="px-6 pt-6">
                    <img
                      src={`https:${sample.fields.image.fields.file.url}`}
                      alt={sample.fields.question}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  </figure>
                )}

                <div className="card-body">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="badge badge-primary">
                      {sample.fields.taskType}
                    </div>
                    <div className="badge badge-secondary">
                      {sample.fields.questionType}
                    </div>
                  </div>

                  {/* Question */}
                  <h2 className="card-title text-lg mb-3 line-clamp-3">
                    {sample.fields.question}
                  </h2>

                  {/* Date */}
                  <div className="text-sm text-gray-500 mb-4">
                    {formatDate(sample.fields.date)}
                  </div>

                  {/* Preview of Answer */}
                  <div className="text-sm text-gray-600 mb-4 line-clamp-4">
                    {renderRichText(sample.fields.answer)}
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end">
                    <Link
                      href={`/writing-samples/${sample.fields.slug}`}
                      className="btn btn-primary"
                    >
                      View Sample
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingSamplesPage;
