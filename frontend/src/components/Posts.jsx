import { useEffect, useState } from 'react';
import Post from './Post';
import axios from 'axios';
import { Skeleton } from './ui/skeleton';
import api from '@/api';



const Posts = () => {
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    const res = await api.get(
      '/post/all',
      {withCredentials:true}
    )
    console.log(res.data);
    setPosts(res.data.posts)
    
  }
  useEffect(() => {
    fetchPosts()

  }, [])

  return (
    <div className='overflow-hidden'>
      {posts.map((post, index) => (
        <Post key={index} post={post}  refetch={fetchPosts}/>
      ))}
    </div>
  );
};

export default Posts;
