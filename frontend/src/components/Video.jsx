import { useEffect, useState } from 'react';
import Reels from './Reels';
import axios from 'axios';

const Video = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:8000/api/v1/post/all', {
      withCredentials: true,
    });

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
