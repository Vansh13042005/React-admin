import React, { useEffect, useState } from "react";
import { Trash2, Mail } from "lucide-react";
import { useToast } from "../context/ToastContext";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import ConfirmModal from "../components/UI/ConfirmModal";

const MessagesPage = () => {
  const { addToast } = useToast();

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ GET
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        "https://profolionode.vanshpatel.in/api/messages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setMessages(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ✅ unread count fix
  const unreadCount = messages.filter((m) => !m.is_read).length;

  // ✅ SELECT MESSAGE
  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);

    // mark as read (optional API)
    if (!msg.is_read) {
      try {
        await fetch(
          `https://profolionode.vanshpatel.in/api/messages/${msg.id}/read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchMessages(); // refresh
      } catch (err) {
        console.log(err);
      }
    }
  };

  // ✅ DELETE
  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await fetch(
        `https://profolionode.vanshpatel.in/api/messages/${confirmDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addToast("Deleted", "success");

      if (selectedMessage?.id === confirmDelete) {
        setSelectedMessage(null);
      }

      setConfirmDelete(null);
      fetchMessages();
    } catch (err) {
      addToast("Delete failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        {unreadCount > 0 && (
          <p className="text-orange-500">{unreadCount} unread messages</p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LIST */}
        <div className="lg:col-span-2">
          <Card>
            {messages.length === 0 ? (
              <p className="text-center py-10">No messages</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 mb-2 cursor-pointer border-l-4 ${
                    msg.is_read ? "bg-gray-100" : "bg-orange-100 border-orange-500"
                  }`}
                >
                  <p className="font-bold">{msg.name}</p>
                  <p className="text-sm">{msg.email}</p>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))
            )}
          </Card>
        </div>

        {/* DETAILS */}
        <div>
          {selectedMessage ? (
            <Card>
              <h3 className="font-bold mb-4">Details</h3>

              <p><b>Name:</b> {selectedMessage.name}</p>
              <p><b>Email:</b> {selectedMessage.email}</p>
              <p><b>Message:</b> {selectedMessage.message}</p>

              <Button
                onClick={() => setConfirmDelete(selectedMessage.id)}
                className="mt-4"
              >
                <Trash2 size={16} /> Delete
              </Button>
            </Card>
          ) : (
            <Card className="text-center py-10">
              <Mail size={40} className="mx-auto mb-2" />
              <p>Select message</p>
            </Card>
          )}
        </div>
      </div>

      {/* DELETE */}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MessagesPage;