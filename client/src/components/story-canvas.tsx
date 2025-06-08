import { useState } from "react";
import { GripVertical, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StorySection {
  id: number;
  title: string;
  content: string;
  wordCount: number;
  status: "complete" | "in-progress" | "draft";
  lastEdited: string;
}

interface StoryCanvasProps {
  story: {
    id: number;
    title: string;
    sections?: StorySection[];
  };
}

export default function StoryCanvas({ story }: StoryCanvasProps) {
  const [sections, setSections] = useState<StorySection[]>(story.sections || []);
  const [draggedSection, setDraggedSection] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-success text-white";
      case "in-progress": return "bg-warning text-white";
      case "draft": return "bg-gray-400 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "complete": return "Complete";
      case "in-progress": return "In Progress";
      case "draft": return "Draft";
      default: return "Draft";
    }
  };

  const handleDragStart = (e: React.DragEvent, sectionId: number) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedSection === null) return;

    const draggedIndex = sections.findIndex(section => section.id === draggedSection);
    if (draggedIndex === -1) return;

    const newSections = [...sections];
    const [draggedItem] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedItem);

    setSections(newSections);
    setDraggedSection(null);
  };

  const addNewSection = () => {
    const newSection: StorySection = {
      id: Date.now(),
      title: "New Section",
      content: "",
      wordCount: 0,
      status: "draft",
      lastEdited: "Just now"
    };
    setSections([...sections, newSection]);
  };

  const deleteSection = (sectionId: number) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  return (
    <div className="space-y-4">
      {sections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto mb-2" />
            <p>No sections yet. Start building your story!</p>
          </div>
          <Button onClick={addNewSection}>
            Add First Section
          </Button>
        </div>
      ) : (
        <>
          {sections.map((section, index) => (
            <Card
              key={section.id}
              className="cursor-move hover:shadow-md transition-shadow"
              draggable
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {section.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getStatusColor(section.status)}`}>
                      {getStatusLabel(section.status)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteSection(section.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {section.content || "No content yet..."}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{section.wordCount} words</span>
                  <span>{Math.max(1, Math.ceil(section.wordCount / 200))} min read</span>
                  <span>Last edited {section.lastEdited}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Section */}
          <Card 
            className="border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-primary transition-colors cursor-pointer"
            onClick={addNewSection}
          >
            <CardContent className="p-8 flex flex-col items-center justify-center text-gray-400 hover:text-primary transition-colors">
              <Plus className="w-8 h-8 mb-2" />
              <p className="text-sm">Add new section</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
