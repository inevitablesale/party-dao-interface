
import { useEffect, useState } from 'react';
import { Publication, fetchPublications } from '../services/graphService';
import { getFromIPFS } from '../services/ipfsService';
import { IPFSContent } from '@/types/content';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContentHub() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [contents, setContents] = useState<Map<string, IPFSContent>>(new Map());
  const navigate = useNavigate();

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      const { publications: newPubs, hasMore: more } = await fetchPublications(page);
      setPublications(prev => [...prev, ...newPubs]);
      setHasMore(more);
      
      // Load IPFS content for new publications
      for (const pub of newPubs) {
        const content = await getFromIPFS<IPFSContent>(pub.ipfsHash, 'content');
        setContents(prev => new Map(prev).set(pub.ipfsHash, content));
      }
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    loadPublications();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-teal-400 to-yellow-400 text-transparent bg-clip-text">
            LGR Content Hub
          </h1>
          <Button onClick={() => navigate('/content/new')} className="bg-yellow-500 hover:bg-yellow-600">
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>

        <Card className="bg-gray-900/50 border-white/10">
          <ScrollArea className="h-[600px] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publications.map((pub) => {
                const content = contents.get(pub.ipfsHash);
                if (!content) return null;

                return (
                  <Card key={pub.id} className="p-6 bg-black/50 border-white/10 hover:border-yellow-500/50 transition-colors">
                    <h2 className="text-xl font-bold mb-2">{content.title}</h2>
                    <p className="text-gray-400 mb-4">{content.content.substring(0, 150)}...</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Published by: {pub.publisher.substring(0, 6)}...{pub.publisher.substring(38)}</span>
                      <span>{new Date(pub.timestamp).toLocaleDateString()}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {hasMore && (
              <div className="mt-6 text-center">
                <Button onClick={loadMore} variant="outline" className="border-yellow-500/50 hover:bg-yellow-500/10">
                  Load More
                </Button>
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
