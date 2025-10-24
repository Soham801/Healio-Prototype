import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      date: new Date().toLocaleDateString(),
      content: "Today I felt grateful for...",
    },
  ]);
  const [currentEntry, setCurrentEntry] = useState("");

  const handleSave = () => {
    if (!currentEntry.trim()) {
      toast.error("Please write something first");
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      content: currentEntry,
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry("");
    toast.success("Journal entry saved!");
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast.success("Entry deleted");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Journal</h1>
        <p className="text-muted-foreground">
          Express your thoughts and track your journey
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">New Entry</h2>
        <div className="space-y-4">
          <Textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="How are you feeling today? What's on your mind?"
            className="min-h-[200px] resize-none"
          />
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Entry
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Entries</h2>
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No entries yet. Start journaling to track your thoughts and feelings.
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-6 hover:shadow-glow transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
