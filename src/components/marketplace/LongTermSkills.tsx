
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  Scale,
  Users,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LongTermSkills() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-semibold text-white mb-4">
          Partnership Requirements
        </h3>
        <p className="text-white/60">
          Define the qualifications needed for this long-term partnership
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Users className="w-5 h-5 text-teal-400" />
              </div>
              <Label className="text-white">Team Requirements</Label>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white/60 text-sm">Minimum Team Size</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 professionals</SelectItem>
                    <SelectItem value="6-15">6-15 professionals</SelectItem>
                    <SelectItem value="16-30">16-30 professionals</SelectItem>
                    <SelectItem value="30+">30+ professionals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/60 text-sm">Partner Involvement</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                    <SelectValue placeholder="Select partner involvement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct Oversight</SelectItem>
                    <SelectItem value="periodic">Periodic Review</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Scale className="w-5 h-5 text-teal-400" />
              </div>
              <Label className="text-white">Quality Standards</Label>
            </div>
            <div className="space-y-4">
              <Select>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select quality framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iso">ISO Certified</SelectItem>
                  <SelectItem value="peer">Peer Review Program</SelectItem>
                  <SelectItem value="custom">Custom Standards</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <BookOpen className="w-5 h-5 text-teal-400" />
              </div>
              <Label className="text-white">Core Competencies</Label>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a required competency"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button 
                  onClick={addSkill}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <div 
                    key={skill}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-white text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-white/60 hover:text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Award className="w-5 h-5 text-teal-400" />
              </div>
              <Label className="text-white">Track Record</Label>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white/60 text-sm">Years in Business</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                    <SelectValue placeholder="Select minimum years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-20">11-20 years</SelectItem>
                    <SelectItem value="20+">20+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
