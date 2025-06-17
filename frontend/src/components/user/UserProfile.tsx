import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Check, Upload } from "lucide-react";
import { updateUser as updateUserAction } from '../../store/user-slice';
import FeedSkeleton from "../FeedSkeleton";
import Feed from '../Feed';
import type { User } from "../../store/user-slice"; 
import { toast } from "react-toastify";
import Modal from "../Modal";

const UserProfile = () => {
  const token = useSelector((state: RootState) => state?.user?.token);
  const loggedInUser = useSelector((state: RootState) => state?.user?.currentUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarTouched, setAvatarTouched] = useState(false);

  const [posts, setPosts] = useState<any[]>([]);
  const [postLoading, setPostLoading] = useState<boolean>(true);
  const { id: userId } = useParams();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

// console.log(`UUSSEERR:::: ${loggedInUser?.__v}`)
// console.log(`UUSSEERR:::: ${loggedInUser?.bio}`)
// console.log(`UUSSEERR:::: ${loggedInUser?.createdAt}`)
// console.log(`UUSSEERR Location:::: ${loggedInUser?.location}`)
// console.log(`UUSSEERR loginHistory:::: ${loggedInUser?.loginHistory}`)


  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const getUser = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        const isFollowing = res.data.user.followers?.includes(loggedInUser?._id);
        setIsFollowing(isFollowing || false);
      }
    } catch (error) {
      toast.error("Failed to load user profile");
    } finally {
      setIsLoading(false);
    }
  };



  const changeAvatarHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarFile) return;

    try {
      const formData = new FormData();
      formData.append("image", avatarFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/user/upload/user-dp`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setUser(prev => prev ? { ...prev, profilePhoto: res.data.user.profilePhoto } : null);

        if (userId === loggedInUser?._id) {
          dispatch(updateUserAction({ profilePhoto: res.data.user.profilePhoto }));
        }

        setAvatarTouched(false);
        setAvatarFile(null);
        toast.success("Profile picture updated!");
      }
    } catch (error) {
      toast.error("Failed to update profile picture.");
    }
  };

  const followUnFollowUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/user/follow-unfollow/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setIsFollowing(prev => !prev);
        getUser();
        toast.success(isFollowing ? "Unfollowed user" : "Followed user");
      }
    } catch (error) {
      toast.error("Failed to follow/unfollow user");
    }
  };








// ============================= POSTS ACTIONS =============================================================
  const getUserPosts = async () => {
    try {
      setPostLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/user/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setPosts(res.data.posts || []);
      }
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setPostLoading(false);
    }
  };


const handleDelete = async (postId: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this P?");
  if (!confirmDelete) return;
  setIsDeleting(true);
  try {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });

    if (res.data.success) {
      setPosts(prev => prev.filter(post => post._id !== postId));
      toast.success(res?.data?.message || "🗑️ Post deleted successfully");
    } else {
      toast.error(res?.data?.message || "❌ Failed to delete post");
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "❌ Error deleting the post");
  }finally{
    setIsDeleting(false)
  }
};
 


const handleEdit = async ( e: React.FormEvent, postId: string, body: string) => {
  e.preventDefault();

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/post/${postId}`,
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      toast.success(res?.data?.message || "🎉 Post updated successfully");
      getUserPosts();
    } else {
      toast.error(res?.data?.message || "❌ Failed to update post");
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "❌ Error updating the post");
  }
};



// ================================= Edit Profile ====================================
  const [userName, setUserName] = useState<string>(user?.userName)
  const [bio, setBio] = useState<string>(user?.bio)
const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
const handleEditProfile = async ({ userName, bio }: { userName: string; bio: string }) => {
  setIsUpdatingProfile(true);
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/v1/user/update-profile`,
      { userName, bio },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      toast.success("✅ Profile updated");

      // Update local state
      setUser((prev) => prev ? { ...prev, userName, bio } : null);
      dispatch(updateUserAction({ userName, bio }));

      closeModal();
    } else {
      toast.error(res.data.message || "❌ Failed to update profile");
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "❌ Error updating profile");
  } finally {
    setIsUpdatingProfile(false);
  }
};

useEffect(() => {
  if (user) {
    setUserName(user?.userName);
    setBio(user?.bio);
  }
}, [user]);




// =======================================



  useEffect(() => {
    if (userId) {
      getUser();
      getUserPosts();
    }
  }, [userId]);




  if (isLoading) return [...Array(3)].map((_, i) => <FeedSkeleton key={i} />);
  if (!user) return <div className="text-center mt-10">User not found</div>;

  const isOwnProfile = userId === loggedInUser?._id;

  return (
    <section className="p-4 max-w-4xl mx-auto">
      {/* Avatar + Change */}
      <div className="flex flex-col items-center mb-8">
        <form onSubmit={changeAvatarHandler} className="relative mb-4">
          <img
            src={user.profilePhoto || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
          />
          {isOwnProfile && (
            <>
              <label htmlFor="userAvatar" className={`absolute bottom-2 right-2 bg-white rounded-full p-1 cursor-pointer ${avatarTouched ? 'hidden' : 'block'}`}>
                <Upload size={20} />
              </label>
              {avatarTouched && (
                <button type="submit" className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                  <Check size={20} />
                </button>
              )}
              <input
                type="file"
                id="userAvatar"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAvatarFile(e.target.files[0]);
                    setAvatarTouched(true);
                  }
                }}
                accept="image/png, image/jpg, image/jpeg"
                className="hidden"
              />
            </>
          )}
        </form>

        <h4 className="text-2xl font-bold">{user.userName}</h4>
        <small className="text-gray-600">{user.email}</small>

        <ul className="flex space-x-6 my-4">
          <li className="text-center">
            <h3 className="font-bold">{user.followings?.length || 0}</h3>
            <small>Following</small>
          </li>
          <li className="text-center">
            <h3 className="font-bold">{user.followers?.length || 0}</h3>
            <small>Followers</small>
          </li>
          <li className="text-center">
            <h3 className="font-bold">{user.posts?.length || 0}</h3>
            <small>Posts</small>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-2">
          {isOwnProfile ? (
            <button onClick={openModal} className="web-parymary-btn px-3 py-1 rounded-md">
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={followUnFollowUser}
                className={`web-parymary-btn px-3 py-1 rounded-md `}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
              <Link
                to={`/messages/${user._id}`}
                className="web-parymary-btn px-3 py-1 rounded-md bg-amber-600"
              >
                Message
              </Link>
            </>
          )}
        </div>

        {isOwnProfile && (
          <p className="mt-4 text-center text-gray-700">{user.bio || "No bio added yet."}</p>
        )}
      </div>

      {/* Posts */}
      <h2 className="text-center my-5 text-3xl"><span className=" bg-white dark:bg-gray-600 rounded-md px-5">{user.userName}'s posts</span></h2>
        {postLoading ? (
          <FeedSkeleton/>
        ) : posts.length > 0 ? (
          posts.map(post =>     <Feed  key={post._id}  post={post}  onDelete={handleDelete} onEdit={handleEdit} isDeleting={isDeleting} />)
        ) : (
          <p className="text-center text-gray-500">No posts to show.</p>
        )}

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleEditProfile({userName, bio})
        }}>
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder="Your name..." className="w-full p-2 mb-3 rounded-md bg-gray-100 outline-none text-gray-800" />
          <textarea value={bio} onChange={(e)=>setBio(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-100 outline-none text-gray-800" rows={3}></textarea>
          <button
  type="submit"
  className="web-parymary-btn px-3 py-1 rounded-md flex items-center justify-center"
  disabled={isUpdatingProfile}
>
  {isUpdatingProfile ? (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Saving...
    </span>
  ) : (
    "Save Changes"
  )}
</button>

        </form>
      </Modal>
    </section>
  );
};

export default UserProfile;
