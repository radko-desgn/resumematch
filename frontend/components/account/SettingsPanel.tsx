"use client";

import { useState } from "react";
import { Check, Globe, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { deleteAccount } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidePanel } from "./SidePanel";

/**
 * Account settings: change password, delete account, and a placeholder for the
 * language switch that's coming later. Password change is inline (the user is
 * already signed in), so it doesn't bounce them out to the reset page.
 */
export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { updatePassword, signOut, email } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwDone, setPwDone] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState("");
  const [delBusy, setDelBusy] = useState(false);
  const [delError, setDelError] = useState<string | null>(null);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setPwError("Those passwords don't match.");
      return;
    }
    setPwBusy(true);
    setPwError(null);
    try {
      await updatePassword(password);
      setPwDone(true);
      setPassword("");
      setConfirm("");
      setTimeout(() => setPwDone(false), 4000);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Could not update the password");
    } finally {
      setPwBusy(false);
    }
  }

  async function removeAccount() {
    setDelBusy(true);
    setDelError(null);
    try {
      await deleteAccount();
      await signOut();
      window.location.href = "/"; // gone — back to a clean home page
    } catch (err) {
      setDelError(err instanceof Error ? err.message : "Could not delete your account");
      setDelBusy(false);
    }
  }

  return (
    <SidePanel open={open} title="Settings" onClose={onClose}>
      {email && <p className="mb-6 truncate text-sm text-muted-foreground">Signed in as {email}</p>}

      {/* Change password */}
      <section>
        <h3 className="font-display text-base">Change password</h3>
        <form onSubmit={changePassword} className="mt-3 space-y-3">
          <Input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="New password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Repeat new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {pwError && <p className="text-xs text-missing">{pwError}</p>}
          <Button type="submit" disabled={pwBusy} className="w-full">
            {pwBusy ? <Loader2 className="size-4 animate-spin" /> : pwDone ? <Check className="size-4" /> : null}
            {pwDone ? "Password updated" : "Update password"}
          </Button>
        </form>
      </section>

      {/* Language — coming soon */}
      <section className="mt-8 border-t border-border pt-6">
        <h3 className="flex items-center gap-2 font-display text-base text-muted-foreground">
          <Globe className="size-4" /> Language
        </h3>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground">
          English
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">More coming soon</span>
        </div>
      </section>

      {/* Danger zone */}
      <section className="mt-8 border-t border-border pt-6">
        <h3 className="flex items-center gap-2 font-display text-base text-missing">
          <Trash2 className="size-4" /> Delete account
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This permanently removes your account, credits, and saved scans. It can&apos;t be undone.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Type <span className="font-mono font-semibold text-foreground">DELETE</span> to confirm:
        </p>
        <Input
          className="mt-2"
          placeholder="DELETE"
          value={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.value)}
        />
        {delError && <p className="mt-2 text-xs text-missing">{delError}</p>}
        <Button
          variant="outline"
          disabled={confirmDelete !== "DELETE" || delBusy}
          onClick={removeAccount}
          className="mt-3 w-full border-missing/40 text-missing hover:bg-missing/5"
        >
          {delBusy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          Delete my account
        </Button>
      </section>
    </SidePanel>
  );
}
