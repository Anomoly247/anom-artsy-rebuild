import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Heart, CheckCircle2, TrendingUp, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

const CAUSES = ["Environmental", "Education", "Health", "Community", "Technology", "Arts", "Social Justice"];

interface ProjectFormData {
  title: string;
  description: string;
  cause: string;
  coinRewardPerTask: string;
}

export default function CollaborationStation() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    cause: "Community",
    coinRewardPerTask: "10",
  });
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [newTask, setNewTask] = useState("");
  const [newUpdate, setNewUpdate] = useState("");

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading, refetch: refetchProjects } = trpc.collaboration.getProjects.useQuery({ limit: 50 });

  // Fetch user's projects
  const { data: myProjects = [], refetch: refetchMyProjects } = trpc.collaboration.getMyProjects.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Fetch selected project details
  const { data: projectDetails, refetch: refetchProjectDetails } = trpc.collaboration.getProject.useQuery(
    { projectId: selectedProject! },
    { enabled: selectedProject !== null }
  );

  // Fetch project tasks
  const { data: projectTasks = [], refetch: refetchTasks } = trpc.collaboration.getTasks.useQuery(
    { projectId: selectedProject! },
    { enabled: selectedProject !== null }
  );

  // Fetch project updates
  const { data: projectUpdates = [], refetch: refetchUpdates } = trpc.collaboration.getUpdates.useQuery(
    { projectId: selectedProject! },
    { enabled: selectedProject !== null }
  );

  // Create project mutation
  const createProjectMutation = trpc.collaboration.createProject.useMutation({
    onSuccess: () => {
      toast.success("Project created! 🎉");
      setFormData({ title: "", description: "", cause: "Community", coinRewardPerTask: "10" });
      refetchProjects();
      refetchMyProjects();
    },
    onError: (error) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });

  // Join project mutation
  const joinProjectMutation = trpc.collaboration.joinProject.useMutation({
    onSuccess: () => {
      toast.success("Joined project! 🤝");
      refetchMyProjects();
      refetchProjectDetails();
    },
    onError: (error) => {
      toast.error(`Failed to join project: ${error.message}`);
    },
  });

  // Create task mutation
  const createTaskMutation = trpc.collaboration.createTask.useMutation({
    onSuccess: () => {
      toast.success("Task created! ✅");
      setNewTask("");
      refetchTasks();
      refetchUpdates();
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  // Complete task mutation
  const completeTaskMutation = trpc.collaboration.completeTask.useMutation({
    onSuccess: () => {
      toast.success("Task completed! +10 coins 🎉");
      refetchTasks();
      refetchUpdates();
    },
    onError: (error) => {
      toast.error(`Failed to complete task: ${error.message}`);
    },
  });

  // Add update mutation
  const addUpdateMutation = trpc.collaboration.addUpdate.useMutation({
    onSuccess: () => {
      toast.success("Update posted! 📢");
      setNewUpdate("");
      refetchUpdates();
    },
    onError: (error) => {
      toast.error(`Failed to post update: ${error.message}`);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Collaboration Station...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to join social good projects</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleCreateProject = () => {
    if (!formData.title || !formData.cause) {
      toast.error("Please fill in all required fields");
      return;
    }
    createProjectMutation.mutate(formData);
  };

  const handleCreateTask = () => {
    if (!newTask || !selectedProject) {
      toast.error("Please enter a task title");
      return;
    }
    createTaskMutation.mutate({
      projectId: selectedProject,
      title: newTask,
    });
  };

  const handleAddUpdate = () => {
    if (!newUpdate || !selectedProject) {
      toast.error("Please enter an update");
      return;
    }
    addUpdateMutation.mutate({
      projectId: selectedProject,
      content: newUpdate,
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#7a7f8e]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold neon-text-magenta">Collaboration Station</h1>
          </div>
          <p className="text-sm text-[#7a7f8e]">
            {myProjects.length} projects • {projects.length} total
          </p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="bg-[#1a1f2e] border border-[#2a2f3e] mb-8">
            <TabsTrigger value="discover" className="text-[#00eaff]">
              <TrendingUp className="w-4 h-4 mr-2" />
              Discover Projects
            </TabsTrigger>
            <TabsTrigger value="my-projects" className="text-[#00eaff]">
              <Users className="w-4 h-4 mr-2" />
              My Projects
            </TabsTrigger>
            <TabsTrigger value="create" className="text-[#00eaff]">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {projectsLoading ? (
              <p className="text-[#7a7f8e]">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-[#7a7f8e]">No projects available yet. Be the first to create one!</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const isJoined = myProjects.some((p) => p.id === project.id);
                  return (
                    <Card
                      key={project.id}
                      className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#ff00cc] transition-colors cursor-pointer"
                      onClick={() => setSelectedProject(project.id)}
                      style={{
                        boxShadow: "0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#00eaff]">{project.title}</h3>
                          <p className="text-xs text-[#7a7f8e] mt-1">Cause: {project.cause}</p>
                        </div>
                        {isJoined && <CheckCircle2 className="w-5 h-5 text-[#00eaff]" />}
                      </div>

                      <p className="text-sm text-[#7a7f8e] mb-4 line-clamp-2">{project.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-[#ff00cc] font-bold">+{project.coinRewardPerTask} coins/task</span>
                        <span className="text-xs text-[#7a7f8e]">Created by user #{project.creatorId}</span>
                      </div>

                      {!isJoined ? (
                        <Button
                          className="w-full btn-neon-cyan gap-2 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            joinProjectMutation.mutate({ projectId: project.id });
                          }}
                        >
                          <Users className="w-3 h-3" />
                          Join Project
                        </Button>
                      ) : (
                        <Button
                          className="w-full btn-neon-magenta gap-2 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project.id);
                          }}
                        >
                          <Heart className="w-3 h-3" />
                          View Details
                        </Button>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* My Projects Tab */}
          <TabsContent value="my-projects" className="space-y-6">
            {myProjects.length === 0 ? (
              <p className="text-[#7a7f8e]">You haven't joined any projects yet. Discover projects to get started!</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {myProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-[#1a1f2e] border border-[#00eaff] p-6 cursor-pointer hover:border-[#ff00cc] transition-colors"
                    onClick={() => setSelectedProject(project.id)}
                    style={{
                      boxShadow: "0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)",
                    }}
                  >
                    <h3 className="text-lg font-bold text-[#00eaff] mb-2">{project.title}</h3>
                    <p className="text-sm text-[#7a7f8e] mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#ff00cc]">+{project.coinRewardPerTask} coins/task</span>
                      <Button
                        size="sm"
                        className="btn-neon-magenta text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project.id);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Create Tab */}
          <TabsContent value="create">
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-8 max-w-2xl">
              <h2 className="text-2xl font-bold text-[#ff00cc] mb-6">Create Social Good Project</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[#00eaff] font-bold mb-2">Project Title *</label>
                  <Input
                    placeholder="e.g., Community Garden Initiative"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[#0b0e14] border border-[#2a2f3e] text-[#00eaff]"
                  />
                </div>

                <div>
                  <label className="block text-[#00eaff] font-bold mb-2">Description</label>
                  <Textarea
                    placeholder="Describe your project and its impact..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0b0e14] border border-[#2a2f3e] text-[#00eaff] min-h-24"
                  />
                </div>

                <div>
                  <label className="block text-[#00eaff] font-bold mb-2">Cause Category *</label>
                  <select
                    value={formData.cause}
                    onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-[#2a2f3e] text-[#00eaff] p-2 rounded"
                  >
                    {CAUSES.map((cause) => (
                      <option key={cause} value={cause}>
                        {cause}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#00eaff] font-bold mb-2">Coins per Task Completed</label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={formData.coinRewardPerTask}
                    onChange={(e) => setFormData({ ...formData, coinRewardPerTask: e.target.value })}
                    className="bg-[#0b0e14] border border-[#2a2f3e] text-[#00eaff]"
                  />
                </div>

                <Button
                  className="w-full btn-neon-magenta gap-2 text-lg py-6"
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                >
                  <Plus className="w-5 h-5" />
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Project Details Modal */}
        {selectedProject && projectDetails && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="bg-[#1a1f2e] border border-[#ff00cc] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#ff00cc]">{projectDetails.title}</h2>
                    <p className="text-[#7a7f8e] mt-1">Cause: {projectDetails.cause}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedProject(null)}
                    className="text-[#7a7f8e]"
                  >
                    ✕
                  </Button>
                </div>

                <p className="text-[#00eaff] mb-6">{projectDetails.description}</p>

                {/* Tasks Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#00eaff] mb-4">Tasks ({projectTasks.length})</h3>
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {projectTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-[#0b0e14] border border-[#2a2f3e] p-3 rounded flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-[#00eaff] font-bold">{task.title}</p>
                          <p className="text-xs text-[#7a7f8e]">Status: {task.status}</p>
                        </div>
                        {task.status !== "completed" && (
                          <Button
                            size="sm"
                            className="btn-neon-cyan text-xs"
                            onClick={() => completeTaskMutation.mutate({ taskId: task.id })}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="flex-1 bg-[#0b0e14] border border-[#2a2f3e] text-[#00eaff] p-2 rounded"
                    />
                    <Button
                      className="btn-neon-magenta text-sm"
                      onClick={handleCreateTask}
                      disabled={createTaskMutation.isPending}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Updates Section */}
                <div>
                  <h3 className="text-lg font-bold text-[#00eaff] mb-4">Project Updates</h3>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {projectUpdates.map((update) => (
                      <div key={update.id} className="bg-[#0b0e14] border border-[#2a2f3e] p-3 rounded">
                        <p className="text-[#00eaff] text-sm">{update.content}</p>
                        <p className="text-xs text-[#7a7f8e] mt-2">
                          {new Date(update.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <textarea
                      placeholder="Share an update..."
                      value={newUpdate}
                      onChange={(e) => setNewUpdate(e.target.value)}
                      className="flex-1 bg-[#0b0e14] border border-[#2a2f3e] text-[#00eaff] p-2 rounded text-sm min-h-20"
                    />
                    <Button
                      className="btn-neon-magenta text-sm"
                      onClick={handleAddUpdate}
                      disabled={addUpdateMutation.isPending}
                    >
                      Post
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full btn-neon-cyan mt-6"
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
