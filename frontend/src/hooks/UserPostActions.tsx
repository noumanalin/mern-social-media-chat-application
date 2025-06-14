import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const token = useSelector((state:RootState)=> state?.user?.token)


export const handleDelete = async (postId: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this P?");
  if (!confirmDelete) return;
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
  }
};
 


export const handleEdit = async ( e: React.FormEvent, postId: string, body: string) => {
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