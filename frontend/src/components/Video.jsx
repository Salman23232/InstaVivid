import { useEffect, useState } from 'react';
import Reels from './Reels';
import api from '@/api';

const Video = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await api.get('/post/all', {
      withCredentials: true,
    });

    console.log(res.data);

    // Only keep posts that are videos (image === '' and video !== '')
    const videoPosts = res.data.posts.filter(
      (post) => post.image === '' && post.video !== ''
    );

    setPosts(videoPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (<>
  
<div className="h-screen overflow-y-scroll snap-y snap-mandatory">
  {posts.map((post) => (
    <Reels key={post._id} post={post} refetch={fetchPosts} />
  ))}
</div>

  </>
  );
};

export default Video;
