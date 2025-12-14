import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-[100dvh] bg-base-200">
      <div className="flex h-full pt-16"> {/* Navbar height */}
        <div className="flex w-full h-full bg-base-100">
          <Sidebar />

          {/* On mobile show chat OR placeholder */}
          <div className="flex-1">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
