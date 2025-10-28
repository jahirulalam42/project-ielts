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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/writing-samples" className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors duration-300">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Writing Samples
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              {sample.fields.taskType}
            </span>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              {sample.fields.questionType}
            </span>
            <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              {formatDate(sample.fields.date)}
            </span>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {sample.fields.question}
            </h1>
          </div>

          {/* Image */}
          {sample.fields.image && (
            <div className="mb-12">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={`https:${sample.fields.image.fields.file.url}`}
                  alt={sample.fields.question}
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}
        </div>

        {/* Answer Section */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 border border-gray-100">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Model Answer
            </h2>
          </div>
          
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {renderRichText(sample.fields.answer)}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 mb-12 border border-red-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-800">
              Writing Tips
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-red-700 font-medium">Plan your essay before writing</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-red-700 font-medium">Use clear paragraph structure</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-red-700 font-medium">Include relevant examples and evidence</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-red-700 font-medium">Check your grammar and vocabulary</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-red-700 font-medium">Stay within the word limit</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-red-700 font-medium">Practice time management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Link href="/writing-samples" className="inline-flex items-center justify-center bg-white text-red-600 border-2 border-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All Samples
          </Link>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Practice This Question
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritingSampleDetailPage;
