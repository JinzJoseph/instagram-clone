import Home from "./components/Home";
import "./App.css";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setnotification } from "./redux/notificationSlice";
import ProtectedRoute from "./components/protectedRoute";
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        {" "}
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/editprofile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    let socketio;

    if (user) {
      socketio = io("http://localhost:3050", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUser", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on("notification", (notification) => {
        console.log("notification"+notification);
        dispatch(setnotification(notification));
      });

      return () => {
        if (socketio) {
          socketio.close();
          dispatch(setSocket(null));
          // dispatch(setnotification([]));
          //
        }
      };
    } 
    //else if (socketio) {
    //   socketio.close();
    //   dispatch(setSocket(null));
    //   dispatch(setnotification([]));
    // }

    // Cleanup when there's no user (e.g., user logs out)
    return () => {
      if (socketio) {
        socketio.close();
        dispatch(setSocket(null));
      }
    };
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
