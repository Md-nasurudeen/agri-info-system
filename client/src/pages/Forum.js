import { useState, useEffect } from 'react';

function Forum() {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: localStorage.getItem('username') || '',
  });
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/forum');
      if (!response.ok) throw new Error('Failed to fetch forum posts');
      const data = await response.json();
      setPosts(data);
      setError('');
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load forum posts. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to create a post.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create post');
      fetchPosts();
      setFormData({ title: '', content: '', author: localStorage.getItem('username') || '' });
      setError('');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please ensure all fields are filled and you are logged in.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Community Forum</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-green-600 mb-4">Start a Discussion</h3>
        {!isAuthenticated && (
          <p className="text-gray-600 mb-4">
            Please <a href="/login" className="text-green-600 hover:underline">login</a> to start a discussion.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
              disabled={!isAuthenticated}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows="4"
              required
              disabled={!isAuthenticated}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
              disabled={!isAuthenticated}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            disabled={!isAuthenticated}
          >
            Post
          </button>
        </form>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-green-600 mb-4">Recent Discussions</h3>
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts available. Start a discussion!</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>
                <p className="text-gray-600">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600 mt-2">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forum;