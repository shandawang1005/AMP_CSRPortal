import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  updateTicketStatus,
  addComment,
  fetchTicketById,
  deleteComment,
  updateComment,
} from "../features/tickets/ticketThunks";

export default function TicketDetail() {
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const ticket = useSelector((state) =>
    state.tickets.list.find((t) => t._id === ticketId)
  );
  const user = useSelector((state) => state.auth.user);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(fetchTicketById(ticketId));
  }, [ticketId, dispatch]);

  const handleStatusChange = (e) => {
    dispatch(updateTicketStatus({ ticketId, status: e.target.value }));
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    console.log(user);
    dispatch(addComment({ ticketId, text: comment, author: user._id }));
    setComment("");
  };

  const handleEditComment = (index, oldText) => {
    setEditingIndex(index);
    setEditingText(oldText);
  };

  const handleSaveEdit = () => {
    if (!editingText.trim()) return;
    dispatch(
      updateComment({
        ticketId,
        commentIndex: editingIndex,
        newText: editingText,
      })
    );
    setEditingIndex(null);
    setEditingText("");
  };

  const handleDeleteComment = (index) => {
    dispatch(deleteComment({ ticketId, commentIndex: index }));
  };

  if (!ticket) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Ticket Details</h1>

      <div className="mb-4">
        <p>
          <span className="font-semibold">Subject:</span> {ticket.subject}
        </p>
        <p>
          <span className="font-semibold">Description:</span>{" "}
          {ticket.description}
        </p>
        <p>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(ticket.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mb-4">
        <label className="font-semibold block mb-1">Status</label>
        <select
          className="border p-2 rounded"
          value={ticket.status}
          onChange={handleStatusChange}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-2">Comments</h2>
      {ticket.comments.length >= 1 ? (
        <ul className="border p-2 rounded bg-gray-50 max-h-60 overflow-y-auto">
          {ticket.comments.map((c, i) => (
            <li key={i} className="mb-2">
              <div className="flex justify-between items-center">
                {editingIndex === i ? (
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="border rounded p-1 flex-1 mr-2"
                  />
                ) : (
                  <p className="text-sm">
                    <strong>{c.author || "Me"}</strong>: {c.text}
                  </p>
                )}
                <div className="text-sm space-x-2">
                  {editingIndex === i ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditComment(i, c.text)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(i)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>There is no Comment yet</p>
      )}

      <div className="flex mt-4 space-x-2">
        <input
          className="border p-2 flex-1 rounded"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
}
