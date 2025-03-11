
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Publication, fetchPublications } from '../services/graphService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Loader2, ChevronLeft, Clock, BookOpen, Trophy, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function KnowledgeArticle() {
  const { contentType, id } = useParams();
  const [article, setArticle] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const { publications } = await fetchPublications();
        const found = publications.find(p => p.id === id);
        if (found) {
          setArticle(found);
        } else {
          throw new Error('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load the article"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  const handleVote = async (helpful: boolean) => {
    if (!article) return;
    
    setVoting(true);
    try {
      toast({
        title: "Thank you for your feedback!",
        description: helpful ? "We're glad this was helpful!" : "We'll work on improving this content.",
      });
    } catch (err) {
      console.error('Error voting:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your vote"
      });
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
            <p className="mb-8">The content you're looking for doesn't exist or has been moved.</p>
            <Link to="/knowledge">
              <Button variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <Link to="/knowledge" className="text-white/60 hover:text-white flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Knowledge Base
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <span className="px-2 py-1 bg-white/5 rounded">
              {article.contentType.charAt(0).toUpperCase() + article.contentType.slice(1)}
            </span>
            <span>•</span>
            <span>{article.category}</span>
          </div>

          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-teal-400 via-yellow-400 to-purple-400 text-transparent bg-clip-text">
            {article.title}
          </h1>

          {/* Article Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {article.expertise_level && (
              <Card className="p-4 bg-gray-800/50 border-white/10">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <div>
                    <div className="text-sm text-white/60">Level</div>
                    <div className="font-medium">{article.expertise_level}</div>
                  </div>
                </div>
              </Card>
            )}
            
            {article.estimated_reading_time && (
              <Card className="p-4 bg-gray-800/50 border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="text-sm text-white/60">Read Time</div>
                    <div className="font-medium">{article.estimated_reading_time} min</div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-4 bg-gray-800/50 border-white/10">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-sm text-white/60">Publisher</div>
                  <div className="font-medium">
                    {article.publisher.slice(0, 6)}...{article.publisher.slice(-4)}
                  </div>
                </div>
              </div>
            </Card>

            {article.topics && (
              <Card className="p-4 bg-gray-800/50 border-white/10">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-sm text-white/60">Topics</div>
                    <div className="font-medium">{article.topics.length}</div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Topics */}
          {article.topics && (
            <ScrollArea className="w-full">
              <div className="flex gap-2 mb-8 pb-4">
                {article.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/60 whitespace-nowrap"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Content */}
        <Card className="p-8 bg-gray-800/50 border-white/10 mb-8">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content || '' }} 
          />
        </Card>

        {/* Feedback Section */}
        <Card className="p-6 bg-gray-800/50 border-white/10">
          <h3 className="text-lg font-semibold mb-4">Was this content helpful?</h3>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-white/10"
              onClick={() => handleVote(true)}
              disabled={voting}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Yes
            </Button>
            <Button
              variant="outline"
              className="border-white/10"
              onClick={() => handleVote(false)}
              disabled={voting}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              No
            </Button>
          </div>
        </Card>
      </article>
    </div>
  );
}
