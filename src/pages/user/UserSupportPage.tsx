import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Send,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'ANSWERED' | 'CUSTOMER_REPLY' | 'CLOSED';
  date: string;
  messages: {
    sender: 'user' | 'support';
    name: string;
    text: string;
    time: string;
  }[];
}

export const UserSupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TCK#8021',
      subject: 'Inquiry regarding BEP-20 transaction hash confirmation',
      priority: 'MEDIUM',
      status: 'ANSWERED',
      date: 'Oct 11, 2026',
      messages: [
        {
          sender: 'user',
          name: 'Alex Johnson',
          text: 'Hello support, my recent $100 donation was broadcasted with tx hash 0x9a8f... but shows 1/2 confirmations. Can you check?',
          time: 'Oct 11, 2026 02:20 PM'
        },
        {
          sender: 'support',
          name: 'OpenAid Helpdesk',
          text: 'Hello Alex! We checked the BNB Smart Chain explorer and 3 block confirmations have now been completed. Your position POS-00105 is active in the queue.',
          time: 'Oct 11, 2026 03:05 PM'
        }
      ]
    },
    {
      id: 'TCK#7890',
      subject: 'Question on physical gift shipping address validation',
      priority: 'LOW',
      status: 'CLOSED',
      date: 'Oct 04, 2026',
      messages: [
        {
          sender: 'user',
          name: 'Alex Johnson',
          text: 'Is international delivery available for the Builder rank electric blender?',
          time: 'Oct 04, 2026 10:15 AM'
        },
        {
          sender: 'support',
          name: 'OpenAid Logistics',
          text: 'Yes! Physical rewards are dispatched worldwide via DHL/FedEx with tracking provided upon dispatch.',
          time: 'Oct 04, 2026 11:30 AM'
        }
      ]
    }
  ]);

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [newMessage, setNewMessage] = useState('');
  const [replyText, setReplyText] = useState('');

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newMessage) return;

    const newTck: Ticket = {
      id: `TCK#${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newSubject,
      priority: newPriority,
      status: 'OPEN',
      date: 'Just now',
      messages: [
        {
          sender: 'user',
          name: 'Alex Johnson',
          text: newMessage,
          time: 'Just now'
        }
      ]
    };

    setTickets([newTck, ...tickets]);
    setNewSubject('');
    setNewMessage('');
    setIsCreateOpen(false);
    setActiveTicketId(newTck.id);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activeTicket) return;

    const updated = tickets.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          status: 'CUSTOMER_REPLY' as const,
          messages: [
            ...t.messages,
            {
              sender: 'user' as const,
              name: 'Alex Johnson',
              text: replyText,
              time: 'Just now'
            }
          ]
        };
      }
      return t;
    });

    setTickets(updated);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Support Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Member Helpdesk & Tickets</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit inquiries, request blockchain assistance, and communicate directly with the protocol support team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveTicketId(null);
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Open New Ticket
        </button>
      </div>

      {/* Main View: Ticket Detail or Ticket List */}
      {activeTicket ? (
        /* Conversation View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTicketId(null)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Ticket List
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTicket.status === 'ANSWERED' ? 'bg-emerald-50 text-emerald-700' :
                activeTicket.status === 'OPEN' ? 'bg-sky-50 text-sky-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {activeTicket.status}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{activeTicket.id}</span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 mb-1">{activeTicket.subject}</h2>
            <span className="text-xs text-slate-400">Created: {activeTicket.date}</span>
          </div>

          {/* Messages Thread */}
          <div className="space-y-4 pt-2">
            {activeTicket.messages.map((m, idx) => {
              const isMe = m.sender === 'user';
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="text-[11px] font-bold text-slate-400 mb-1">
                    {m.name} • {m.time}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-lg text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-emerald-900 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          {activeTicket.status !== 'CLOSED' && (
            <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 space-y-3">
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply message here..."
                required
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-orange-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Reply
                </button>
              </div>
            </form>
          )}
        </div>
      ) : isCreateOpen ? (
        /* Create New Ticket Form */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Create New Support Ticket</h2>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ticket Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Brief summary of your question or issue"
                required
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
              >
                <option value="LOW">Low - General Question</option>
                <option value="MEDIUM">Medium - Account / Donation Assistance</option>
                <option value="HIGH">High - Urgent Blockchain Payment Query</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Explain your inquiry in detail, including transaction hashes or position IDs if applicable..."
                required
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Submit Support Ticket
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Ticket List Table */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Your Support Tickets</h3>
            <span className="text-xs text-slate-500 font-semibold">{tickets.length} Tickets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3.5">Ticket ID</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5 text-center">Priority</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5">Created Date</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-800">{t.id}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 max-w-md truncate">{t.subject}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        t.priority === 'HIGH' ? 'bg-rose-50 text-rose-700' :
                        t.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'ANSWERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        t.status === 'OPEN' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                        t.status === 'CUSTOMER_REPLY' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs">{t.date}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveTicketId(t.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        View & Reply <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserSupportPage;
