"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

function ContactRows({
  contact,
  expanded,
  onToggle,
}: {
  contact: ContactRow;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr>
        <td>{new Date(contact.createdAt).toLocaleString()}</td>
        <td className="font-medium text-[var(--navy)]">{contact.name}</td>
        <td>
          <a href={`mailto:${contact.email}`} className="text-[var(--accent)] hover:underline">
            {contact.email}
          </a>
        </td>
        <td>{contact.subject}</td>
        <td>
          <button
            type="button"
            className="text-sm font-semibold text-[var(--accent)] hover:underline"
            onClick={onToggle}
          >
            {expanded ? "Hide" : "Read"}
          </button>
        </td>
      </tr>
      {expanded ? (
        <tr>
          <td colSpan={5} className="!bg-[var(--surface)]">
            <p className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">
              Message
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--navy)]">
              {contact.message}
            </p>
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default function DashboardContactsPage() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi<{ contacts: ContactRow[] }>("/api/admin/contacts")
      .then((data) => setContacts(data.contacts))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Support</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">
          Contact Us Requests
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Messages submitted through the website contact form.
        </p>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]">
        {loading ? (
          <p className="p-6 text-sm text-[var(--muted)]">Loading requests...</p>
        ) : error ? (
          <p className="p-6 text-sm text-[var(--danger)]">{error}</p>
        ) : contacts.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">No contact requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <ContactRows
                    key={contact.id}
                    contact={contact}
                    expanded={expanded === contact.id}
                    onToggle={() =>
                      setExpanded((id) => (id === contact.id ? null : contact.id))
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
