
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
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShortTermSkills() {
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
          Required Skills & Qualifications
        </h3>
        <p className="text-white/60">
          Define the expertise needed for this short-term project
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Award className="w-5 h-5 text-teal-400" />
              </div>
              <Label className="text-white">Professional Requirements</Label>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white/60 text-sm">Minimum Years of Experience</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/60 text-sm">Professional Certifications</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                    <SelectValue placeholder="Select certifications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpa">CPA Required</SelectItem>
                    <SelectItem value="preferred">CPA Preferred</SelectItem>
                    <SelectItem value="none">Not Required</SelectItem>
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
              <Label className="text-white">Industry Knowledge</Label>
            </div>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select industry expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essential">Essential</SelectItem>
                <SelectItem value="preferred">Preferred</SelectItem>
                <SelectItem value="not-required">Not Required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <BookOpen className="w-5 h-5 text-teal-400" />
              </div>
              <Label className="text-white">Technical Skills</Label>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a required skill"
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
                <GraduationCap className="w-5 h-5 text-teal-400" />
              </div>
              <Label className="text-white">Education Requirements</Label>
            </div>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select minimum education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                <SelectItem value="masters">Master's Degree</SelectItem>
                <SelectItem value="none">No Specific Requirement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
