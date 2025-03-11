
import React, { useState } from "react";
import { Zap, Code, FileText, Users, TrendingUp, Timer, Layers, Plus, Target, CheckCircle, ArrowUpRight, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle, ToxicCardDescription, ToxicCardFooter } from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Mock active projects
const activeProjects = [
  {
    id: 'p001',
    title: "Protocol Improvement XYZ",
    type: "Protocol Development",
    description: "Enhance core protocol functionality with new features",
    status: "in_progress",
    completion: 65,
    contributors: 4,
    funding: "$2800",
    milestones: [
      { title: "Research", status: "completed" },
      { title: "Development", status: "in_progress" },
      { title: "Testing", status: "pending" },
      { title: "Deployment", status: "pending" }
    ]
  },
  {
    id: 'p002',
    title: "Community Content Series",
    type: "Content Creation",
    description: "Weekly educational content about the ecosystem",
    status: "in_progress",
    completion: 45,
    contributors: 2,
    funding: "$1200",
    milestones: [
      { title: "Content Plan", status: "completed" },
      { title: "First Articles", status: "completed" },
      { title: "Video Series", status: "in_progress" },
      { title: "Distribution", status: "pending" }
    ]
  }
];

// Mock project templates
const projectTemplates = [
  {
    title: "Protocol Development",
    description: "Create a development project for protocol improvements or new features",
    pool: "Task Party Pool",
    reward: "Milestone-based payments",
    icon: <Code className="h-6 w-6 text-toxic-neon" />
  },
  {
    title: "Community Growth",
    description: "Launch initiatives to grow and engage the community",
    pool: "Participation Party Pool",
    reward: "Activity-based rewards",
    icon: <Users className="h-6 w-6 text-toxic-neon" />
  },
  {
    title: "Content Creation",
    description: "Create educational or promotional content for the ecosystem",
    pool: "Task Party Pool",
    reward: "Per-piece payment",
    icon: <FileText className="h-6 w-6 text-toxic-neon" />
  }
];

export const SurvivorHub: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Mock survivor stats
  const survivorStats = {
    totalFunding: "$4000",
    activeProjects: 2,
    completedProjects: 3,
    contributors: 6
  };
  
  // Handler for creating new project
  const handleCreateProject = (template?: any) => {
    // TODO: Implement project creation flow
    console.log("Creating new project", template);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
            <Zap className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </TabsTrigger>
          <TabsTrigger value="manage" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
            <Layers className="h-4 w-4 mr-2" />
            Manage Projects
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          {/* Survivor Stats Dashboard */}
          <ToxicCard className="bg-gray-900/60 border border-toxic-neon/40">
            <ToxicCardHeader>
              <div className="flex justify-between items-center">
                <ToxicCardTitle>Survivor Project Hub</ToxicCardTitle>
                <span className="text-toxic-neon font-mono text-sm px-3 py-1 rounded-full bg-black/60 border border-toxic-neon/40">
                  Technical Contributor
                </span>
              </div>
              <ToxicCardDescription>
                Create and manage technical projects in the wasteland
              </ToxicCardDescription>
            </ToxicCardHeader>
            <ToxicCardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Total Funding</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{survivorStats.totalFunding}</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Active Projects</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{survivorStats.activeProjects}</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Completed</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{survivorStats.completedProjects}</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Contributors</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{survivorStats.contributors}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Projects</h3>
                <div className="space-y-4">
                  {activeProjects.map((project) => (
                    <div key={project.id} className="bg-black/30 p-4 rounded-lg border border-toxic-neon/30 hover:border-toxic-neon/50 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-medium">{project.title}</h4>
                          <p className="text-sm text-gray-400">{project.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-toxic-neon/20 text-toxic-neon">
                            {project.status === 'in_progress' ? 'In Progress' : project.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-300 mt-2 mb-3">{project.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-400">Funding</p>
                          <p className="text-white font-mono">{project.funding}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Contributors</p>
                          <p className="text-white font-mono">{project.contributors}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Completion</p>
                          <div className="flex items-center gap-2">
                            <Progress value={project.completion} className="h-2 w-16" />
                            <span className="text-toxic-neon">{project.completion}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-white mb-2">Milestones</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {project.milestones.map((milestone, idx) => (
                            <div 
                              key={idx} 
                              className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
                                milestone.status === 'completed' 
                                  ? 'bg-toxic-neon/20 text-toxic-neon border border-toxic-neon/40' 
                                  : milestone.status === 'in_progress'
                                  ? 'bg-blue-400/10 text-blue-400 border border-blue-400/40'
                                  : 'bg-gray-800 text-gray-400 border border-gray-700'
                              }`}
                            >
                              {milestone.title}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <ToxicButton variant="outline" size="sm">
                          Manage Project
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </ToxicButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ToxicCardContent>
            <ToxicCardFooter>
              <ToxicButton variant="outline" onClick={() => setActiveTab("create")}>
                <Plus className="h-4 w-4 mr-1" />
                Create New Project
              </ToxicButton>
            </ToxicCardFooter>
          </ToxicCard>
        </TabsContent>
        
        <TabsContent value="create" className="space-y-6">
          <Card className="bg-gray-900/60 border border-toxic-neon/20">
            <CardHeader>
              <CardTitle className="text-white">Create a New Project</CardTitle>
              <CardDescription>
                Start a new development or community project using templates or custom creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projectTemplates.map((template, idx) => (
                  <Card key={idx} className="bg-black/40 border-toxic-neon/20 hover:border-toxic-neon/40 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {template.icon}
                        <CardTitle className="text-lg text-white">{template.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pool Type:</span>
                          <span className="text-toxic-neon">{template.pool}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reward Structure:</span>
                          <span className="text-white">{template.reward}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <ToxicButton 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCreateProject(template)}
                      >
                        Use Template
                      </ToxicButton>
                    </CardFooter>
                  </Card>
                ))}
                
                {/* Custom Project Card */}
                <Card className="bg-black/40 border-dashed border-toxic-neon/30 hover:border-toxic-neon/50 transition-all">
                  <CardContent className="flex flex-col items-center justify-center h-full py-10">
                    <div className="rounded-full bg-toxic-neon/10 p-3 mb-4">
                      <Plus className="h-6 w-6 text-toxic-neon" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Custom Project</h3>
                    <p className="text-gray-400 text-sm text-center mb-4">
                      Create a fully customized project with your own parameters and milestones
                    </p>
                    <ToxicButton 
                      variant="outline"
                      onClick={() => handleCreateProject()}
                    >
                      Start from Scratch
                    </ToxicButton>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <ToxicButton variant="ghost" onClick={() => setActiveTab("dashboard")}>
                Back to Dashboard
              </ToxicButton>
              
              <ToxicButton variant="tertiary">
                <FileText className="h-4 w-4 mr-1" />
                View Documentation
              </ToxicButton>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-6">
          <Card className="bg-gray-900/60 border border-toxic-neon/20">
            <CardHeader>
              <CardTitle className="text-white">Manage Your Projects</CardTitle>
              <CardDescription>
                Edit, update and track progress of all your active and completed projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div key={project.id} className="bg-black/30 p-4 rounded-lg border border-toxic-neon/30 hover:border-toxic-neon/50 transition-all">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h4 className="text-white font-medium">{project.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-400">{project.type}</span>
                          <div className="bg-gray-800 h-1 w-1 rounded-full"></div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-toxic-neon/20 text-toxic-neon">
                            {project.status === 'in_progress' ? 'In Progress' : project.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3 md:mt-0">
                        <div className="flex flex-col text-right">
                          <span className="text-sm text-gray-400">Completion</span>
                          <span className="text-toxic-neon">{project.completion}%</span>
                        </div>
                        <Progress value={project.completion} className="h-2 w-20" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Funding:</span>
                          <span className="text-white ml-1 font-mono">{project.funding}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Contributors:</span>
                          <span className="text-white ml-1">{project.contributors}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <ToxicButton variant="tertiary" size="sm">
                          Update Status
                        </ToxicButton>
                        <ToxicButton variant="tertiary" size="sm">
                          Edit Project
                        </ToxicButton>
                        <ToxicButton variant="outline" size="sm">
                          Manage Team
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </ToxicButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
