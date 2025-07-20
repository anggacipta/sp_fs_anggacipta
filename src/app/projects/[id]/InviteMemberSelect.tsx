"use client";

import { useState } from "react";
import AsyncSelect from "react-select/async";
import { useRouter } from "next/navigation";

export default function InviteMemberSelect({
  projectId,
  onSuccess,
}: {
  projectId: string;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const loadOptions = async (inputValue: string) => {
    // Selalu ambil user, meski input kosong (akan ambil 10 user pertama)
    const res = await fetch(`/api/users?query=${encodeURIComponent(inputValue || "")}`);
    if (!res.ok) return [];
    const users = await res.json();
    return users.map((u: any) => ({ value: u.email, label: u.email }));
  };

  const handleInvite = async (option: { value: string; label: string } | null) => {
    if (!option) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: option.value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal invite member");
      setSuccess(true);
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions={true}
        isClearable
        placeholder="Cari email user..."
        onChange={handleInvite}
        isDisabled={loading}
        noOptionsMessage={() => "User tidak ditemukan"}
      />
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-2">Berhasil mengundang member!</p>}
    </div>
  );
}
