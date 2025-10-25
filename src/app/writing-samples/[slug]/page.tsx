"use client";
import React, { useEffect, useState } from 'react';
import { getWritingSampleBySlug, WritingSample } from '@/lib/contentful';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const WritingSampleDetailPage = () => {
  const [sample, setSample] = useState<WritingSample | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchSample = async () => {
      try {
        setLoading(true);
        if (params.slug) {
          const data = await getWritingSampleBySlug(params.slug as string);
          if (data) {
            setSample(data);
          } else {
            setError('Writing sample not found');
          }
        }
      } catch (err) {
        setError('Failed to load writing sample');
        console.error('Error fetching sample:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSample();
  }, [params.slug]);

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
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {node.content?.map((textNode: any, textIndex: number) => {
              if (textNode.nodeType === 'text') {
                let text = textNode.value;
                
                // Apply formatting based on marks
                if (textNode.marks) {
                  textNode.marks.forEach((mark: any) => {
                    switch (mark.type) {
                      case 'bold':
                        text = <strong key={textIndex}>{text}</strong>;
                        break;
                      case 'italic':
                        text = <em key={textIndex}>{text}</em>;
                        break;
                      case 'underline':
                        text = <u key={textIndex}>{text}</u>;
                        break;
                    }
                  });
                }
                
                return text;
              }
              return null;
            })}
          </p>
        );
      }
      
      if (node.nodeType === 'heading-1') {
        return (
          <h1 key={index} className="text-3xl font-bold mb-6 text-gray-800">
            {node.content?.map((textNode: any, textIndex: number) => textNode.value).join('')}
          </h1>
        );
      }
      
      if (node.nodeType === 'heading-2') {
        return (
          <h2 key={index} className="text-2xl font-semibold mb-4 text-gray-800">
            {node.content?.map((textNode: any, textIndex: number) => textNode.value).join('')}
          </h2>
        );
      }
      
      if (node.nodeType === 'heading-3') {
        return (
          <h3 key={index} className="text-xl font-semibold mb-3 text-gray-800">
            {node.content?.map((textNode: any, textIndex: number) => textNode.value).join('')}
          </h3>
        );
      }
      
      if (node.nodeType === 'unordered-list') {
        return (
          <ul key={index} className="list-disc list-inside mb-4 space-y-2">
            {node.content?.map((listItem: any, itemIndex: number) => (
              <li key={itemIndex} className="text-gray-700">
                {listItem.content?.map((textNode: any, textIndex: number) => textNode.value).join('')}
              </li>
            ))}
          </ul>
        );
      }
      
      if (node.nodeType === 'ordered-list') {
        return (
          <ol key={index} className="list-decimal list-inside mb-4 space-y-2">
            {node.content?.map((listItem: any, itemIndex: number) => (
              <li key={itemIndex} className="text-gray-700">
                {listItem.content?.map((textNode: any, textIndex: number) => textNode.value).join('')}
              </li>
            ))}
          </ol>
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

  if (error || !sample) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error || 'Writing sample not found'}</span>
          <Link href="/writing-samples" className="btn btn-sm btn-outline">
            Back to Samples
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/writing-samples" className="btn btn-ghost btn-sm">
            ← Back to Writing Samples
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="badge badge-primary badge-lg">
              {sample.fields.taskType}
            </div>
            <div className="badge badge-secondary badge-lg">
              {sample.fields.questionType}
            </div>
            <div className="badge badge-outline badge-lg">
              {formatDate(sample.fields.date)}
            </div>
          </div>

          {/* Question */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {sample.fields.question}
          </h1>

          {/* Image */}
          {sample.fields.image && (
            <div className="mb-8">
              <img
                src={`https:${sample.fields.image.fields.file.url}`}
                alt={sample.fields.question}
                className="rounded-lg w-full h-64 md:h-80 object-cover shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Answer Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="badge badge-primary badge-lg mr-3">Model Answer</span>
            Sample Response
          </h2>
          
          <div className="prose max-w-none">
            {renderRichText(sample.fields.answer)}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            💡 Writing Tips
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Plan your essay before writing</li>
            <li>• Use clear paragraph structure</li>
            <li>• Include relevant examples and evidence</li>
            <li>• Check your grammar and vocabulary</li>
            <li>• Stay within the word limit</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link href="/writing-samples" className="btn btn-outline">
            ← All Samples
          </Link>
          <button className="btn btn-primary">
            Practice This Question →
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritingSampleDetailPage;
