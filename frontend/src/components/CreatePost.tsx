import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { ImagePlus } from 'lucide-react';
import ProfileImage from './ProtileImage';

interface CreatePostProps {
  createNewPost: (formData: FormData) => void;
  error: string;
  isLoading: boolean;
}

const CreatePost = ({ createNewPost, error, isLoading }: CreatePostProps) => {
  const profileImage = useSelector((state: RootState) => state?.user?.currentUser?.profilePhoto);
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    createNewPost(formData);
    setContent("");
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <>
      <div className='p-1 sm:p-3 rounded-md bg-white dark:bg-gray-600 darK:text-gray-100'>
        {error && <p className='w-full px-2 py-1 text-gray-200 bg-red-600'>{error}</p>}
        <form className='' encType='multipart/form-data' onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <ProfileImage image={profileImage} />
            <textarea
              className='flex-1 min-h-[100px] border-none outline-none bg-gray-200 rounded-md p-2'
              name="text"
              id="text"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end items-center gap-3 mt-3">
            {image && <span>{image.name}</span>}
            <div>
              <input
                type="file"
                id="post_image"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
              <label htmlFor="post_image" className="cursor-pointer">
                <ImagePlus />
                
              </label>
            </div>

            <button
              type="submit"
              className='px-3 py-2 bg-primary text-gray-200'
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePost;