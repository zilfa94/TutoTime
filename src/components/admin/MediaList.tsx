import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface MediaItem {
  id: string;
  url: string;
  title: string;
  type: string;
  createdAt: any;
}

const MediaList = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mediaRef = collection(db, 'media');
    const q = query(mediaRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaItem[];
      
      setMediaItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Chargement des médias...</div>;
  }

  return (
    <div className="media-list">
      <h3>Médias téléchargés</h3>
      <div className="media-grid">
        {mediaItems.map((item) => (
          <div key={item.id} className="media-item">
            {item.type.startsWith('image/') ? (
              <img src={item.url} alt={item.title} />
            ) : item.type.startsWith('video/') ? (
              <video src={item.url} controls />
            ) : null}
            <div className="media-info">
              <h4>{item.title}</h4>
              <p>Type: {item.type}</p>
              <p>Date: {new Date(item.createdAt.toDate()).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaList;
