import MessageList from "./MessageList"
import SuggestedFriends from "./SuggestedFriends"

const Widgets = () => {
  return (
    <div className="w-full rounded-md px-2 py-6 bg-white dark:bg-gray-700">
      <SuggestedFriends/>
      <MessageList/>
    </div>
  )
}

export default Widgets